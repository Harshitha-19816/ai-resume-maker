import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userIdToDelete } = await params;
        
        // 1. Authenticate the admin making the request
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminEmailStr = process.env.ADMIN_EMAILS || "";
        if (adminEmailStr && !adminEmailStr.split(',').includes(user.email || "")) {
            return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
        }

        // 2. Validate Service Role Key for Admin Access
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!serviceRoleKey) {
            return NextResponse.json(
                { error: "Missing Service Role Key. Cannot perform admin deletions." }, 
                { status: 500 }
            );
        }

        // Prevent admin from deleting themselves
        if (user.id === userIdToDelete) {
            return NextResponse.json(
                { error: "You cannot delete your own admin account." }, 
                { status: 400 }
            );
        }

        // 3. Initialize Admin Client to bypass RLS and Auth scoping
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

        // 4. Delete the user
        // Note: Because of ON DELETE CASCADE in the database schema, 
        // deleting the auth.user will automatically wipe their resumes, profiles, and data.
        const { data, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ success: true, message: "User permanently deleted." });

    } catch (error: any) {
        console.error("Admin Delete User Error:", error);
        return NextResponse.json(
            { error: "Failed to delete account", message: error.message },
            { status: 500 }
        );
    }
}
