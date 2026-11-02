import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Send, Paperclip, X } from "lucide-react";
import { createPoem, updatePoem } from "@/lib/api";

interface PoemSubmissionFormProps {
  userData: {
    name: string;
    email: string;
  };
  poemToEdit?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PoemSubmissionForm = ({ userData, poemToEdit, onSuccess, onCancel }: PoemSubmissionFormProps) => {
  const [poemTitle, setPoemTitle] = useState(poemToEdit?.title || "");
  const [poemContent, setPoemContent] = useState(poemToEdit?.content || "");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<"text" | "image" | "video" | "document">(poemToEdit?.media_type || "text");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poemTitle.trim()) {
      toast({ title: "Title Required", description: "Please name your work before sharing.", variant: "destructive" });
      return;
    }

    if (mediaType === "text" && !poemContent.trim()) {
      toast({ title: "Poem Required", description: "Please enter the text of your poem.", variant: "destructive" });
      return;
    }
    if (mediaType !== "text" && !mediaFile && !poemToEdit?.media_file) {
      toast({ title: "File Required", description: `Please select a ${mediaType} file.`, variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", poemTitle);
      formData.append("media_type", mediaType);

      if (mediaType === "text") {
        formData.append("content", poemContent);
      } else {
        if (mediaFile) {
          formData.append("media_file", mediaFile);          } else if (!poemToEdit?.media_file) {
          throw new Error("Please select a file for this media type.");
        }
        if (poemContent.trim()) formData.append("content", poemContent);
      }

      if (poemToEdit) {
        await updatePoem(poemToEdit.id, formData);
        toast({ title: "Work Updated", description: "Your changes have been saved." });
      } else {
        await createPoem(formData);
        toast({ title: "Work Published", description: "Your poem is now live in the community gallery." });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        setPoemTitle("");
        setPoemContent("");
        setMediaFile(null);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.detail || err.message || "Could not process your request at this time.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-10 px-2 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-zinc-900">
            {poemToEdit ? "Edit Your Work" : "New Submission"}
          </h2>
          <p className="text-zinc-500 mt-2 font-medium">
            {poemToEdit ? "Refine your words and update your piece." : "Add a new piece to your public portfolio."}
          </p>
        </div>
        {poemToEdit && (
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-zinc-400 hover:text-rose-500"
          >
            <X size={20} className="mr-2" />
            Cancel Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Title Input */}
        <section className="space-y-4">
          <Input
            aria-label="Title of your piece"
            required
            placeholder="Title of your piece"
            value={poemTitle}
            onChange={(e) => setPoemTitle(e.target.value)}
            className="text-4xl font-serif h-auto border-none p-0 focus-visible:ring-0 placeholder:text-zinc-200"
          />
          <div className="h-px bg-zinc-100 w-full" />
        </section>

        {/* Media Selector */}
        <section>
          <div className="flex flex-wrap gap-2 p-1 bg-zinc-50 rounded-lg w-fit border border-zinc-200">
            {(["text", "image", "video", "document"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMediaType(type)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all rounded-md ${mediaType === type
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Content Area */}
        <section className="space-y-6">
          {mediaType === "text" ? (
            <Textarea
              placeholder="Begin writing here..."
              value={poemContent}
              onChange={(e) => setPoemContent(e.target.value)}
              className="min-h-[400px] text-lg font-serif italic border-none bg-zinc-50/30 p-6 focus-visible:ring-1 focus-visible:ring-zinc-100 resize-none leading-relaxed"
            />
          ) : (
            <div className="space-y-6">
              <div className="relative group border-2 border-dashed border-zinc-200 rounded-2xl p-12 flex flex-col items-center justify-center hover:bg-zinc-50 transition-colors">
                {mediaFile ? (
                  <div className="flex items-center gap-4 text-zinc-900">
                    <Paperclip size={20} />
                    <span className="font-medium">{mediaFile.name}</span>
                    <button type="button" onClick={() => setMediaFile(null)} className="p-1 hover:bg-zinc-200 rounded">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Input
                      type="file"
                      required={!poemToEdit?.media_file}
                      accept={mediaType === "image" ? "image/*" : mediaType === "video" ? "video/*" : ".pdf,.doc,.docx,.txt,.odt,.rtf"}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => setMediaFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Select {mediaType}</p>
                    <p className="text-xs text-zinc-400 mt-1">Files up to 50MB supported</p>
                  </>
                )}
              </div>
              <Textarea
                placeholder="Optional description or transcription..."
                value={poemContent}
                onChange={(e) => setPoemContent(e.target.value)}
                className="min-h-[120px] font-serif border-zinc-100 bg-transparent resize-none"
              />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-zinc-100 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{userData.name}</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Drafting as Author</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-900 text-white hover:bg-zinc-800 px-10 py-6 rounded-full font-bold uppercase tracking-widest text-xs transition-transform active:scale-95"
          >
            {isSubmitting ? "Processing..." : poemToEdit ? "Update Work" : "Publish to Gallery"}
            <Send size={14} className="ml-2" />
          </Button>
        </footer>
      </form>
    </div>
  );
};