import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    primary_email_address_id: string;
  };
}

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, email_addresses } = event.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (!primaryEmail) {
      return new Response("No email found", { status: 400 });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, id),
    });

    if (!existingUser) {
      await db.insert(users).values({
        clerkId: id,
        email: primaryEmail,
      });
    }
  }

  if (event.type === "user.deleted") {
    const { id } = event.data;
    await db.delete(users).where(eq(users.clerkId, id));
  }

  return new Response("OK", { status: 200 });
}
