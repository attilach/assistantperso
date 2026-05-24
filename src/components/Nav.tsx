"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Repeat } from "lucide-react";

const TABS = [
  { href: "/", label: "Tâches", icon: CheckSquare },
  { href: "/routines", label: "Routines", icon: Repeat },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center gap-1 px-4 py-3">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
