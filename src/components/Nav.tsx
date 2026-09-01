"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, CheckSquare, Repeat, Inbox, Settings, UtensilsCrossed, Compass } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const TABS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
  { href: "/routines", label: "Routines", icon: Repeat },
  { href: "/quetes", label: "Quêtes", icon: Compass },
  { href: "/cuisine", label: "Cuisine", icon: UtensilsCrossed },
  { href: "/messages", label: "Messages", icon: Inbox },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

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

  const settingsActive = isActive(pathname, "/settings");

  return (
    <>
      {/* Settings cog — top-right floating */}
      <Link
        href="/settings"
        aria-label="Réglages"
        style={{ top: "calc(env(safe-area-inset-top) + 0.75rem)" }}
        className={`bg-card/80 border-border fixed right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-colors ${
          settingsActive
            ? "text-primary border-primary/40"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Settings className="h-4 w-4" />
      </Link>

      {/* Bottom tab bar — dernier enfant du shell, donc toujours collé en bas */}
      <nav
        className="border-border bg-background z-40 shrink-0 border-t"
        // On récupère 14px des 34px de safe-area iOS : la barre descend plus
        // bas sans que les labels mordent sur le home indicator (zone 8-13px).
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px) - 0.875rem, 0px)" }}
      >
        <div className="mx-auto flex max-w-xl items-stretch">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
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
    </>
  );
}
