import { db } from "@/lib/db";
import { users, userPhotos } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const photos = await db.query.userPhotos.findMany({
    where: eq(userPhotos._user, user.id),
    orderBy: [asc(userPhotos.order)],
  });

  return NextResponse.json({
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    bookingUrl: user.bookingUrl,
    theme: user.theme || "clean",
    photos: photos.map((p) => ({ id: p.id, url: p.url })),
  });
}
