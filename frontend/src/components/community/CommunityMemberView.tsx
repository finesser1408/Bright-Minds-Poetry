import { useState, useEffect } from "react";
import { CommunityDashboard } from "./CommunityDashboard";
import { PoemSubmissionForm } from "./PoemSubmissionForm";
import { CommunityFeed } from "./CommunityFeed";

// --- Sub-component: Curator's Index (Highlights) ---
const CommunityHighlightsSection = () => {
  const [highlights, setHighlights] = useState<any>({
    top_liked: [],
    top_commented: [],
    most_recent: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const { fetchCommunityHighlights } = await import("@/lib/api");
        const res = await fetchCommunityHighlights();
        setHighlights({
          top_liked: res.data?.top_liked || [],
          top_commented: res.data?.top_commented || [],
          most_recent: res.data?.most_recent || null,
        });
      } catch (err) {
        console.error("Failed to load community highlights.");
      } finally {
        setLoading(false);
      }
    };
    loadHighlights();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-100 pt-10">
      {/* High Appreciation */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-50 pb-2">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">Most Appreciated</h4>
          <span className="text-[10px] font-mono text-zinc-300">{highlights.top_liked.length}</span>
        </div>
        <div className="space-y-6 min-h-[120px]">
          {highlights.top_liked.length > 0 ? (
            highlights.top_liked.map((poem: any) => (
              <div key={poem.id} className="group cursor-default">
                <p className="font-serif text-lg text-zinc-900 group-hover:text-zinc-500 transition-colors leading-tight">
                  {poem.title}
                </p>
                <p className="text-xs text-zinc-400 uppercase tracking-tighter mt-1">By {poem.author}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-300 font-serif italic text-sm pt-2">No entries yet this season</p>
          )}
        </div>
      </div>

      {/* Deep Discussion */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-50 pb-2">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">In Discussion</h4>
          <span className="text-[10px] font-mono text-zinc-300">{highlights.top_commented.length}</span>
        </div>
        <div className="space-y-6 min-h-[120px]">
          {highlights.top_commented.length > 0 ? (
            highlights.top_commented.map((poem: any) => (
              <div key={poem.id} className="group">
                <p className="font-serif text-lg text-zinc-900 leading-tight">{poem.title}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-tighter mt-1">By {poem.author}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-300 font-serif italic text-sm pt-2">Quiet in the gallery today</p>
          )}
        </div>
      </div>

      {/* Fresh Ink */}
      <div className="space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">Fresh Ink</h4>
        <div
          className={`p-8 rounded-[2rem] transition-all duration-500 ${highlights.most_recent
              ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200'
              : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
            }`}
        >
          {highlights.most_recent ? (
            <>
              <p className="font-serif text-2xl mb-2 leading-tight tracking-tight">
                {highlights.most_recent.title}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">
                By {highlights.most_recent.author}
              </p>
              <div className="h-px bg-white/10 w-full mb-6" />
              <p className="text-xs text-zinc-400 italic font-serif">Recently Published</p>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="font-serif italic text-sm">Waiting for the first spark</p>
              <p className="text-[10px] uppercase mt-4 tracking-widest opacity-40">0 Recent Submissions</p>
            </div>
          )}
        </div>
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
    <div className="min-h-screen bg-white selection:bg-zinc-900 selection:text-white">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pb-24">

        {/* Core Dashboard UI */}
        <div className="pt-8">
          <CommunityDashboard
            userData={userData}
            onSignOut={onSignOut}
            scrollToCommunityHighlights={scrollToCommunityHighlights}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Dynamic Content Sections */}
        <div className="mt-20">
          {activeSection === "dashboard" && (
            <div className="space-y-32">

              {/* Curator Index Section */}
              <section id="community-highlights" className="scroll-mt-10">
                <div className="mb-12 max-w-2xl">
                  <h2 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">The Index</h2>
                  <p className="text-zinc-500 font-medium mt-3 leading-relaxed">
                    A curated selection of notable works and fresh contributions currently moving through the community.
                  </p>
                </div>
                <CommunityHighlightsSection />
              </section>

            </div>
          )}

          {activeSection === "poetry-community" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="mb-16 border-b border-zinc-100 pb-12">
                <h2 className="text-5xl font-serif font-bold text-zinc-900 tracking-tighter">The Gallery</h2>
                <p className="text-zinc-500 text-lg mt-4 max-w-xl font-medium">
                  A collective stream of thought, rhythm, and imagery.
                </p>
              </div>
              <CommunityFeed currentUser={userData.name} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};