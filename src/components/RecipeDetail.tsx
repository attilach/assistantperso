"use client";

import { useState } from "react";
import Link from "next/link";
import { type Recipe, formatQuantity } from "@/lib/recipes";
import { addRecipeToShoppingList } from "@/lib/shopping";
import { ArrowLeft, Clock, Users, Plus, Loader2, Check } from "lucide-react";

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  async function addToShopping() {
    setBusy(true);
    try {
      await addRecipeToShoppingList(recipe);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  function toggleStep(i: number) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <div className="bg-background flex-1 px-4 py-6">
      <div className="mx-auto max-w-xl">
        {/* Back */}
        <Link
          href="/cuisine?tab=recipes"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="bg-card border-border flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border text-3xl">
            {recipe.emoji ?? "🍽️"}
          </div>
          <div className="min-w-0 flex-1">
            {recipe.category && (
              <p className="text-primary mb-0.5 text-xs font-semibold tracking-widest uppercase">
                {recipe.category}
              </p>
            )}
            <h1 className="text-foreground text-2xl leading-tight font-bold">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-muted-foreground mt-1 text-sm">{recipe.description}</p>
            )}
          </div>
        </div>

        {/* Metadata strip */}
        <div className="border-border bg-card mb-6 flex items-center justify-around rounded-2xl border p-4 text-center">
          <div>
            <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-[10px] font-semibold tracking-widest uppercase">
              <Users className="h-3 w-3" />
              Pour
            </div>
            <p className="text-foreground text-sm font-bold">{recipe.servings} pers.</p>
          </div>
          {recipe.prepTime != null && (
            <div className="border-border border-l pl-6">
              <p className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-widest uppercase">
                Prép.
              </p>
              <p className="text-foreground text-sm font-bold">{recipe.prepTime} min</p>
            </div>
          )}
          {recipe.cookTime != null && (
            <div className="border-border border-l pl-6">
              <p className="text-muted-foreground mb-1 text-[10px] font-semibold tracking-widest uppercase">
                Cuisson
              </p>
              <p className="text-foreground text-sm font-bold">{recipe.cookTime} min</p>
            </div>
          )}
          {totalTime > 0 && (recipe.prepTime == null || recipe.cookTime == null) && (
            <div className="border-border border-l pl-6">
              <p className="text-muted-foreground mb-1 flex items-center justify-center gap-1 text-[10px] font-semibold tracking-widest uppercase">
                <Clock className="h-3 w-3" />
                Total
              </p>
              <p className="text-foreground text-sm font-bold">{totalTime} min</p>
            </div>
          )}
        </div>

        {/* Add to shopping */}
        <button
          onClick={addToShopping}
          disabled={busy}
          className={`mb-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            added
              ? "bg-primary/20 text-primary"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          } disabled:opacity-50`}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : added ? (
            <>
              <Check className="h-4 w-4" />
              Ajouté à la liste de courses
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Ajouter aux courses
            </>
          )}
        </button>

        {/* Ingrédients */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
            Ingrédients
          </h2>
          <ul className="border-border bg-card divide-border divide-y rounded-2xl border">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={`${ing.name}-${i}`}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <span className="text-foreground text-sm">
                  {ing.name}
                  {ing.note && (
                    <span className="text-muted-foreground/70 ml-1 text-xs">({ing.note})</span>
                  )}
                </span>
                <span className="text-muted-foreground shrink-0 font-mono text-sm tabular-nums">
                  {formatQuantity(ing.quantity, ing.unit)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Étapes */}
        <section className="mb-8">
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
            Étapes
          </h2>
          <ol className="space-y-2">
            {recipe.steps.map((step, i) => {
              const done = checkedSteps.has(i);
              return (
                <li key={i}>
                  <button
                    onClick={() => toggleStep(i)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                      done ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground border-border border"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        done ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {step}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Notes */}
        {recipe.notes && (
          <section className="mb-8">
            <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
              Notes
            </h2>
            <div className="border-border bg-card text-foreground/90 rounded-2xl border p-4 text-sm leading-relaxed italic">
              {recipe.notes}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
