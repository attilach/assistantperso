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
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { title, body } = await req.json().catch(() => ({}));
  if (!title || !body) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: subs } = await admin.from("push_subscriptions").select("endpoint, p256dh, auth");

  if (!subs?.length) return NextResponse.json({ sent: 0 });

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const payload = JSON.stringify({
    title,
    body,
    url: "/",
    tag: "nag",
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

  return NextResponse.json({
    sent: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
  });
}
