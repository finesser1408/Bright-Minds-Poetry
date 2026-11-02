import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout as logoutRequest } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  PenTool, Heart, MessageSquare, Settings, User,
  LogOut, Library, Bookmark, Sparkles, Send
} from "lucide-react";
import { CommunitySettings } from "./CommunitySettings";
import { ProfileSettings } from "./ProfileSettings";
import { PoemSubmissionForm } from "./PoemSubmissionForm";
import { Edit2 } from "lucide-react";

// --- Sub-component: Poem Entry ---
// --- Sub-component: Poem Entry ---
const PoemEntry = ({ poem, stats, onLike, onComment, onEdit }: any) => {
  const [comment, setComment] = useState("");

  return (
    <div className="group relative border-b border-zinc-100 py-8 last:border-0">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-serif font-medium text-zinc-900 mb-1">{poem.title}</h3>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            {new Date(poem.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(poem)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-900"
        >
          <Edit2 size={16} className="mr-2" />
          Edit
        </Button>
      </div>

      <p className="text-zinc-600 leading-relaxed font-serif italic mb-6 whitespace-pre-wrap max-w-2xl">
        {poem.content}
      </p>

      <div className="flex items-center gap-6 mb-4">
        <button
          onClick={() => onLike(poem.id)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-rose-500 transition-colors"
        >
          <Heart size={18} className={stats.likes > 0 ? "fill-rose-500 text-rose-500" : ""} />
          {stats.likes}
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
          <MessageSquare size={18} />
          {stats.comments}
        </div>
      </div>

      <div className="flex gap-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity">
        <Input
          placeholder="Write a reflection..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="h-8 text-xs bg-zinc-50 border-none focus-visible:ring-1 focus-visible:ring-zinc-200"
        />
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-zinc-400 hover:text-zinc-900"
          onClick={() => { onComment(poem.id, comment); setComment(""); }}
        >
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
};

export const CommunityDashboard = ({ userData, onSignOut, activeSection, setActiveSection }: any) => {
  const [poems, setPoems] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPoem, setEditingPoem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    const { fetchPoems, fetchLikes, fetchComments } = await import('@/lib/api');
    try {
      const res = await fetchPoems(userData.name);
      const ids = res.data.map((p: any) => p.id);

      const [lData, cData] = await Promise.all([
        Promise.all(ids.map((id: number) => fetchLikes(id).then(r => r.data))),
        Promise.all(ids.map((id: number) => fetchComments(id).then(r => r.data)))
      ]);

      setPoems(res.data);
      setLikes(lData.flat());
      setComments(cData.flat());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData.name]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Navigation Bar */}
        <header className="flex justify-between items-center mb-16 border-b border-zinc-100 pb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center">
              <PenTool size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-serif font-bold tracking-tight">Studio</h2>
          </div>            <nav className="flex items-center gap-4 md:gap-8 text-sm font-medium text-zinc-500">
            {[
              { id: "dashboard", label: "Overview", icon: Library },
              { id: "poetry-community", label: "Community Feed", icon: Bookmark },
              { id: "profile", label: "Profile", icon: User },
              { id: "settings", label: "Settings", icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setEditingPoem(null); }}
                className={`transition-colors hover:text-zinc-900 ${activeSection === item.id ? "text-zinc-900 underline underline-offset-8" : ""}`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={onSignOut} className="text-rose-500 hover:text-rose-600">Exit</button>
          </nav>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main Column */}
          <div className="lg:col-span-8">
            {activeSection === "dashboard" && (
              <div className="space-y-2">
                <div className="mb-12">
                  <h1 className="text-4xl font-serif font-bold mb-2">Welcome back, {userData.name.split(' ')[0]}.</h1>
                  <p className="text-zinc-400">Your portfolio has received {likes.length} appreciations this month.</p>
                </div>

                <div className="mt-8">
                  {loading ? (
                    <div className="space-y-8 animate-pulse">
                      {[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-50 rounded-lg w-full" />)}
                    </div>
                  ) : (
                    poems.map(p => (
                      <PoemEntry
                        key={p.id}
                        poem={p}
                        stats={{
                          likes: likes.filter(l => l.poem === p.id).length,
                          comments: comments.filter(c => c.poem === p.id).length
                        }}
                        onLike={async (poemId: number) => { await import('@/lib/api').then(({ postLike }) => postLike(poemId)); fetchData(); }}
                        onComment={async (poemId: number, content: string) => { await import('@/lib/api').then(({ postComment }) => postComment(poemId, userData.name, content)); fetchData(); }}
                        onEdit={(poem: any) => {
                          setEditingPoem(poem);
                          setActiveSection("editor");
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeSection === "profile" && (
              <ProfileSettings
                userData={userData}
                stats={{ poemsCount: poems.length, likesCount: likes.length }}
              />
            )}
            {activeSection === "settings" && <CommunitySettings userData={userData} />}
            {activeSection === "editor" && (
              <PoemSubmissionForm
                userData={userData}
                poemToEdit={editingPoem}
                onSuccess={() => {
                  setEditingPoem(null);
                  setActiveSection("dashboard");
                  fetchData();
                }}
                onCancel={() => {
                  setEditingPoem(null);
                  setActiveSection("dashboard");
                }}
              />
            )}
          </div>

          {/* Sidebar / Insights */}
          <aside className="lg:col-span-4 space-y-12">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 p-6 rounded-2xl">
                  <span className="block text-2xl font-serif font-bold">{poems.length}</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Works</span>
                </div>
                <div className="bg-zinc-50 p-6 rounded-2xl">
                  <span className="block text-2xl font-serif font-bold">{likes.length}</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Likes</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">Recent Interaction</h4>
              <div className="space-y-6">
                {comments.slice(0, 3).map((c, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm text-zinc-600 leading-snug">
                        <span className="font-bold text-zinc-900">{c.user}</span> left a note on <span className="italic">"{poems.find(p => p.id === c.poem)?.title}"</span>
                      </p>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold mt-1 block">2 hours ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-zinc-900 text-white border-none p-8 rounded-3xl">
              <Sparkles className="text-zinc-400 mb-4" size={24} />
              <h3 className="text-xl font-serif mb-2">Write something new.</h3>
              <p className="text-zinc-400 text-sm mb-6">Capture a thought before it escapes the room.</p>
              <Button
                onClick={() => {
                  setEditingPoem(null);
                  setActiveSection("editor");
                }}
                className="w-full bg-white text-zinc-900 hover:bg-zinc-200"
              >
                Open Editor
              </Button>
            </Card>
          </aside>

        </main>
      </div>
    </div>
  );
};