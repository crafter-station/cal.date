import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, userPhotos } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { THEMES } from "@/lib/themes";

const themeIds = Object.keys(THEMES) as [string, ...string[]];

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().max(50).optional(),
  bio: z.string().max(300).optional(),
  bookingUrl: z.string().url().optional().or(z.literal("")),
  theme: z.enum(themeIds).optional(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: userId,
        email,
      })
      .returning();

    user = newUser;
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

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = updateProfileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { username, displayName, bio, bookingUrl, theme } = result.data;

  let user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: userId,
        email,
      })
      .returning();

    user = newUser;
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (existingUser && existingUser.id !== user.id) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 }
    );
  }

  await db
    .update(users)
    .set({
      username,
      displayName: displayName || null,
      bio: bio || null,
      bookingUrl: bookingUrl || null,
      theme: theme || "clean",
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return NextResponse.json({ success: true });
}
