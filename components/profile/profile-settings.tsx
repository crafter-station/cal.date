"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AvatarUpload } from "@/components/photos/avatar-upload";
import { GalleryManager } from "@/components/photos/gallery-manager";
import { ThemePicker } from "@/components/profile/theme-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Check, Link as LinkIcon, Palette } from "lucide-react";
import { THEMES, type ThemeId } from "@/lib/themes";

const themeIds = Object.keys(THEMES) as [string, ...string[]];

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  displayName: z.string().max(50, "Display name too long").optional(),
  bio: z.string().max(300, "Bio must be less than 300 characters").optional(),
  bookingUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  theme: z.enum(themeIds).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Photo {
  id: string;
  url: string;
}

interface ProfileSettingsProps {
  initialData: {
    username?: string | null;
    displayName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    bookingUrl?: string | null;
    theme?: ThemeId;
    photos: Photo[];
  };
  onSave: (data: ProfileFormData) => Promise<void>;
}

export function ProfileSettings({ initialData, onSave }: ProfileSettingsProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
  const [photos, setPhotos] = useState<Photo[]>(initialData.photos);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(initialData.theme || "clean");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username || "",
      displayName: initialData.displayName || "",
      bio: initialData.bio || "",
      bookingUrl: initialData.bookingUrl || "",
      theme: initialData.theme || "clean",
    },
  });

  const username = watch("username");
  const bio = watch("bio");

  const handleThemeChange = (theme: ThemeId) => {
    setSelectedTheme(theme);
    setValue("theme", theme, { shouldDirty: true });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaveStatus("saving");
    try {
      await onSave({ ...data, theme: selectedTheme });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleAddPhoto = (photo: Photo) => {
    startTransition(() => {
      setPhotos((prev) => [...prev, photo]);
    });
  };

  const handleRemovePhoto = (id: string) => {
    startTransition(() => {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col items-center">
        <AvatarUpload
          currentUrl={avatarUrl}
          onUpload={setAvatarUrl}
          onRemove={() => setAvatarUrl(null)}
        />
        <p className="mt-3 text-sm text-stone-500">
          Click or drag to upload your photo
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-xs text-stone-600">Username</Label>
          <div className="flex items-center gap-2">
            <span className="text-stone-400">cal.date/@</span>
            <Input
              id="username"
              placeholder="yourname"
              {...register("username")}
              className="flex-1 border-stone-200 bg-white transition-all focus:border-stone-800 focus:ring-2 focus:ring-stone-800/10"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
              {errors.username.message}
            </p>
          )}
          {username && (
            <p className="text-sm text-stone-500">
              Your profile: cal.date/@{username}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-xs text-stone-600">Display Name</Label>
          <Input
            id="displayName"
            placeholder="Your Name"
            {...register("displayName")}
            className="border-stone-200 bg-white transition-all focus:border-stone-800 focus:ring-2 focus:ring-stone-800/10"
          />
          {errors.displayName && (
            <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-xs text-stone-600">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell people about yourself..."
            rows={4}
            {...register("bio")}
            className="resize-none border-stone-200 bg-white transition-all focus:border-stone-800 focus:ring-2 focus:ring-stone-800/10"
          />
          <div className="flex justify-between text-sm text-stone-500">
            {errors.bio ? (
              <p className="text-destructive animate-in slide-in-from-top-1 duration-200">
                {errors.bio.message}
              </p>
            ) : (
              <span />
            )}
            <span className={bio && bio.length > 280 ? "text-amber-600" : ""}>
              {bio?.length || 0}/300
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookingUrl" className="text-xs text-stone-600">Booking Link</Label>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-stone-400" />
            <Input
              id="bookingUrl"
              type="url"
              placeholder="https://cal.com/yourname"
              {...register("bookingUrl")}
              className="flex-1 border-stone-200 bg-white transition-all focus:border-stone-800 focus:ring-2 focus:ring-stone-800/10"
            />
          </div>
          {errors.bookingUrl && (
            <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
              {errors.bookingUrl.message}
            </p>
          )}
          <p className="text-sm text-stone-500">
            Your Cal.com, Calendly, or any booking page URL
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-stone-400" />
          <Label className="text-xs text-stone-600">Profile Theme</Label>
        </div>
        <ThemePicker value={selectedTheme} onChange={handleThemeChange} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-stone-600">Photo Gallery</Label>
          <span className="text-sm text-stone-500">{photos.length}/6</span>
        </div>
        <GalleryManager
          photos={photos}
          onAdd={handleAddPhoto}
          onRemove={handleRemovePhoto}
        />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <Button
        type="submit"
        className="w-full bg-stone-900 text-white shadow-lg shadow-stone-900/20 transition-all duration-200 hover:bg-stone-800 hover:shadow-xl"
        disabled={saveStatus === "saving" || isPending}
      >
        {saveStatus === "saving" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : saveStatus === "saved" ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Saved!
          </>
        ) : saveStatus === "error" ? (
          "Error - Try Again"
        ) : isDirty ? (
          "Save Changes"
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  );
}
