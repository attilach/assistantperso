import { NextRequest, NextResponse } from "next/server";
import webpush, { type WebPushError } from "web-push";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const CATEGORY_EMOJI: Record<string, string> = {
  sport: "🏋️",
  nutrition: "🥗",
  sante: "❤️",
  "bien-etre": "✨",
  autre: "📌",
};

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

  const { routine_id } = await req.json().catch(() => ({}));
  if (!routine_id) {
    return NextResponse.json({ error: "missing routine_id" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: routine } = await admin
    .from("routines")
    .select("id, title, category")
    .eq("id", routine_id)
    .single();

  if (!routine) {
    return NextResponse.json({ error: "routine not found" }, { status: 404 });
  }

  const { data: subs } = await admin.from("push_subscriptions").select("endpoint, p256dh, auth");

  if (!subs?.length) {
    return NextResponse.json({ sent: 0, total: 0 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const emoji = CATEGORY_EMOJI[routine.category] ?? "⏰";
  const payload = JSON.stringify({
    title: `${emoji} ${routine.title}`,
    body: "C'est l'heure de ta routine — tape pour valider.",
    url: "/routines",
    tag: `routine-${routine.id}`,
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

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({
    routine_id,
    sent,
    failed: results.length - sent,
    total: results.length,
  });
}
