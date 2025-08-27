
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Camera, User, Mail, MapPin, Calendar, Edit3 } from "lucide-react";

interface ProfileSettingsProps {
  userData: {
    name: string;
    email: string;
  };
}

export const ProfileSettings = ({ userData }: ProfileSettingsProps) => {
  const [profile, setProfile] = useState({
    displayName: userData.name,
    bio: "",
    location: "",
    favoriteGenre: "",
    writingSince: "",
    website: "",
    socialLinks: {
      twitter: "",
      instagram: "",
      linkedin: "",
    }
  });

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile on mount
  React.useEffect(() => {
    fetch('/api/profiles/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProfileId(data[0].id);
          setAvatarUrl(data[0].avatar || "");
          setProfile({
            displayName: data[0].username || userData.name,
            bio: data[0].bio || "",
            location: data[0].location || "",
            favoriteGenre: data[0].favorite_genre || "",
            writingSince: data[0].writing_since || "",
            website: data[0].website || "",
            socialLinks: {
              twitter: data[0].twitter || "",
              instagram: data[0].instagram || "",
              linkedin: data[0].linkedin || "",
            }
          });
        }
      });
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileId) return;
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    // Upload avatar to backend
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch(`/api/profiles/${profileId}/`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload avatar');
      const updated = await res.json();
      setAvatarUrl(updated.avatar || "");
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "Could not upload avatar. Try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!profileId) return;
    try {
      const payload = {
        bio: profile.bio,
        location: profile.location,
        favorite_genre: profile.favoriteGenre,
        writing_since: profile.writingSince,
        website: profile.website,
        twitter: profile.socialLinks.twitter,
        instagram: profile.socialLinks.instagram,
        linkedin: profile.socialLinks.linkedin,
      };
      const res = await fetch(`/api/profiles/${profileId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Could not update profile. Try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfile({
      displayName: userData.name,
      bio: "",
      location: "",
      favoriteGenre: "",
      writingSince: "",
      website: "",
      socialLinks: {
        twitter: "",
        instagram: "",
        linkedin: "",
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={profile.displayName} />
                ) : (
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-crimson to-pink-500 text-white">
                    {userData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-playfair font-bold">{profile.displayName}</h2>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <span>{userData.email}</span>
              </div>
              
              {profile.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-3">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} className="text-crimson" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and writing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Your city, country"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="favoriteGenre">Favorite Poetry Genre</Label>
              <Input
                id="favoriteGenre"
                placeholder="e.g., Contemporary, Romantic, Free Verse"
                value={profile.favoriteGenre}
                onChange={(e) => setProfile({ ...profile, favoriteGenre: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="writingSince">Writing Since</Label>
              <Input
                id="writingSince"
                placeholder="e.g., 2020"
                value={profile.writingSince}
                onChange={(e) => setProfile({ ...profile, writingSince: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell the community about yourself and your writing journey..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          
          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile} className="bg-crimson hover:bg-crimson/90">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Writing Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} className="text-crimson" />
            Writing Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-crimson">3</div>
              <div className="text-sm text-muted-foreground">Poems Published</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-crimson">12</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-crimson">5</div>
              <div className="text-sm text-muted-foreground">Comments Received</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-crimson">7</div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
