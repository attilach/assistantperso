/**
 * Recipe model. Recipes themselves live as TypeScript files under
 * `src/recipes/` so they are versioned in git and can be edited per
 * recipe with full type safety. Quantities are systematically given
 * for `servings: 2` (cuisine pour 2).
 */

export type Ingredient = {
  /** Display name, e.g. "Tomates", "Spaghetti". */
  name: string;
  /** Numeric quantity for `servings` people. */
  quantity: number;
  /** Optional unit: "g", "ml", "cl", "cs" (cuillère à soupe), "cc", "" (pieces). */
  unit?: string;
  /** Free-form note, e.g. "mûres", "bien épluchées". */
  note?: string;
};

export type RecipeCategory = "healthy" | "batch" | "cheat";

export type Recipe = {
  slug: string;
  title: string;
  emoji?: string;
  description?: string;
  category: RecipeCategory;
  /** Minutes. */
  prepTime?: number;
  cookTime?: number;
  /** Toujours 2 (on cuisine pour 2). */
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  notes?: string;
};

/** Display metadata for recipe categories, in render order (healthy first, cheat last). */
export const RECIPE_CATEGORIES: { value: RecipeCategory; label: string; emoji: string }[] = [
  { value: "healthy", label: "Healthy", emoji: "🥦" },
  { value: "batch", label: "Batch cooking", emoji: "🍱" },
  { value: "cheat", label: "Cheat meal", emoji: "🍔" },
];

export function categoryLabel(value: RecipeCategory): string {
  return RECIPE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/** Normalize ingredient identity for shopping-list de-duplication. */
export function ingredientKey(name: string, unit?: string): string {
  return `${name.trim().toLowerCase()}|${(unit ?? "").trim().toLowerCase()}`;
}

/** Format a quantity + unit nicely. Hides ".0", keeps integers clean. */
export function formatQuantity(quantity: number | null | undefined, unit?: string | null): string {
  if (quantity == null) return unit ?? "";
  const q = Number.isInteger(quantity)
    ? quantity.toString()
    : quantity.toFixed(1).replace(/\.0$/, "");
  return unit ? `${q} ${unit}` : q;
}
