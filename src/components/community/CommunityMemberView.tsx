
import { useState, useEffect } from "react";
import { CommunityDashboard } from "./CommunityDashboard";
import { PoemSubmissionForm } from "./PoemSubmissionForm";
import { CommunityFeed } from "./CommunityFeed";

// Community Highlights Section
const CommunityHighlightsSection = () => {
  const [highlights, setHighlights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    import("@/lib/api").then(({ fetchCommunityHighlights }) => {
      fetchCommunityHighlights().then(res => {
        setHighlights(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);
  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading highlights...</div>;
  if (!highlights) return <div className="text-center py-8 text-destructive">Could not load highlights.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-4">
        <div className="text-3xl mb-2">💖</div>
        <div className="font-bold text-crimson mb-1">Top Liked Poems</div>
        {highlights.top_liked && highlights.top_liked.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {highlights.top_liked.map((poem: any) => (
              <li key={poem.id}><span className="font-semibold">{poem.title}</span> by {poem.author}</li>
            ))}
          </ul>
        ) : <div className="text-xs text-muted-foreground">No liked poems yet.</div>}
      </div>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-4">
        <div className="text-3xl mb-2">💬</div>
        <div className="font-bold text-green-600 mb-1">Top Commented Poems</div>
        {highlights.top_commented && highlights.top_commented.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {highlights.top_commented.map((poem: any) => (
              <li key={poem.id}><span className="font-semibold">{poem.title}</span> by {poem.author}</li>
            ))}
          </ul>
        ) : <div className="text-xs text-muted-foreground">No commented poems yet.</div>}
      </div>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-4">
        <div className="text-3xl mb-2">🆕</div>
        <div className="font-bold text-blue-600 mb-1">Most Recent Poem</div>
        {highlights.most_recent ? (
          <div>
            <span className="font-semibold">{highlights.most_recent.title}</span> by {highlights.most_recent.author}
          </div>
        ) : <div className="text-xs text-muted-foreground">No poems yet.</div>}
      </div>
    </div>
  );
};

interface CommunityMemberViewProps {
  userData: {
    name: string;
    email: string;
  };
  onSignOut: () => void;
}

export const CommunityMemberView = ({ userData, onSignOut }: CommunityMemberViewProps) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const scrollToCommunityHighlights = () => {
    const element = document.getElementById('community-highlights');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Dashboard Section - At the top */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <CommunityDashboard 
          userData={userData} 
          onSignOut={onSignOut}
          scrollToCommunityHighlights={scrollToCommunityHighlights}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>

      {/* Conditional Content Based on Active Section */}
      {activeSection === "dashboard" && (
        <>
          {/* Community Stats Banner */}
          <div id="community-highlights" className="bg-gradient-to-r from-crimson/10 via-pink-50/50 to-purple-100/50 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-playfair text-foreground mb-2">
                🎭 Community Highlights
              </h2>
              <p className="text-muted-foreground">See the top poems and most recent community achievements</p>
            </div>
            <CommunityHighlightsSection />
          </div>

          {/* Poem Submission Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <PoemSubmissionForm userData={userData} />
          </div>
        </>
      )}

      {activeSection === "poetry-community" && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <CommunityFeed currentUser={userData.name} />
        </div>
      )}
    </div>
  );
};
