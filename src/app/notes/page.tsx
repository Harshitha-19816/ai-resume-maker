"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Plus,
    FileText,
    MoreVertical,
    Trash2,
    Loader2,
    BookOpen,
    Edit3,
} from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (!error && data) {
            setNotes(data);
        }
        setLoading(false);
    };

    const handleSaveNote = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Please fill out both title and content");
            return;
        }

        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        if (editingId) {
            // Update existing
            const { error } = await supabase
                .from("notes")
                .update({ title, content, updated_at: new Date().toISOString() })
                .eq("id", editingId)
                .eq("user_id", user.id);

            if (!error) {
                toast.success("Note updated");
                setNotes(notes.map(n => n.id === editingId ? { ...n, title, content, updated_at: new Date().toISOString() } : n));
                setDialogOpen(false);
            } else {
                toast.error("Failed to update note");
            }
        } else {
            // Create new
            const { data, error } = await supabase
                .from("notes")
                .insert({ user_id: user.id, title, content })
                .select()
                .single();

            if (!error && data) {
                toast.success("Note created");
                setNotes([data, ...notes]);
                setDialogOpen(false);
            } else {
                toast.error("Failed to create note");
            }
        }
        setSaving(false);
    };

    const openEditDialog = (note: Note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setDialogOpen(true);
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setTitle("");
        setContent("");
        setDialogOpen(true);
    };

    const deleteNote = async (id: string) => {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (!error) {
            setNotes(notes.filter((n) => n.id !== id));
            toast.success("Note deleted");
        } else {
            toast.error("Failed to delete note");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060918] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060918] flex">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-100 items-center flex gap-3">
                                <BookOpen className="w-6 h-6 text-emerald-400" /> Notes Saver
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Jot down important ideas, contacts, or references
                            </p>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openCreateDialog} className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 rounded-xl shadow-md shadow-emerald-500/20 font-semibold">
                                    <Plus className="w-4 h-4" /> New Note
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass border-white/10 text-slate-100 rounded-2xl max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-slate-100">{editingId ? "Edit Note" : "Create New Note"}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-2">
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Note title..."
                                        className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 h-11 rounded-xl"
                                    />
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your note here..."
                                        className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-600 min-h-[200px] rounded-xl resize-none"
                                    />
                                    <Button
                                        onClick={handleSaveNote}
                                        disabled={saving || !title.trim() || !content.trim()}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 rounded-xl"
                                    >
                                        {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                        {editingId ? "Update Note" : "Save Note"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Notes Grid */}
                    {notes.length === 0 ? (
                        <div className="text-center py-20 glass-card rounded-2xl border-white/5 mx-auto max-w-lg mt-10">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-100 mb-2">No notes yet</h2>
                            <p className="text-slate-500 mb-6 text-sm">
                                Create your first note.
                            </p>
                            <Button
                                onClick={openCreateDialog}
                                className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 rounded-xl"
                            >
                                <Plus className="w-4 h-4" /> Create Note
                            </Button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="glass-card flex flex-col rounded-2xl overflow-hidden group border border-white/5 p-5 relative"
                                >
                                    <div className="absolute top-4 right-4 z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="glass border-white/10 text-slate-300">
                                                <DropdownMenuItem onClick={() => openEditDialog(note)} className="gap-2 hover:bg-white/5">
                                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteNote(note.id)} className="gap-2 text-red-400 hover:bg-red-500/10 focus:text-red-400">
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <h3 className="font-semibold text-slate-100 text-lg mb-2 pr-8 truncate">
                                        {note.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 whitespace-pre-wrap break-words line-clamp-4 flex-1">
                                        {note.content}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-4 border-t border-white/5 pt-3">
                                        Updated: {new Date(note.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
