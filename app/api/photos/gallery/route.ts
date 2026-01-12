import { auth } from "@clerk/nextjs/server";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { users, userPhotos } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const photos = await db.query.userPhotos.findMany({
    where: eq(userPhotos._user, user.id),
    orderBy: [desc(userPhotos.order)],
  });

  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existingPhotos = await db.query.userPhotos.findMany({
    where: eq(userPhotos._user, user.id),
  });

  if (existingPhotos.length >= 6) {
    return NextResponse.json(
      { error: "Maximum 6 photos allowed" },
      { status: 400 }
    );
  }

  const blob = await put(`gallery/${user.id}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  const [photo] = await db
    .insert(userPhotos)
    .values({
      _user: user.id,
      url: blob.url,
      order: existingPhotos.length,
    })
    .returning();

  return NextResponse.json({ photo });
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const photoId = searchParams.get("id");

  if (!photoId) {
    return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const photo = await db.query.userPhotos.findFirst({
    where: and(eq(userPhotos.id, photoId), eq(userPhotos._user, user.id)),
  });

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  await del(photo.url);
  await db.delete(userPhotos).where(eq(userPhotos.id, photoId));

  return NextResponse.json({ success: true });
}
