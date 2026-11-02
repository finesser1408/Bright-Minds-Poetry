import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface CommunitySettingsProps {
  userData: {
    name: string;
    email: string;
  };
}

export const CommunitySettings = ({ userData }: CommunitySettingsProps) => {
  const [notifications, setNotifications] = useState({
    newComments: true,
    newLikes: true,
    weeklyDigest: false,
    communityUpdates: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPoems: true,
  });
  const [profile, setProfile] = useState({
    displayName: userData.name,
    bio: "",
    location: "",
  });

  const saveSettings = (category: string) => {
    toast({
      title: "Changes Saved",
      description: `${category} preferences have been updated.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-16 border-b border-zinc-100 pb-10">
        <h2 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">Settings</h2>
        <p className="text-zinc-500 mt-3 font-medium">Manage your identity, visibility, and interface preferences.</p>
      </div>

      <div className="space-y-24">

        {/* Profile Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-zinc-900">Identity</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">This information is shared across the community and on your public works.</p>
          </div>
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Public Display Name</Label>
                <Input
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="border-zinc-200 focus:border-zinc-900 focus:ring-0 rounded-none h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Bio</Label>
                <Input
                  placeholder="Writer, dreamer, observer..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="border-zinc-200 focus:border-zinc-900 focus:ring-0 rounded-none h-12"
                />
              </div>
            </div>
            <Button
              onClick={() => saveSettings("Profile")}
              className="bg-zinc-900 text-white rounded-full px-8 hover:bg-zinc-800 transition-all uppercase tracking-widest text-[10px] font-bold"
            >
              Update Identity
            </Button>
          </div>
        </section>


        {/* Notifications Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-zinc-50 pt-20">
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-zinc-900">Notifications</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Choose which community events trigger an alert.</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            {[
              { id: 'newComments', label: 'New Comments', desc: 'Alerts when someone interacts with your verses.' },
              { id: 'newLikes', label: 'Appreciation', desc: 'When your work is marked as a favorite.' },
              { id: 'weeklyDigest', label: 'The Weekly Review', desc: 'A curated summary of the week’s best works.' },
            ].map((n) => (
              <div key={n.id} className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-zinc-900">{n.label}</Label>
                  <p className="text-xs text-zinc-400">{n.desc}</p>
                </div>
                <Switch
                  checked={(notifications as any)[n.id]}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, [n.id]: checked })}
                  className="data-[state=checked]:bg-zinc-900"
                />
              </div>
            ))}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => saveSettings("Notification")}
                className="rounded-full border-zinc-200 px-8 uppercase tracking-widest text-[10px] font-bold"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-zinc-50 pt-20">
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-zinc-900">Privacy</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Manage your presence and visibility in the gallery.</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            {[
              { id: 'profileVisible', label: 'Public Curator Profile', desc: 'Allow others to find your collection.' },
              { id: 'showEmail', label: 'Display Email', desc: 'Make your email address visible for inquiries.' },
              { id: 'showPoems', label: 'Archive Visibility', desc: 'List your published poems in the public stream.' },
            ].map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-zinc-900">{p.label}</Label>
                  <p className="text-xs text-zinc-400">{p.desc}</p>
                </div>
                <Switch
                  checked={(privacy as any)[p.id]}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, [p.id]: checked })}
                  className="data-[state=checked]:bg-zinc-900"
                />
              </div>
            ))}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => saveSettings("Privacy")}
                className="rounded-full border-zinc-200 px-8 uppercase tracking-widest text-[10px] font-bold"
              >
                Save Privacy Settings
              </Button>
            </div>
          </div>
        </section>

      </div>

      {/* Danger Zone */}
      <footer className="mt-32 pt-12 border-t border-zinc-100">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300">Account Control</p>
        <button className="mt-4 text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">
          Permanently deactivate account
        </button>
      </footer>
    </div>
  );
};