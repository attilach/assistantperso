import type { Recipe } from "@/lib/recipes";
import pouletCurryCocoBatch from "./poulet-curry-coco-batch";
import spaghettiBolognaise from "./spaghetti-bolognaise";

export const recipes: Recipe[] = [
  pouletCurryCocoBatch,
  spaghettiBolognaise,
  // ajoute ici les autres recettes au fur et à mesure
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getAllSlugs(): string[] {
  return recipes.map((r) => r.slug);
}
