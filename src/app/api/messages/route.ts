import { NextRequest, NextResponse } from "next/server";
import webpush, { type WebPushError } from "web-push";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type Subscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function POST(req: NextRequest) {
  // Auth: Authorization: Bearer <INBOX_TOKEN>
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!process.env.INBOX_TOKEN || token !== process.env.INBOX_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source.trim() : "";
  const messageBody = typeof body.body === "string" ? body.body.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() || null : null;
  const metadata =
    body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? body.metadata
      : null;

  if (!source || !messageBody) {
    return NextResponse.json({ error: "source and body are required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const { data: message, error: insertError } = await admin
    .from("agent_messages")
    .insert({ source, title, body: messageBody, metadata })
    .select()
    .single();

  if (insertError || !message) {
    return NextResponse.json({ error: insertError?.message ?? "insert failed" }, { status: 500 });
  }

  // Send push notification to all subscribers
  const { data: subs } = await admin.from("push_subscriptions").select("endpoint, p256dh, auth");

  let sent = 0;
  if (subs?.length) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    const notifTitle = title ? `💬 ${title}` : `💬 ${source}`;
    const notifBody = messageBody.length > 140 ? messageBody.slice(0, 137) + "..." : messageBody;

    const payload = JSON.stringify({
      title: notifTitle,
      body: notifBody,
      url: "/messages",
      tag: `message-${message.id}`,
    });

    const results = await Promise.allSettled(
      (subs as Subscription[]).map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
      )
    );

    const stale: string[] = [];
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const err = r.reason as WebPushError;
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          stale.push(subs[i].endpoint);
        }
      }
    });
    if (stale.length) {
      await admin.from("push_subscriptions").delete().in("endpoint", stale);
    }

    sent = results.filter((r) => r.status === "fulfilled").length;
  }

  return NextResponse.json({ id: message.id, notified: sent });
}
