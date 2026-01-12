"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ThemeId } from "@/lib/themes";

interface Photo {
  id: string;
  url: string;
}

interface ProfileData {
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bookingUrl: string | null;
  theme: ThemeId;
  photos: Photo[];
}

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isSignedIn) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSave = async (data: {
    username: string;
    displayName?: string;
    bio?: string;
    bookingUrl?: string;
    theme?: string;
  }) => {
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save");
    }

    router.push(`/@${data.username}`);
  };

  if (!isLoaded || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-white to-stone-100/50">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
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
      
      <div className="mx-auto max-w-2xl px-4 py-8">
        {profile?.username && (
          <Link 
            href={`/@${profile.username}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </Link>
        )}
        
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-stone-300" />
            <span className="text-[10px] uppercase tracking-widest text-stone-400">
              Settings
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-stone-300" />
          </div>
          <h1 className="font-display text-2xl tracking-tight text-stone-900">
            Edit Profile
          </h1>
        </div>

        <div className="rounded-2xl border border-stone-200/60 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
          <ProfileSettings
            initialData={{
              username: profile?.username,
              displayName: profile?.displayName,
              bio: profile?.bio,
              avatarUrl: profile?.avatarUrl,
              bookingUrl: profile?.bookingUrl,
              theme: profile?.theme || "clean",
              photos: profile?.photos || [],
            }}
            onSave={handleSave}
          />
        </div>
      </div>
    </main>
  );
}
