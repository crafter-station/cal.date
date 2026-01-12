"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
}

interface ProfilePreviewProps {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  photos: Photo[];
  bookingUrl?: string;
  className?: string;
}

export function ProfilePreview({
  username,
  displayName,
  bio,
  avatarUrl,
  photos,
  bookingUrl,
  className,
}: ProfilePreviewProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [photoErrors, setPhotoErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  useEffect(() => {
    setPhotoErrors(new Set());
  }, [photos]);

  const hasContent = username || displayName || bio || avatarUrl || photos.length > 0;
  const showAvatar = avatarUrl && !avatarError;

  const handlePhotoError = (id: string) => {
    setPhotoErrors(prev => new Set(prev).add(id));
  };

  const visiblePhotos = photos.filter(p => !photoErrors.has(p.id));

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-stone-200/60 bg-white/90 shadow-sm backdrop-blur-sm", className)}>
      <div className="flex items-center gap-4 border-b border-stone-100 px-6 py-4">
        <span className="text-[10px] uppercase tracking-widest text-stone-400">
          Preview
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
      </div>

      <div className="p-6">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 h-px w-12 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
            <p className="text-xs text-stone-500">
              Fill in your details
            </p>
            <div className="mt-4 h-px w-12 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-stone-100 ring-2 ring-stone-200/60 transition-all duration-300">
              {showAvatar ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  fill
                  className="object-cover animate-in fade-in duration-300"
                  unoptimized
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-light text-stone-300 transition-all duration-200">
                  {(displayName?.[0] || username?.[0] || "?").toUpperCase()}
                </div>
              )}
            </div>

            <h3 className={cn(
              "mt-6 font-display text-lg tracking-tight transition-colors duration-200",
              displayName ? "text-stone-900" : "text-stone-300"
            )}>
              {displayName || "Your Name"}
            </h3>
            
            <p className={cn(
              "text-xs transition-colors duration-200",
              username ? "text-stone-500" : "text-stone-300"
            )}>
              @{username || "username"}
            </p>

            {bio && (
              <>
                <div className="my-6 flex w-full items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
                  <span className="text-[10px] uppercase tracking-widest text-stone-300">
                    About
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
                </div>
                <p className="text-center text-xs leading-relaxed text-stone-500">
                  {bio}
                </p>
              </>
            )}

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

            <button
              type="button"
              className={cn(
                "w-full rounded-lg px-4 py-2.5 text-xs font-medium transition-all duration-200",
                bookingUrl 
                  ? "bg-stone-900 text-white shadow-sm" 
                  : "border border-dashed border-stone-200 bg-white text-stone-400"
              )}
              disabled
            >
              {bookingUrl ? "Book a Date" : "Add booking link"}
            </button>

            {visiblePhotos.length > 0 && (
              <>
                <div className="my-6 flex w-full items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
                  <span className="text-[10px] uppercase tracking-widest text-stone-300">
                    Photos
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
                </div>
                <div className="grid w-full grid-cols-3 gap-1.5">
                  {visiblePhotos.slice(0, 6).map((photo, i) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square overflow-hidden rounded-lg bg-stone-100 shadow-sm animate-in fade-in zoom-in-95 duration-300"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <Image
                        src={photo.url}
                        alt={`Photo ${i + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={() => handlePhotoError(photo.id)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
