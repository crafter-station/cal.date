import { db } from "@/lib/db";
import { users, userPhotos } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { Settings } from "lucide-react";
import { getTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return {
      title: "Profile not found | cal.date",
    };
  }

  const displayName = user.displayName || user.username || "User";
  const description = user.bio || `Book a date with ${displayName} on cal.date`;

  return {
    title: `${displayName} | cal.date`,
    description,
    openGraph: {
      title: `${displayName} | cal.date`,
      description,
      url: `https://cal.date/@${username}`,
      siteName: "cal.date",
      type: "profile",
      images: [
        {
          url: `https://cal.date/${username}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${displayName} on cal.date`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} | cal.date`,
      description,
      creator: `@${username}`,
      images: [`https://cal.date/${username}/opengraph-image`],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const { userId } = await auth();

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    notFound();
  }

  const photos = await db.query.userPhotos.findMany({
    where: eq(userPhotos._user, user.id),
    orderBy: [asc(userPhotos.order)],
  });

  const displayName = user.displayName || user.username || "User";
  const isOwner = userId && user.clerkId === userId;
  const theme = getTheme(user.theme);
  const t = theme.styles;

  return (
    <main className={cn("relative min-h-screen", t.background)}>
      <div className={cn(
        "pointer-events-none fixed inset-y-0 left-0 z-10 w-6 border-r lg:w-12",
        t.border,
        t.sidebar
      )} />
      <div className={cn(
        "pointer-events-none fixed inset-y-0 right-0 z-10 w-6 border-l lg:w-12",
        t.border,
        t.sidebar
      )} />
      
      <div className={cn("mx-auto max-w-6xl border-x", t.border)}>
        <header className={cn(
          "flex h-14 items-center justify-between border-b px-6 backdrop-blur-sm",
          t.border,
          t.card
        )}>
          <Link 
            href="/" 
            className={cn("font-display text-sm tracking-tight", t.text)}
          >
            cal.date
          </Link>
          <div className="flex items-center gap-3">
            <span className={cn("text-xs", t.textMuted)}>
              /{user.username}
            </span>
            {isOwner && (
              <Link href="/settings">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8", t.textMuted, "hover:bg-white/10")}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-2">
          <section className={cn(
            "flex flex-col items-center justify-center border-b px-6 py-16 lg:border-b-0 lg:border-r",
            t.border,
            t.sidebar
          )}>
            <div className="w-full max-w-sm">
              <div className={cn(
                "relative mx-auto h-40 w-40 overflow-hidden rounded-full p-1 bg-gradient-to-br",
                t.accent
              )}>
                <div className="h-full w-full overflow-hidden rounded-full bg-white">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={displayName}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  ) : (
                    <div className={cn(
                      "flex h-full w-full items-center justify-center text-5xl font-light",
                      t.textMuted
                    )}>
                      {(user.displayName?.[0] || user.username?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 text-center">
                <h1 className={cn("font-display text-3xl tracking-tight", t.text)}>
                  {displayName}
                </h1>
                <p className={cn("mt-1 text-sm", t.textMuted)}>
                  @{user.username}
                </p>
              </div>

              {user.bio && (
                <>
                  <div className="my-8 flex items-center gap-4">
                    <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20", t.textMuted)} />
                    <span className={cn("text-[10px] uppercase tracking-widest", t.textMuted)}>
                      About
                    </span>
                    <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20", t.textMuted)} />
                  </div>
                  <p className={cn("text-center text-sm leading-relaxed", t.textMuted)}>
                    {user.bio}
                  </p>
                </>
              )}

              <div className={cn("my-10 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20", t.textMuted)} />

              {user.bookingUrl ? (
                <>
                  <Button 
                    className={cn("w-full transition-all duration-300", t.button)}
                    size="lg"
                    asChild
                  >
                    <a href={user.bookingUrl} target="_blank" rel="noopener noreferrer">
                      Book a Date
                    </a>
                  </Button>
                  <p className={cn("mt-4 text-center text-xs", t.textMuted)}>
                    Pick a time that works for both of you
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <p className={cn("text-sm", t.textMuted)}>
                    Booking link coming soon
                  </p>
                </div>
              )}

              {isOwner && (
                <div className="mt-6 text-center">
                  <Link 
                    href="/settings" 
                    className={cn("inline-flex items-center gap-2 text-xs transition-colors", t.textMuted)}
                  >
                    <Settings className="h-3 w-3" />
                    Edit your profile
                  </Link>
                </div>
              )}
            </div>
          </section>

          <section className={cn("flex flex-col", t.sidebar)}>
            {photos.length > 0 ? (
              <>
                <div className={cn("flex items-center gap-4 border-b px-6 py-4", t.border)}>
                  <span className={cn("text-[10px] uppercase tracking-widest", t.textMuted)}>
                    Gallery
                  </span>
                  <div className={cn("h-px flex-1 bg-gradient-to-r from-current to-transparent opacity-20", t.textMuted)} />
                  <span className={cn("text-xs", t.textMuted)}>
                    {photos.length} photo{photos.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex-1 p-6">
                  <div className="grid h-full grid-cols-2 gap-3">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className={cn(
                          "group relative overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg",
                          index === 0 && photos.length > 1 
                            ? "col-span-2 aspect-[2/1]" 
                            : "aspect-square"
                        )}
                      >
                        <Image
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className={cn("mx-auto mb-4 h-px w-16 bg-gradient-to-r from-transparent via-current to-transparent opacity-20", t.textMuted)} />
                  <p className={cn("text-sm", t.textMuted)}>No photos yet</p>
                  <div className={cn("mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-current to-transparent opacity-20", t.textMuted)} />
                </div>
              </div>
            )}

            <footer className={cn("border-t px-6 py-4 backdrop-blur-sm", t.border, t.card)}>
              <div className="flex items-center justify-between">
                <a
                  href="https://cal.date"
                  className={cn("text-xs transition-colors", t.textMuted)}
                >
                  Create your own profile
                </a>
                <div className="flex items-center gap-3">
                  <div className={cn("h-3 w-px opacity-30", t.accentSolid)} />
                  <span className={cn("text-[10px] uppercase tracking-widest", t.textMuted)}>
                    cal.date
                  </span>
                </div>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
