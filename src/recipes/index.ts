import type { Recipe } from "@/lib/recipes";
import bowlFourPoulet from "./bowl-four-poulet";
import bowlFourSteak from "./bowl-four-steak";
import burgerSauceShakeShake from "./burger-sauce-shake-shake";
import chiliConCarneBatch from "./chili-con-carne-batch";
import pouletCurryCocoBatch from "./poulet-curry-coco-batch";

export const recipes: Recipe[] = [
  bowlFourPoulet,
  bowlFourSteak,
  pouletCurryCocoBatch,
  chiliConCarneBatch,
  burgerSauceShakeShake,
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getAllSlugs(): string[] {
  return recipes.map((r) => r.slug);
}
