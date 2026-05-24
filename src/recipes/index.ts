import type { Recipe } from "@/lib/recipes";
import bowlThonRizAvocatEdamame from "./bowl-thon-riz-avocat-edamame";
import bouletteBoeufPatateDouceFour from "./boulettes-boeuf-patate-douce-four";
import chiliConCarneBatch from "./chili-con-carne-batch";
import pouletCurryCocoBatch from "./poulet-curry-coco-batch";
import saumonBrocoliPatateDouceFour from "./saumon-brocoli-patate-douce-four";
import spaghettiBolognaise from "./spaghetti-bolognaise";
import wokPouletLegumesSojaGingembre from "./wok-poulet-legumes-soja-gingembre";

export const recipes: Recipe[] = [
  saumonBrocoliPatateDouceFour,
  wokPouletLegumesSojaGingembre,
  bowlThonRizAvocatEdamame,
  bouletteBoeufPatateDouceFour,
  pouletCurryCocoBatch,
  chiliConCarneBatch,
  spaghettiBolognaise,
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getAllSlugs(): string[] {
  return recipes.map((r) => r.slug);
}
