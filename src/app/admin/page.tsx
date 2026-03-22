"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
    Users, 
    FileText, 
    Trash2, 
    ShieldAlert, 
    Loader2, 
    Activity,
    LogOut,
    Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string;
    resumes_count: number;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/login");
                    return;
                }
                throw new Error(data.error || "Failed to load admin data");
            }

            setUsers(data.users);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
                method: "DELETE"
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete user");
            }

            toast.success("User successfully deleted.");
            setUserToDelete(null);
            fetchUsers(); // Refresh the list
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredUsers = users.filter((u) => 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalResumes = users.reduce((acc, user) => acc + user.resumes_count, 0);

    return (
        <div className="min-h-screen bg-[#030014] text-slate-200">
            {/* Background elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Admin Access
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">System Administration</h1>
                        <p className="text-slate-400 mt-1">Manage global users, view analytics, and securely manage accounts.</p>
                    </div>
                    
                    <Link href="/dashboard">
                        <Button variant="outline" className="border-white/10 glass text-slate-300 hover:text-white">
                            <LogOut className="w-4 h-4 mr-2" /> Exit Admin
                        </Button>
                    </Link>
                </div>

                {/* Error Banner regarding missing service role */}
                {error && (
                    <div className="mb-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center text-center">
                        <ShieldAlert className="w-10 h-10 text-red-400 mb-3" />
                        <h3 className="text-lg font-bold text-red-200 mb-1">Secure Action Required</h3>
                        <p className="text-red-300 max-w-lg mb-4">{error}</p>
                        <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg font-mono">
                            Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file to enable this panel.
                        </p>
                    </div>
                )}

                {!error && (
                    <>
                        {/* Analytics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {[
                                { 
                                    label: "Total Registered Users", 
                                    value: loading ? "..." : users.length.toString(), 
                                    icon: Users,
                                    color: "text-blue-400",
                                    bg: "bg-blue-500/10"
                                },
                                { 
                                    label: "Total Resumes Created", 
                                    value: loading ? "..." : totalResumes.toString(), 
                                    icon: FileText,
                                    color: "text-violet-400",
                                    bg: "bg-violet-500/10"
                                },
                                { 
                                    label: "Active Sessions Today", 
                                    value: loading ? "..." : users.filter(u => new Date(u.last_sign_in_at).toDateString() === new Date().toDateString()).length.toString(), 
                                    icon: Activity,
                                    color: "text-amber-400",
                                    bg: "bg-amber-500/10"
                                }
                            ].map((stat, i) => (
                                <div key={i} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                                            <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Data Table */}
                        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
                                <h2 className="text-lg font-bold text-slate-200">User Management</h2>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input 
                                        placeholder="Search by email..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-10 bg-black/20 border-white/10 rounded-xl focus:border-blue-500/50"
                                    />
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-black/20 hover:bg-black/20">
                                        <TableRow className="border-white/5">
                                            <TableHead className="text-slate-400">Account User</TableHead>
                                            <TableHead className="text-slate-400">Created Date</TableHead>
                                            <TableHead className="text-slate-400">Last Sign In</TableHead>
                                            <TableHead className="text-center text-slate-400">Resumes Count</TableHead>
                                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow className="hover:bg-transparent border-0">
                                                <TableCell colSpan={5} className="h-48 text-center">
                                                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                                                    <span className="text-slate-400">Loading user database...</span>
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredUsers.length === 0 ? (
                                            <TableRow className="hover:bg-transparent border-0">
                                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                                    No users found matching "{searchQuery}"
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-xs uppercase shrink-0">
                                                                {user.email.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-200">{user.email}</span>
                                                                <span className="text-xs text-slate-500 font-mono" title={user.id}>{user.id.split('-')[0]}...</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-400 text-sm">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-slate-400 text-sm">
                                                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-slate-300 text-xs font-medium border border-white/10">
                                                            {user.resumes_count}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => setUserToDelete(user)}
                                                            className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </>
                )}

                {/* Deletion Dialog */}
                <AlertDialog open={!!userToDelete} onOpenChange={(o: boolean) => !o && setUserToDelete(null)}>
                    <AlertDialogContent className="glass border-white/10 text-slate-200 max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
                                <ShieldAlert className="w-5 h-5" /> Danger Zone
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                                Are you absolutely sure you want to permanently delete the account 
                                <span className="text-slate-200 font-medium px-1">"{userToDelete?.email}"</span>? 
                                This will instantly wipe out their auth profile and cascade delete all their {userToDelete?.resumes_count} stored resumes.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();
                                    handleDeleteUser();
                                }}
                                disabled={isDeleting}
                                className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50"
                            >
                                {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Erasing...</> : "Yes, Purge User"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
