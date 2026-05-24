"use client";

import Link from "next/link";
import { useState } from "react";
import { recipes } from "@/recipes";
import { addRecipeToShoppingList } from "@/lib/shopping";
import { ChevronRight, Clock, Plus, Loader2, BookOpen } from "lucide-react";

export default function RecipeList() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function addToShopping(slug: string) {
    const recipe = recipes.find((r) => r.slug === slug);
    if (!recipe) return;
    setBusyId(slug);
    setFeedback(null);
    try {
      const { inserted, merged } = await addRecipeToShoppingList(recipe);
      const parts: string[] = [];
      if (inserted) parts.push(`${inserted} ajouté${inserted > 1 ? "s" : ""}`);
      if (merged) parts.push(`${merged} fusionné${merged > 1 ? "s" : ""}`);
      setFeedback(`${recipe.title} → ${parts.join(", ") || "rien à ajouter"}`);
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setBusyId(null);
    }
  }

  if (recipes.length === 0) {
    return (
      <div className="border-border bg-card/50 rounded-2xl border border-dashed p-10 text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <BookOpen className="text-primary h-6 w-6" />
        </div>
        <p className="text-foreground mb-1 text-sm font-medium">
          Aucune recette pour l&apos;instant
        </p>
        <p className="text-muted-foreground text-xs">
          Envoie une recette à ton assistant Claude — elle sera ajoutée comme fichier versionné.
        </p>
      </div>
    );
  }

  return (
    <div>
      {feedback && (
        <div className="border-primary/30 bg-primary/10 text-primary mb-4 rounded-xl border px-4 py-2 text-xs">
          {feedback}
        </div>
      )}

      <ul className="space-y-2">
        {recipes.map((r) => {
          const totalTime = (r.prepTime ?? 0) + (r.cookTime ?? 0);
          const busy = busyId === r.slug;
          return (
            <li
              key={r.slug}
              className="border-border bg-card hover:border-primary/30 flex items-center gap-3 rounded-xl border p-3 transition-colors"
            >
              <Link
                href={`/cuisine/recettes/${r.slug}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <div className="bg-background flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl">
                  {r.emoji ?? "🍽️"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-semibold">{r.title}</p>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                    {r.category && <span>{r.category}</span>}
                    {totalTime > 0 && (
                      <>
                        {r.category && <span>·</span>}
                        <Clock className="h-3 w-3" />
                        <span>{totalTime} min</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground/40 h-4 w-4 shrink-0" />
              </Link>

              <button
                onClick={() => addToShopping(r.slug)}
                disabled={busy}
                aria-label="Ajouter aux courses"
                className="bg-primary/15 text-primary hover:bg-primary/25 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
