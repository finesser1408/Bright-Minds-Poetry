
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FileText, Send, Image, Video, File, Sparkles, PenTool } from "lucide-react";

interface PoemSubmissionFormProps {
  userData: {
    name: string;
    email: string;
  };
}

export const PoemSubmissionForm = ({ userData }: PoemSubmissionFormProps) => {
  const [poemTitle, setPoemTitle] = useState("");
  const [poemContent, setPoemContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<"text" | "image" | "video" | "document">("text");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (poemTitle.trim() === "") {
      toast({
        title: "Oops! Missing Title",
        description: "Please provide a title for your poem.",
        variant: "destructive",
      });
      return;
    }
    if (mediaType === "text" && poemContent.trim() === "") {
      toast({
        title: "Oops! Missing Content",
        description: "Please provide the text of your poem.",
        variant: "destructive",
      });
      return;
    }
    if (mediaType !== "text" && !mediaFile) {
      toast({
        title: "No File Selected",
        description: `Please upload a ${mediaType} file for your poem submission.`,
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", poemTitle);
      formData.append("author", userData.name);
      formData.append("media_type", mediaType);
      if (mediaType === "text") {
        formData.append("content", poemContent);
      } else if (mediaFile) {
        formData.append("media_file", mediaFile);
      }
      // Optionally add content for non-text types if present
      if (mediaType !== "text" && poemContent.trim() !== "") {
        formData.append("content", poemContent);
      }
      await fetch("http://127.0.0.1:8000/api/poems/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      toast({
        title: "🎉 Poem Shared Successfully!",
        description: "Your creative work has been shared with the community and is inspiring others.",
      });
      setPoemTitle("");
      setPoemContent("");
      setMediaFile(null);
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your poem. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const mediaTypeHint = () => {
    switch (mediaType) {
      case "image":
        return "📸 Enhance your poetry with beautiful images to create a visual storytelling experience.";
      case "video":
        return "🎥 Create a dynamic video presentation of your poem for powerful storytelling.";
      case "document":
        return "📄 Upload formatted documents for complex poetry layouts and artistic designs.";
      default:
        return "✍️ Share your poem in elegant text format for easy reading and community engagement.";
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image size={16} />;
      case "video":
        return <Video size={16} />;
      case "document":
        return <File size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-white/95 to-muted/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-crimson/10 via-pink-50/50 to-purple-100/50 border-b border-white/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-crimson/20 rounded-full">
            <PenTool size={20} className="text-crimson" />
          </div>
          <div>
            <CardTitle className="text-xl font-playfair flex items-center gap-2">
              Share Your Poetry
              <Sparkles className="text-crimson animate-pulse" size={18} />
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Express your creativity and inspire the Bright Minds community
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="text-crimson" size={16} />
              Poem Title
            </label>
            <Input
              placeholder="Give your masterpiece a beautiful title..."
              value={poemTitle}
              onChange={(e) => setPoemTitle(e.target.value)}
              className="font-playfair text-lg border-2 border-muted/30 rounded-xl focus:border-crimson/50 bg-white/80 p-4 h-14"
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              🎭 Content Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button"
                variant={mediaType === "text" ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType("text")}
                className={`flex items-center gap-2 justify-start px-4 py-3 rounded-xl transition-all ${
                  mediaType === "text" 
                    ? "bg-crimson hover:bg-crimson/90 text-white shadow-lg" 
                    : "hover:bg-muted/50 border-2"
                }`}
              >
                {getMediaIcon("text")}
                Text
              </Button>
              <Button 
                type="button"
                variant={mediaType === "image" ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType("image")}
                className={`flex items-center gap-2 justify-start px-4 py-3 rounded-xl transition-all ${
                  mediaType === "image" 
                    ? "bg-crimson hover:bg-crimson/90 text-white shadow-lg" 
                    : "hover:bg-muted/50 border-2"
                }`}
              >
                {getMediaIcon("image")}
                Image
              </Button>
              <Button 
                type="button"
                variant={mediaType === "video" ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType("video")}
                className={`flex items-center gap-2 justify-start px-4 py-3 rounded-xl transition-all ${
                  mediaType === "video" 
                    ? "bg-crimson hover:bg-crimson/90 text-white shadow-lg" 
                    : "hover:bg-muted/50 border-2"
                }`}
              >
                {getMediaIcon("video")}
                Video
              </Button>
              <Button 
                type="button"
                variant={mediaType === "document" ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType("document")}
                className={`flex items-center gap-2 justify-start px-4 py-3 rounded-xl transition-all ${
                  mediaType === "document" 
                    ? "bg-crimson hover:bg-crimson/90 text-white shadow-lg" 
                    : "hover:bg-muted/50 border-2"
                }`}
              >
                {getMediaIcon("document")}
                Document
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-100/80 p-4 rounded-xl border border-blue-200/50">
              <p className="text-sm text-blue-800/80 font-medium">{mediaTypeHint()}</p>
            </div>
            
            {mediaType === "text" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                ✍️ Your Poetry
              </label>
              <Textarea
                placeholder="Pour your heart out here... Let your words flow like poetry should..."
                value={poemContent}
                onChange={(e) => setPoemContent(e.target.value)}
                rows={10}
                className="resize-y font-playfair text-base border-2 border-muted/30 rounded-xl focus:border-crimson/50 bg-white/80 p-4 leading-relaxed"
              />
            </div>
          )}
          {mediaType !== "text" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                {mediaType === "image" && "🖼️ Upload Image"}
                {mediaType === "video" && "🎥 Upload Video"}
                {mediaType === "document" && "📄 Upload Document"}
              </label>
              <Input
                type="file"
                accept={
                  mediaType === "image"
                    ? "image/*"
                    : mediaType === "video"
                    ? "video/*"
                    : mediaType === "document"
                    ? ".pdf,.doc,.docx,.txt,.odt,.rtf"
                    : undefined
                }
                onChange={e => setMediaFile(e.target.files?.[0] || null)}
              />
              <Textarea
                placeholder="(Optional) Add a description, context, or the text of your poem here..."
                value={poemContent}
                onChange={(e) => setPoemContent(e.target.value)}
                rows={4}
                className="resize-y font-playfair text-base border-2 border-muted/30 rounded-xl focus:border-crimson/50 bg-white/80 p-4 leading-relaxed"
              />
            </div>
          )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-white/20 p-6 bg-gradient-to-r from-muted/10 to-transparent">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-crimson to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm text-muted-foreground">
                Posting as <span className="font-semibold text-foreground">{userData.name}</span>
              </p>
            </div>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-crimson to-pink-600 hover:from-crimson/90 hover:to-pink-600/90 text-white px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
              disabled={isSubmitting}
            >
              <Send size={18} className="mr-2" />
              {isSubmitting ? "Sharing Magic..." : "Share Your Poetry"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
