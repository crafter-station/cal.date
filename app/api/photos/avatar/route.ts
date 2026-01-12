import { auth } from "@clerk/nextjs/server";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

  if (user.avatarUrl) {
    try {
      await del(user.avatarUrl);
    } catch {
      // Old avatar might not exist, continue
    }
  }

  const blob = await put(`avatars/${user.id}/${file.name}`, file, {
    access: "public",
  });

  await db
    .update(users)
    .set({ avatarUrl: blob.url, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return NextResponse.json({ url: blob.url });
}

export async function DELETE() {
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

  if (user.avatarUrl) {
    await del(user.avatarUrl);
    await db
      .update(users)
      .set({ avatarUrl: null, updatedAt: new Date() })
      .where(eq(users.id, user.id));
  }

  return NextResponse.json({ success: true });
}
