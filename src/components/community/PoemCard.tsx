
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, User, Calendar, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PoemCardProps {
  poem: {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    likes: number;
    comments: Array<{
      id: string;
      author: string;
      content: string;
      date: string;
    }>;
    isLiked: boolean;
  };
  currentUser: string;
}

export const PoemCard = ({ poem, currentUser }: PoemCardProps) => {
  const [isLiked, setIsLiked] = useState(poem.isLiked);
  const [likes, setLikes] = useState(poem.likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(poem.comments);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
      toast({
        title: "💔 Like removed",
        description: "You unliked this poem.",
      });
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      toast({
        title: "❤️ Poem liked!",
        description: "You liked this beautiful poem.",
      });
    }
  };

  const handleComment = () => {
    if (newComment.trim() === "") return;
    
    const comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: newComment,
      date: "just now"
    };
    
    setComments([comment, ...comments]);
    setNewComment("");
    toast({
      title: "💬 Comment added",
      description: "Your thoughtful comment has been posted.",
    });
  };

  const getGradientForAuthor = (author: string) => {
    const gradients = [
      "from-crimson to-pink-500",
      "from-blue-500 to-purple-500",
      "from-green-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-purple-500 to-indigo-500",
      "from-pink-500 to-rose-500"
    ];
    const index = author.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-crimson/30 bg-gradient-to-br from-white/95 to-muted/20 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-muted/10 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${getGradientForAuthor(poem.author)} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/50`}>
              {poem.author.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-playfair flex items-center gap-2 group-hover:text-crimson transition-colors">
                <Sparkles className="text-crimson/60" size={16} />
                {poem.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <User size={16} className="text-muted-foreground" />
                <span className="font-medium">{poem.author}</span>
                <span className="text-muted-foreground/60">•</span>
                <Calendar size={16} className="text-muted-foreground" />
                <span>{poem.date}</span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative bg-gradient-to-br from-muted/20 to-muted/40 p-6 rounded-2xl border border-white/50 shadow-inner">
          <div className="absolute top-3 left-3 text-crimson/30 text-4xl font-serif leading-none">"</div>
          <div className="mb-2">
            {/* Show image preview */}
            {poem.media_type === "image" && poem.media_file && (
              <img src={poem.media_file.startsWith('http') ? poem.media_file : `http://127.0.0.1:8000${poem.media_file}`} alt={poem.title} className="max-w-full max-h-80 rounded-xl border mb-3 mx-auto" />
            )}
            {/* Show video preview */}
            {poem.media_type === "video" && poem.media_file && (
              <video controls className="max-w-full max-h-80 rounded-xl border mb-3 mx-auto">
                <source src={poem.media_file.startsWith('http') ? poem.media_file : `http://127.0.0.1:8000${poem.media_file}`} />
                Your browser does not support the video tag.
              </video>
            )}
            {/* Show document link */}
            {poem.media_type === "document" && poem.media_file && (
              <a href={poem.media_file.startsWith('http') ? poem.media_file : `http://127.0.0.1:8000${poem.media_file}`} target="_blank" rel="noopener noreferrer" className="block text-blue-700 underline mb-3">Open Document</a>
            )}
            {/* Show text content */}
            {poem.media_type === "text" && poem.content && (
              <div className="whitespace-pre-line text-lg font-playfair text-foreground/90 leading-relaxed">{poem.content}</div>
            )}
            {/* Optionally show description for non-text */}
            {poem.media_type !== "text" && poem.content && (
              <div className="whitespace-pre-line text-base font-playfair text-foreground/70 leading-relaxed mt-2 italic">{poem.content}</div>
            )}
          </div>
          <div className="absolute bottom-3 right-3 text-crimson/30 text-4xl font-serif leading-none rotate-180">"</div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-muted/30">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleLike}
              className={`flex items-center gap-3 transition-all duration-300 px-4 py-2 rounded-xl ${
                isLiked 
                  ? 'text-crimson bg-crimson/10 hover:bg-crimson/20 border border-crimson/20' 
                  : 'text-muted-foreground hover:text-crimson hover:bg-crimson/5'
              }`}
            >
              <Heart size={20} className={`transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
              <span className="font-medium">{likes}</span>
              {isLiked && <span className="text-xs">❤️</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-3 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-4 py-2 rounded-xl"
            >
              <MessageSquare size={20} />
              <span className="font-medium">{comments.length}</span>
              {showComments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
            Poetry • Community
          </div>
        </div>
        
        {showComments && (
          <div className="space-y-6 pt-6 border-t border-muted/30 animate-fade-in">
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getGradientForAuthor(currentUser)} flex items-center justify-center text-white text-sm font-semibold shadow-md`}>
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share your thoughts on this beautiful poem..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none border-2 border-muted/30 rounded-xl focus:border-crimson/50 bg-white/80 p-4"
                />
                <Button 
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-crimson to-pink-600 hover:from-crimson/90 hover:to-pink-600/90 text-white px-6 py-2 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  💬 Post Comment
                </Button>
              </div>
            </div>
            
            {comments.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <MessageSquare className="text-blue-500" size={16} />
                  Comments ({comments.length})
                </h4>
                {comments.map((comment, index) => (
                  <div key={comment.id} className="flex gap-4 p-4 bg-gradient-to-r from-muted/20 to-muted/30 rounded-xl border border-white/50 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getGradientForAuthor(comment.author)} flex items-center justify-center text-white text-sm font-semibold shadow-md`}>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground bg-white/60 px-2 py-1 rounded-full">
                          {comment.date}
                        </span>
                      </div>
                      <p className="text-foreground/80 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
