import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function configureWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

type Subscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function POST(req: NextRequest) {
  configureWebPush();

  const body = await req.json().catch(() => ({}));
  const title = body.title ?? "Assistant Perso";
  const message = body.body ?? "Ceci est une notification de test 🎉";

  const supabase = getSupabaseAdmin();
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!subs?.length) {
    return NextResponse.json({ error: "Aucun abonnement actif" }, { status: 404 });
  }

  const payload = JSON.stringify({ title, body: message, url: "/" });

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
    if (
      r.status === "rejected" &&
      typeof r.reason === "object" &&
      r.reason !== null &&
      "statusCode" in r.reason &&
      (r.reason.statusCode === 404 || r.reason.statusCode === 410)
    ) {
      stale.push(subs[i].endpoint);
    }
  });

  if (stale.length) {
    await supabase.from("push_subscriptions").delete().in("endpoint", stale);
  }

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({ sent, failed, total: results.length });
}
