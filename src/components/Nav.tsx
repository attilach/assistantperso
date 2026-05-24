"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckSquare, Repeat, Settings, Inbox } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const TABS = [
  { href: "/", label: "Tâches", icon: CheckSquare },
  { href: "/routines", label: "Routines", icon: Repeat },
  { href: "/messages", label: "Messages", icon: Inbox },
];

export default function Nav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const settingsActive = pathname === "/settings";

  useEffect(() => {
    async function fetchUnread() {
      const { count } = await getSupabase()
        .from("agent_messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false);
      setUnreadCount(count ?? 0);
    }
    fetchUnread();
  }, [pathname]);

  return (
    <nav
      className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-xl items-center gap-1 px-3 py-3 sm:px-4">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          const showBadge = href === "/messages" && unreadCount > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:gap-2 sm:px-4 ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <span className="relative">
                <Icon className="h-4 w-4" />
                {showBadge && (
                  <span className="bg-primary ring-background absolute -top-1 -right-1 h-2 w-2 rounded-full ring-2" />
                )}
              </span>
              {label}
            </Link>
          );
        })}

        <div className="flex-1" />

        <Link
          href="/settings"
          aria-label="Réglages"
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            settingsActive
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </nav>
  );
}
