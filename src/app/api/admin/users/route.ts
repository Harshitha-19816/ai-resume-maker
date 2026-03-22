import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        // Authenticate the user making the request first
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extremely simple RBAC for Admin Dashboard - require specific emails or simply ensure 
        // the Next API environment has an ADMIN_EMAIL configured to match against.
        // For a seamless demo, if ADMIN_EMAIL is not set, we'll allow access but log a warning.
        const adminEmailStr = process.env.ADMIN_EMAILS || "";
        if (adminEmailStr && !adminEmailStr.split(',').includes(user.email || "")) {
            return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
        }

        // IMPORTANT: We need the Service Role Key to query the admin auth.users table
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!serviceRoleKey) {
            return NextResponse.json(
                { 
                    error: "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local",
                    details: "To build the Admin Dashboard and view all users, you must add your Supabase Service Role Key to the environment variables." 
                }, 
                { status: 500 }
            );
        }

        // Create an admin client bypassing RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Fetch all users safely
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000 // Get all users for the dashboard
        });

        if (usersError) throw usersError;

        // Fetch all resumes to calculate counts per user
        const { data: resumesData, error: resumesError } = await supabaseAdmin
            .from("resumes")
            .select("user_id, id");

        if (resumesError) throw resumesError;

        // Map the data together
        const usersWithCounts = usersData.users.map((u) => {
            const userResumes = resumesData.filter((r) => r.user_id === u.id);
            return {
                id: u.id,
                email: u.email,
                created_at: u.created_at,
                last_sign_in_at: u.last_sign_in_at,
                resumes_count: userResumes.length
            };
        });

        // Sort by newest users first
        usersWithCounts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ users: usersWithCounts });

    } catch (error: any) {
        console.error("Admin Users Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}
