import NotificationToggle from "@/components/NotificationToggle";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Paramètres
          </p>
          <h1 className="text-3xl font-bold text-foreground">Réglages</h1>
        </div>

        {/* Notifications section */}
        <Section title="Notifications">
          <NotificationToggle />
        </Section>

        {/* À propos */}
        <Section title="À propos">
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Assistant Perso</p>
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
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
