import NotificationToggle from "@/components/NotificationToggle";
import NagSettings from "@/components/NagSettings";
import LogoutButton from "@/components/LogoutButton";

export default function SettingsPage() {
  return (
    <div className="bg-background flex-1 px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Paramètres
          </p>
          <h1 className="text-foreground text-3xl font-bold">Réglages</h1>
        </div>

        {/* Notifications section */}
        <Section title="Notifications">
          <NotificationToggle />
        </Section>

        {/* Rappels */}
        <Section title="Rappels">
          <NagSettings />
        </Section>

        {/* Compte */}
        <Section title="Compte">
          <LogoutButton />
        </Section>

        {/* À propos */}
        <Section title="À propos">
          <div className="border-border bg-card text-muted-foreground rounded-xl border p-4 text-sm">
            <p className="text-foreground mb-1 font-medium">Assistant Perso</p>
            <p className="text-xs">Version 0.1 — propulsée par Next.js + Supabase</p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
