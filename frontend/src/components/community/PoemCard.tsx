import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Calendar, ChevronDown, ChevronUp, Feather } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { fetchComments, fetchLikes, postComment, postLike } from "@/lib/api";

interface PoemCardProps {
  poem: {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    likes_count: number;
    comments_list: Array<{
      id: string;
      user: string;
      author: string;
      content: string;
      created_at: string;
    }>;
    isLiked: boolean;
    media_type?: "text" | "image" | "video" | "document";
    media_file?: string;
  };
  currentUser: string;
}

export const PoemCard = ({ poem, currentUser }: PoemCardProps) => {
  const [isLiked, setIsLiked] = useState(poem.isLiked || false);
  const [likes, setLikes] = useState(poem.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any[]>(poem.comments_list || []);

  useEffect(() => {
    fetchLikes(Number(poem.id)).then(({ data }) => setLikes(data.length)).catch(() => undefined);
    fetchComments(Number(poem.id)).then(({ data }) => setComments(data)).catch(() => undefined);
  }, [poem.id]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        toast({ title: "Unlike is not available yet", description: "You can keep appreciating this work." });
        return;
      }
      await postLike(Number(poem.id), currentUser);
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      toast({ title: "Verse appreciated", description: "This work has been added to your favorites." });
    } catch {
      toast({ title: "Sign in required", description: "Please sign in to appreciate poems.", variant: "destructive" });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      await postComment(Number(poem.id), currentUser, newComment);
      const { data } = await fetchComments(Number(poem.id));
      setComments(data);
      setNewComment("");
      toast({ title: "Reflection shared", description: "Your comment is now part of the discussion." });
    } catch {
      toast({ title: "Sign in required", description: "Please sign in to post a reflection.", variant: "destructive" });
    }
  };

  const getMediaUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const mediaOrigin = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).origin : window.location.origin;
    return `${mediaOrigin}${path}`;
  };

  return (
    <div className="group border-b border-zinc-100 pb-16 pt-8 bg-white transition-all">
      {/* Meta Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border border-zinc-100">
            <AvatarFallback className="bg-zinc-50 text-zinc-400 font-serif text-xs">
              {(poem.author || "P").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900">{poem.author}</p>
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] uppercase tracking-widest">
              <Calendar size={10} />
              <span>{poem.date}</span>
            </div>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Feather size={16} className="text-zinc-200" />
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight leading-none">
          {poem.title}
        </h3>

        <div className="relative">
          {/* Visual Media Handling */}
          {poem.media_type === "image" && poem.media_file && (
            <div className="mb-8 overflow-hidden rounded-sm bg-zinc-50">
              <img
                src={getMediaUrl(poem.media_file)}
                alt={poem.title}
                className="w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}

          {poem.media_type === "video" && poem.media_file && (
            <div className="mb-8 rounded-sm overflow-hidden border border-zinc-100 bg-black">
              <video controls className="w-full max-h-[500px]">
                <source src={getMediaUrl(poem.media_file)} />
              </video>
            </div>
          )}

          {/* Poem Text */}
          <div className={`whitespace-pre-line text-lg font-serif leading-relaxed text-zinc-800 ${poem.media_type !== "text" ? "italic text-zinc-500 text-base" : ""}`}>
            {poem.content}
          </div>

          {poem.media_type === "document" && poem.media_file && (
            <a
              href={getMediaUrl(poem.media_file)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-[10px] uppercase tracking-widest font-bold underline underline-offset-4"
            >
              View Manuscript
            </a>
          )}
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="mt-12 flex items-center gap-8">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-colors ${isLiked ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
            }`}
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
          <span>{likes} Appreciation</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <MessageSquare size={16} />
          <span>{comments.length} Reflections</span>
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Reflections (Comments) Section */}
      {showComments && (
        <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-4">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Add a reflection</Label>
            <Textarea
              placeholder="What did these words stir in you?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] border-zinc-100 focus-visible:ring-0 focus-visible:border-zinc-900 rounded-none bg-zinc-50/50 italic font-serif"
            />
            <Button
              onClick={handleComment}
              disabled={!newComment.trim()}
              className="bg-zinc-900 text-white rounded-full px-8 uppercase tracking-widest text-[10px] font-bold"
            >
              Post Reflection
            </Button>
          </div>

          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-6 items-start">
                <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                  {(comment.user || comment.author || "P").charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold">{comment.user || comment.author}</span>
                    <span className="text-[10px] text-zinc-300 italic">{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : "Just now"}</span>
                  </div>
                  <p className="text-sm font-serif text-zinc-600 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};