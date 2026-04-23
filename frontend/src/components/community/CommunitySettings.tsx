
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Monitor, Bell, Eye, Lock, User } from "lucide-react";

interface CommunitySettingsProps {
  userData: {
    name: string;
    email: string;
  };
}

export const CommunitySettings = ({ userData }: CommunitySettingsProps) => {
  const { theme, setTheme } = useTheme();
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

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy settings have been saved.",
    });
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ThemeIcon size={20} className="text-crimson" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize the appearance of your community experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun size={16} />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon size={16} />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <Monitor size={16} />
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={20} className="text-crimson" />
            <CardTitle>Profile Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              placeholder="Tell us about yourself..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Your location (optional)"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveProfile} className="bg-crimson hover:bg-crimson/90">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-crimson" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>New Comments</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone comments on your poems</p>
            </div>
            <Switch
              checked={notifications.newComments}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newComments: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>New Likes</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone likes your poems</p>
            </div>
            <Switch
              checked={notifications.newLikes}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newLikes: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Receive a weekly summary of community activity</p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Community Updates</Label>
              <p className="text-sm text-muted-foreground">Get updates about new features and events</p>
            </div>
            <Switch
              checked={notifications.communityUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, communityUpdates: checked })}
            />
          </div>
          <Button onClick={handleSaveNotifications} className="bg-crimson hover:bg-crimson/90">
            Save Notifications
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-crimson" />
            <CardTitle>Privacy</CardTitle>
          </div>
          <CardDescription>
            Control your privacy and visibility settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to other community members</p>
            </div>
            <Switch
              checked={privacy.profileVisible}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Email</Label>
              <p className="text-sm text-muted-foreground">Display your email address on your profile</p>
            </div>
            <Switch
              checked={privacy.showEmail}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Poems</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your published poems</p>
            </div>
            <Switch
              checked={privacy.showPoems}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, showPoems: checked })}
            />
          </div>
          <Button onClick={handleSavePrivacy} className="bg-crimson hover:bg-crimson/90">
            Save Privacy Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
