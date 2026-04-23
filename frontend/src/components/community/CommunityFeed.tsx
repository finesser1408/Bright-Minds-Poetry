
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PoemCard } from "./PoemCard";
import { Search, TrendingUp, Clock, Heart, Sparkles } from "lucide-react";

interface CommunityFeedProps {
  currentUser: string;
}

export const CommunityFeed = ({ currentUser }: CommunityFeedProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/lib/api").then(({ fetchPoems }) => {
      fetchPoems().then(res => {
        setPoems(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);

  const filteredPoems = poems.filter(poem =>
    poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poem.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (poem.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPoems = [...filteredPoems].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      case "trending":
        return ((b.likes?.length || 0) + (b.comments?.length || 0)) - ((a.likes?.length || 0) + (a.comments?.length || 0));
      default:
        return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  });

  return (
    <div className="space-y-6 p-6">
      {/* Feed Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="text-crimson animate-pulse" size={24} />
          <h2 className="text-3xl font-playfair font-bold bg-gradient-to-r from-crimson to-pink-600 bg-clip-text text-transparent">
            Poetry Community
          </h2>
          <Sparkles className="text-crimson animate-pulse" size={24} />
        </div>
        <p className="text-muted-foreground text-lg">
          Discover, engage, and be inspired by our talented community of writers
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="border-2 border-muted/50 shadow-lg bg-gradient-to-r from-white/90 to-muted/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search for poems, poets, or dive into content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-2 border-muted/30 rounded-xl focus:border-crimson/50 bg-white/80"
              />
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("recent")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  sortBy === "recent" 
                    ? "bg-crimson hover:bg-crimson/90 text-white shadow-lg" 
                    : "hover:bg-muted/50 border-2"
                }`}
              >
                <Clock size={16} />
                Recent
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  sortBy === "popular" 
                    ? "bg-crimson hover:bg-crimson/90 text-white shadow-lg" 
                    : "hover:bg-muted/50 border-2"
                }`}
              >
                <Heart size={16} />
                Popular
              </Button>
              <Button
                variant={sortBy === "trending" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("trending")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  sortBy === "trending" 
                    ? "bg-crimson hover:bg-crimson/90 text-white shadow-lg" 
                    : "hover:bg-muted/50 border-2"
                }`}
              >
                <TrendingUp size={16} />
                Trending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Poems Feed */}
      <div className="space-y-6">
        {sortedPoems.length > 0 ? (
          sortedPoems.map((poem, index) => (
            <div key={poem.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <PoemCard poem={poem} currentUser={currentUser} />
            </div>
          ))
        ) : (
          <Card className="border-2 border-dashed border-muted/50 bg-muted/10">
            <CardContent className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-playfair font-semibold mb-2">No poems found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or explore different categories.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
