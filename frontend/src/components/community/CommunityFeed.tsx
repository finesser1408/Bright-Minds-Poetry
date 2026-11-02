import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PoemCard } from "./PoemCard";
import { Search } from "lucide-react";

interface CommunityFeedProps {
  currentUser: string;
}

export const CommunityFeed = ({ currentUser }: CommunityFeedProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const { fetchPoems } = await import("@/lib/api");
        const res = await fetchPoems();
        setPoems(res.data || []);
      } catch (err) {
        console.error("Failed to fetch gallery items.");
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, []);

  const sortedAndFilteredPoems = useMemo(() => {
    const filtered = poems.filter(poem =>
      (poem.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poem.author || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poem.content || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.likes_count || 0) - (a.likes_count || 0);
        case "trending":
          return ((b.likes_count || 0) + (b.comments_list?.length || 0)) - ((a.likes_count || 0) + (a.comments_list?.length || 0));
        default:
          return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    });
  }, [poems, searchQuery, sortBy, currentUser]);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Search and Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-6 border-b border-zinc-100">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

          {/* Refined Search */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <Input
              placeholder="Search by title, author, or verse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 border-none bg-transparent focus-visible:ring-0 text-base placeholder:text-zinc-300 italic font-serif"
            />
          </div>

          {/* Segmented Sort Control */}
          <div className="flex bg-zinc-50 p-1 rounded-full border border-zinc-100">
            {(["recent", "popular", "trending"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSortBy(mode)}
                className={`px-6 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-bold transition-all ${sortBy === mode
                    ? "bg-zinc-900 text-white shadow-md"
                    : "text-zinc-400 hover:text-zinc-600"
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Poems Feed */}
      <div className="space-y-20">
        {loading ? (
          <div className="space-y-12 py-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="h-8 bg-zinc-50 w-1/3 rounded" />
                <div className="h-24 bg-zinc-50 w-full rounded" />
              </div>
            ))}
          </div>
        ) : sortedAndFilteredPoems.length > 0 ? (
          sortedAndFilteredPoems.map((poem, index) => (
            <div
              key={poem.id}
              className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <PoemCard poem={poem} currentUser={currentUser} />
            </div>
          ))
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-zinc-100 rounded-[2rem]">
            <h3 className="text-2xl font-serif text-zinc-900 mb-2">No results found</h3>
            <p className="text-zinc-400 font-medium">Your search did not match any works in the current collection.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 text-sm font-bold uppercase tracking-widest text-zinc-900 underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Counter */}
      <div className="pt-12 border-t border-zinc-100 flex justify-between items-center text-zinc-400">
        <span className="text-[10px] uppercase tracking-widest font-bold">
          End of Collection
        </span>
        <span className="font-mono text-xs italic">
          {sortedAndFilteredPoems.length} Items Displayed
        </span>
      </div>
    </div>
  );
};