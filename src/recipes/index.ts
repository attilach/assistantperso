import type { Recipe } from "@/lib/recipes";
import bowlFourPoulet from "./bowl-four-poulet";
import bowlFourSteak from "./bowl-four-steak";
import burgerSauceShakeShake from "./burger-sauce-shake-shake";
import burritosBoeufHaricotsBatch from "./burritos-boeuf-haricots-batch";
import chiliConCarneBatch from "./chili-con-carne-batch";
import hotDogChouOignon from "./hot-dog-chou-oignon";
import patesThonTomate from "./pates-thon-tomate";
import penneArrabbiata from "./penne-arrabbiata";
import pouletCurryCocoBatch from "./poulet-curry-coco-batch";
import saladeEpinardsThonMais from "./salade-epinards-thon-mais";
import wrapDindePhiladelphia from "./wrap-dinde-philadelphia";

export const recipes: Recipe[] = [
  wrapDindePhiladelphia,
  saladeEpinardsThonMais,
  bowlFourPoulet,
  bowlFourSteak,
  patesThonTomate,
  pouletCurryCocoBatch,
  chiliConCarneBatch,
  burritosBoeufHaricotsBatch,
  penneArrabbiata,
  hotDogChouOignon,
  burgerSauceShakeShake,
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getAllSlugs(): string[] {
  return recipes.map((r) => r.slug);
}
