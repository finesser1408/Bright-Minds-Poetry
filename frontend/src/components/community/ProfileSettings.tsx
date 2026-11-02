import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Camera, Mail, MapPin, Globe, Feather, Info } from "lucide-react";
import { apiClient, currentCsrfToken, getCsrfToken } from "@/lib/api";

interface ProfileSettingsProps {
  userData: {
    name: string;
    email: string;
  };
  stats?: {
    poemsCount: number;
    likesCount: number;
  };
}

export const ProfileSettings = ({ userData, stats }: ProfileSettingsProps) => {
  const [profile, setProfile] = useState({
    displayName: userData.name,
    bio: "",
    location: "",
    favoriteGenre: "",
    writingSince: "",
    website: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/profiles/');
        const data = res.data;
        if (data && data.length > 0) {
          const p = data[0];
          setProfileId(p.id);
          setAvatarUrl(p.avatar || "");
          setProfile({
            displayName: p.username || userData.name,
            bio: p.bio || "",
            location: p.location || "",
            favoriteGenre: p.favorite_genre || "",
            writingSince: p.writing_since || "",
            website: p.website || "",
          });
        } else {
          console.log("No profile returned from API even after fetch");
        }
      } catch (err: any) {
        console.error("Profile fetch failed:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          toast({ 
            title: "Session Expired", 
            description: "Please sign out and sign in again to edit your profile.",
            variant: "destructive"
          });
        }
      }
    };
    fetchProfile();
  }, [userData.name]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileId) {
      if (!profileId) toast({ title: "Error", description: "Profile ID missing. Please refresh.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const csrfToken = currentCsrfToken() || await getCsrfToken();
      const res = await apiClient.patch(`/profiles/${profileId}/`, formData, {
        headers: { 'X-CSRFToken': csrfToken }
      });
      setAvatarUrl(res.data.avatar || "");
      toast({ title: "Avatar updated" });
    } catch (err: any) {
      console.error("Avatar upload failed:", err.response?.data || err.message);
      toast({ title: "Upload failed", description: err.response?.data?.avatar?.[0] || "Could not upload image.", variant: "destructive" });
    }
  };

  const handleSaveProfile = async () => {
    if (!profileId) {
      toast({ title: "Profile Error", description: "Could not find your profile ID. Please refresh.", variant: "destructive" });
      return;
    }
    try {
      const csrfToken = currentCsrfToken() || await getCsrfToken();
      const response = await apiClient.patch(`/profiles/${profileId}/`, {
        bio: profile.bio,
        location: profile.location,
        favorite_genre: profile.favoriteGenre,
        writing_since: profile.writingSince,
        website: profile.website,
      }, { headers: { 'X-CSRFToken': csrfToken } });
      setIsEditing(false);
      toast({ title: "Profile saved successfully" });
    } catch (error: any) {
      console.error("Save failed details:", error.response?.data || error.message);
      toast({ 
        title: "Save failed", 
        description: error.response?.data?.detail || "Could not save changes at this time.",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-24">

      {/* Editorial Header */}
      <header className="relative flex flex-col md:flex-row items-center md:items-end gap-10 border-b border-zinc-100 pb-16">
        <div className="relative group">
          <Avatar className="w-40 h-40 border-[6px] border-white shadow-2xl">
            {avatarUrl ? (
              <AvatarImage 
                src={avatarUrl.startsWith('http') ? avatarUrl : `${import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).origin : window.location.origin}${avatarUrl}`} 
                className="object-cover" 
              />
            ) : (
              <AvatarFallback className="text-4xl bg-zinc-900 text-white font-serif">
                {userData.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full"
          >
            <Camera size={24} />
          </button>
          <input ref={fileInputRef} type="file" onChange={handleAvatarUpload} className="hidden" />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Contributor</span>
            <h1 className="text-5xl font-serif font-bold text-zinc-900 tracking-tight mt-1">
              {profile.displayName}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-zinc-500 font-medium">
            <span className="flex items-center gap-2"><Mail size={14} /> {userData.email}</span>
            {profile.location && <span className="flex items-center gap-2"><MapPin size={14} /> {profile.location}</span>}
            {profile.website && <span className="flex items-center gap-2"><Globe size={14} /> {profile.website}</span>}
          </div>
        </div>

        <Button
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          className={`rounded-full px-8 uppercase tracking-widest text-[10px] font-bold transition-all ${isEditing ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200" : "bg-zinc-900 text-white"
            }`}
        >
          {isEditing ? "Save Biography" : "Edit Profile"}
        </Button>
      </header>

      {/* Main Form Area */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <aside className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold">The Narrative</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Define your presence in the gallery. This information helps others understand your perspective and style.
            </p>
          </div>

          {/* Internal Stats - No Cards, just clean numbers */}
          <div className="pt-10 space-y-8 border-t border-zinc-50">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Publications</p>
              <p className="text-3xl font-serif font-bold">{stats?.poemsCount || 0} <span className="text-sm font-sans font-normal text-zinc-300">Works</span></p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Appreciation</p>
              <p className="text-3xl font-serif font-bold">{stats?.likesCount || 0} <span className="text-sm font-sans font-normal text-zinc-300">Likes</span></p>
            </div>
          </div>
        </aside>

        <div className="md:col-span-2 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Public Name</Label>
              <Input
                value={profile.displayName}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="border-0 border-b border-zinc-100 rounded-none focus-visible:ring-0 focus-visible:border-zinc-900 px-0 text-lg font-serif"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Home Base</Label>
              <Input
                value={profile.location}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="border-0 border-b border-zinc-100 rounded-none focus-visible:ring-0 focus-visible:border-zinc-900 px-0 text-lg font-serif"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Preferred Genre</Label>
              <Input
                value={profile.favoriteGenre}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, favoriteGenre: e.target.value })}
                className="border-0 border-b border-zinc-100 rounded-none focus-visible:ring-0 focus-visible:border-zinc-900 px-0 text-lg font-serif"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Member Since</Label>
              <Input
                value={profile.writingSince}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, writingSince: e.target.value })}
                className="border-0 border-b border-zinc-100 rounded-none focus-visible:ring-0 focus-visible:border-zinc-900 px-0 text-lg font-serif"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">The Curator's Statement (Bio)</Label>
            <Textarea
              value={profile.bio}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="min-h-[150px] border-zinc-100 focus-visible:ring-0 focus-visible:border-zinc-900 rounded-2xl p-6 italic font-serif text-lg leading-relaxed bg-zinc-50/50"
              placeholder="Describe your writing journey..."
            />
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-6">
              <Button onClick={handleSaveProfile} className="bg-zinc-900 text-white rounded-full px-10 font-bold text-[10px] uppercase tracking-widest">
                Save Changes
              </Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-[10px] uppercase tracking-widest font-bold">
                Discard
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Subtle Footer Stats */}
      <footer className="pt-12 border-t border-zinc-100 flex justify-between items-center opacity-40 grayscale">
        <div className="flex gap-10">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter"><Feather size={12} /> Active Contributor</div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter"><Info size={12} /> Verification: Verified</div>
        </div>
        <div className="text-[10px] font-mono italic">ID: PRF_{profileId || '000'}</div>
      </footer>
    </div>
  );
};