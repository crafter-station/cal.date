import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, users, insertPostSchema } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const result = await db.query.posts.findMany({
    where: eq(posts._user, user.id),
  });
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const parsed = insertPostSchema.safeParse({ ...body, _user: user.id });
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const [post] = await db.insert(posts).values(parsed.data).returning();
  return NextResponse.json(post);
}
