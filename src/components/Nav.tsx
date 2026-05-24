"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, CheckSquare, Repeat, Inbox, Settings } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const TABS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
  { href: "/routines", label: "Routines", icon: Repeat },
  { href: "/messages", label: "Messages", icon: Inbox },
  { href: "/settings", label: "Réglages", icon: Settings },
];

export default function Nav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (pathname === "/login") return;
    async function fetchUnread() {
      const { count } = await getSupabase()
        .from("agent_messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false);
      setUnreadCount(count ?? 0);
    }
    fetchUnread();
  }, [pathname]);

  if (pathname === "/login") return null;

  return (
    <nav
      className="border-border bg-background/90 fixed right-0 bottom-0 left-0 z-40 border-t backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-xl items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          const showBadge = href === "/messages" && unreadCount > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="bg-primary ring-background absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2" />
                )}
              </span>
              <span className="leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
