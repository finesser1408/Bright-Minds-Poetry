
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, FileText, Heart, MessageSquare, Settings, User, LogOut, TrendingUp, Users } from "lucide-react";
import { CommunitySettings } from "./CommunitySettings";
import { ProfileSettings } from "./ProfileSettings";

interface CommunityDashboardProps {
  userData: {
    name: string;
    email: string;
  };
  onSignOut: () => void;
  scrollToCommunityHighlights?: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const CommunityDashboard = ({ userData, onSignOut, scrollToCommunityHighlights, activeSection, setActiveSection }: CommunityDashboardProps) => {
  const [avatarUrl] = useState<string>(""); // This would come from user profile state in a real app
  const [poems, setPoems] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/api').then(({ fetchPoems, fetchLikes, fetchComments }) => {
      fetchPoems(userData.name)
        .then(res => {
          setPoems(res.data);
          // Fetch likes/comments for all user's poems
          const poemIds = res.data.map((p:any) => p.id);
          Promise.all([
            Promise.all(poemIds.map((id:number) => fetchLikes(id).then(r => r.data))).then(arr => setLikes(arr.flat())),
            Promise.all(poemIds.map((id:number) => fetchComments(id).then(r => r.data))).then(arr => setComments(arr.flat())),
          ]).finally(() => setLoading(false));
        })
        .catch(() => { setPoems([]); setLikes([]); setComments([]); setLoading(false); });
    });
  }, [userData.name]);

  const stats = [
    { title: "Your Poems", value: poems.length, icon: FileText, color: "text-blue-600" },
    { title: "Likes Received", value: likes.length, icon: Heart, color: "text-red-600" },
    { title: "Comments", value: comments.length, icon: MessageSquare, color: "text-green-600" },
    { title: "Notifications", value: 0, icon: Bell, color: "text-orange-600" },
  ];

  type Activity = {
    type: "publish" | "like" | "comment";
    content: string;
    time: string;
    icon: any;
    user: string;
    poem: number;
  };

  const recentActivity: Activity[] = [
    ...poems.slice(0, 3).map(poem => ({
      type: "publish" as const,
      content: `You published \"${poem.title}\"`,
      time: poem.created_at ? new Date(poem.created_at).toLocaleDateString() : "-",
      icon: FileText,
      user: userData.name,
      poem: poem.id,
    })),
    ...likes.slice(0, 3).map(like => ({
      type: "like" as const,
      content: `${like.user} liked your poem (ID: ${like.poem})`,
      time: like.created_at ? new Date(like.created_at).toLocaleDateString() : "-",
      icon: Heart,
      user: like.user,
      poem: like.poem,
    })),
    ...comments.slice(0, 3).map(comment => ({
      type: "comment" as const,
      content: `${comment.user} commented: ${comment.content}`,
      time: comment.created_at ? new Date(comment.created_at).toLocaleDateString() : "-",
      icon: MessageSquare,
      user: comment.user,
      poem: comment.poem,
    })),
  ];

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <Card className="mb-6 border-none shadow-lg bg-gradient-to-r from-crimson/5 to-pink-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={userData.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-crimson to-pink-500 text-white text-2xl font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-playfair text-crimson">
                Welcome back, {userData.name}!
              </CardTitle>
              <CardDescription className="text-lg">
                Continue your poetic journey with the Bright Minds community
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Dashboard Navigation & Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:w-80">
          <div className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userData.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-crimson to-pink-500 text-white font-semibold">
                    {userData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-0">
            <nav className="flex flex-col">
              <Button 
                variant={activeSection === "dashboard" ? "secondary" : "ghost"} 
                className="justify-start rounded-none h-14 text-left"
                onClick={() => setActiveSection("dashboard")}
              >
                <FileText size={20} className="mr-3" />
                <div>
                  <div className="font-medium">Dashboard</div>
                  <div className="text-xs text-muted-foreground">Overview & activity</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="justify-start rounded-none h-14 text-left"
                onClick={scrollToCommunityHighlights}
              >
                <TrendingUp size={20} className="mr-3" />
                <div>
                  <div className="font-medium">Community Highlights</div>
                  <div className="text-xs text-muted-foreground">View community stats</div>
                </div>
              </Button>
              
              <Button 
                variant={activeSection === "poetry-community" ? "secondary" : "ghost"} 
                className="justify-start rounded-none h-14 text-left"
                onClick={() => setActiveSection("poetry-community")}
              >
                <Users size={20} className="mr-3" />
                <div>
                  <div className="font-medium">Poetry Community</div>
                  <div className="text-xs text-muted-foreground">Browse & engage with poems</div>
                </div>
              </Button>
              
              <Button 
                variant={activeSection === "profile" ? "secondary" : "ghost"} 
                className="justify-start rounded-none h-14 text-left"
                onClick={() => setActiveSection("profile")}
              >
                <User size={20} className="mr-3" />
                <div>
                  <div className="font-medium">Profile</div>
                  <div className="text-xs text-muted-foreground">Manage your profile</div>
                </div>
              </Button>
              
              <Button 
                variant={activeSection === "settings" ? "secondary" : "ghost"} 
                className="justify-start rounded-none h-14 text-left"
                onClick={() => setActiveSection("settings")}
              >
                <Settings size={20} className="mr-3" />
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">Preferences & privacy</div>
                </div>
              </Button>
              
              <div className="border-t mt-2 pt-2">
                <Button 
                  variant="ghost" 
                  className="justify-start rounded-none h-12 text-muted-foreground hover:text-destructive w-full"
                  onClick={onSignOut}
                >
                  <LogOut size={18} className="mr-3" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <stat.icon size={28} className={`${stat.color} mb-3`} />
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Poems List with Like/Comment */}
              <div className="space-y-4">
                {poems.map(poem => (
                  <Card key={poem.id} className="border shadow-sm">
                    <CardHeader>
                      <CardTitle>{poem.title}</CardTitle>
                      <CardDescription>by {poem.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">{poem.content}</p>
                      <div className="flex gap-4 items-center mb-2">
                        <Button size="sm" variant="outline" onClick={async () => {
                          const { postLike } = await import("@/lib/api");
                          await postLike(poem.id, userData.name);
                          // Optionally refetch likes
                          import("@/lib/api").then(({ fetchLikes }) => fetchLikes(poem.id).then(r => setLikes(l => [...l, ...r.data.filter((n: any) => !l.some((o: any) => o.id === n.id))])));
                        }}>
                          <Heart size={16} className="mr-1" /> Like
                        </Button>
                        <form className="flex gap-2 items-center" onSubmit={async (e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const input = form.elements.namedItem("comment") as HTMLInputElement;
                          const content = input.value;
                          if (!content) return;
                          const { postComment } = await import("@/lib/api");
                          await postComment(poem.id, userData.name, content);
                          import("@/lib/api").then(({ fetchComments }) => fetchComments(poem.id).then(r => setComments(c => [...c, ...r.data.filter((n: any) => !c.some((o: any) => o.id === n.id))])));
                          input.value = "";
                        }}>
                          <input name="comment" placeholder="Add comment..." className="px-2 py-1 border rounded text-sm" />
                          <Button size="sm" variant="outline" type="submit">
                            <MessageSquare size={14} className="mr-1" /> Comment
                          </Button>
                        </form>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{likes.filter((l: any) => l.poem === poem.id).length} likes</span>
                        <span>{comments.filter((c: any) => c.poem === poem.id).length} comments</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="text-crimson" size={20} />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Stay updated with your latest interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-crimson/20 to-pink-500/20 flex items-center justify-center">
                          <activity.icon className="text-crimson" size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.type === "like" && (
                              <>
                                {activity.user} liked your poem "{poems.find((p: any) => p.id === activity.poem)?.title || activity.poem}"
                              </>
                            )}
                            {activity.type === "comment" && (
                              <>
                                {activity.user} commented on "{poems.find((p: any) => p.id === activity.poem)?.title || activity.poem}": {activity.content}
                              </>
                            )}
                            {activity.type === "publish" && activity.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeSection === "profile" && (
            <ProfileSettings userData={userData} />
          )}
          
          {activeSection === "settings" && (
            <CommunitySettings userData={userData} />
          )}
        </div>
      </div>
    </div>
  );
};
