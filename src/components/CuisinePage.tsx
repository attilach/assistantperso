"use client";

import { useState } from "react";
import ShoppingList from "@/components/ShoppingList";
import RecipeList from "@/components/RecipeList";

type Tab = "list" | "recipes";

export default function CuisinePage() {
  const [tab, setTab] = useState<Tab>("list");

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Cuisine
          </p>
          <h1 className="text-foreground text-3xl font-bold">
            {tab === "list" ? "Liste de courses" : "Recettes"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {tab === "list"
              ? "Ajoute manuellement ou depuis une recette."
              : "Toutes pour 2 personnes — tape +  pour ajouter aux courses."}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-border bg-card mb-6 flex gap-1 rounded-full border p-1">
          {(["list", "recipes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "list" ? "Liste" : "Recettes"}
            </button>
          ))}
        </div>

        {tab === "list" ? <ShoppingList /> : <RecipeList />}
      </div>
    </div>
  );
}
