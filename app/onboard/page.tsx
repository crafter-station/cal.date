"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { ProfilePreview } from "@/components/onboarding/profile-preview";
import { AvatarUpload } from "@/components/photos/avatar-upload";
import { GalleryManager } from "@/components/photos/gallery-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const onboardSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  displayName: z.string().max(50).optional(),
  bio: z.string().max(300).optional(),
  bookingUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type OnboardFormData = z.infer<typeof onboardSchema>;

interface Photo {
  id: string;
  url: string;
}

export default function OnboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      bookingUrl: "",
    },
  });

  const username = watch("username");
  const displayName = watch("displayName");
  const bio = watch("bio");
  const bookingUrl = watch("bookingUrl");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isSignedIn) {
      fetch("/api/profile")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Not found");
        })
        .then((data) => {
          if (data.username) {
            router.push(`/@${data.username}`);
          } else {
            setIsCheckingProfile(false);
          }
        })
        .catch(() => {
          setIsCheckingProfile(false);
        });
    }
  }, [isLoaded, isSignedIn, router]);

  const progress = useMemo(() => {
    let score = 0;
    if (username && username.length >= 3) score += 35;
    if (displayName && displayName.length > 0) score += 15;
    if (avatarUrl) score += 20;
    if (bio && bio.length > 0) score += 10;
    if (bookingUrl && bookingUrl.length > 0) score += 10;
    if (photos.length > 0) score += 10;
    return Math.min(score, 100);
  }, [username, displayName, avatarUrl, bio, bookingUrl, photos.length]);

  const onSubmit = async (data: OnboardFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === "Username already taken") {
          alert("This username is already taken. Please choose another.");
          return;
        }
        throw new Error(error.error || "Failed to save");
      }

      router.push(`/@${data.username}`);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isCheckingProfile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-white to-stone-100/50">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </main>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100/50">
      <div className="pointer-events-none fixed inset-y-0 left-0 z-10 w-6 border-r border-stone-200/60 bg-gradient-to-b from-stone-50/80 to-stone-100/40 lg:w-12" />
      <div className="pointer-events-none fixed inset-y-0 right-0 z-10 w-6 border-l border-stone-200/60 bg-gradient-to-b from-stone-100/40 to-stone-50/80 lg:w-12" />
      
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-16">
        <header className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-stone-300" />
            <span className="text-[10px] uppercase tracking-widest text-stone-400">
              Welcome
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-stone-300" />
          </div>
          <h1 className="font-display text-2xl tracking-tight text-stone-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Let others know who you are
          </p>
        </header>

        <ProgressBar progress={progress} className="mx-auto mb-12 max-w-md" />

        <div className="grid gap-12 lg:grid-cols-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 lg:col-span-3"
          >
            <section className="rounded-2xl border border-stone-200/60 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <AvatarUpload
                  currentUrl={avatarUrl}
                  onUpload={setAvatarUrl}
                  onRemove={() => setAvatarUrl(null)}
                />
                <p className="mt-4 text-xs text-stone-500">
                  Add a photo of yourself
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200/60 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-900">
                  Basic Info
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs text-stone-600">
                    Username <span className="text-stone-400">*</span>
                  </Label>
                  <div className="flex items-center border-b border-stone-200 pb-2 transition-colors focus-within:border-stone-900">
                    <span className="text-sm text-stone-400">cal.date/@</span>
                    <Input
                      id="username"
                      placeholder="yourname"
                      {...register("username")}
                      className="flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-destructive">{errors.username.message}</p>
                  )}
                </div>

                <div className="h-px bg-stone-100" />

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-xs text-stone-600">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="Your Name"
                    {...register("displayName")}
                    className="border-0 border-b border-stone-200 bg-transparent px-0 text-sm shadow-none transition-colors focus-visible:border-stone-900 focus-visible:ring-0"
                  />
                </div>

                <div className="h-px bg-stone-100" />

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs text-stone-600">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell people about yourself..."
                    rows={3}
                    {...register("bio")}
                    className="resize-none border-0 border-b border-stone-200 bg-transparent px-0 text-sm shadow-none transition-colors focus-visible:border-stone-900 focus-visible:ring-0"
                  />
                  <p className="text-right text-[10px] text-stone-400">
                    {bio?.length || 0}/300
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200/60 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-900">
                  Booking Link
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bookingUrl" className="text-xs text-stone-600">
                  Calendar URL
                </Label>
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2 transition-colors focus-within:border-stone-900">
                  <LinkIcon className="h-4 w-4 text-stone-400" />
                  <Input
                    id="bookingUrl"
                    type="url"
                    placeholder="https://cal.com/yourname"
                    {...register("bookingUrl")}
                    className="flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                  />
                </div>
                {errors.bookingUrl && (
                  <p className="text-xs text-destructive">{errors.bookingUrl.message}</p>
                )}
                <p className="text-[10px] text-stone-500">
                  Add your Cal.com, Calendly, or any booking page URL
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200/60 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-900">
                  Photo Gallery
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
                <span className="text-xs text-stone-400">{photos.length}/6</span>
              </div>
              <GalleryManager
                photos={photos}
                onAdd={(photo) => setPhotos((prev) => [...prev, photo])}
                onRemove={(id) => setPhotos((prev) => prev.filter((p) => p.id !== id))}
              />
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-stone-100" />
                <p className="text-[10px] text-stone-500">
                  Add up to 6 photos
                </p>
                <div className="h-px flex-1 bg-stone-100" />
              </div>
            </section>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
              <Button
                type="submit"
                className="bg-stone-900 px-12 text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 hover:shadow-xl"
                disabled={!username || username.length < 3 || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
            </div>
          </form>

          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-8">
              <ProfilePreview
                username={username || ""}
                displayName={displayName || ""}
                bio={bio || ""}
                avatarUrl={avatarUrl}
                photos={photos}
                bookingUrl={bookingUrl || ""}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
