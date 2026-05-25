import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "bowl-four-steak",
  title: "Bowl au four — steak haché, brocolis & feta",
  emoji: "🥩",
  category: "healthy",
  description: "Même technique que la version poulet, mais avec du steak haché 5%.",
  prepTime: 5,
  cookTime: 40,
  servings: 2,
  ingredients: [
    { name: "Steak haché 5%", quantity: 300, unit: "g" },
    { name: "Riz", quantity: 60, unit: "g", note: "cru, complet ou basmati" },
    { name: "Brocoli", quantity: 500, unit: "g", note: "soit 1 grosse pièce" },
    { name: "Tomate cerise", quantity: 160, unit: "g" },
    { name: "Feta", quantity: 80, unit: "g" },
    { name: "Bouillon de bœuf", quantity: 500, unit: "ml" },
    { name: "Paprika", quantity: 1, unit: "cc" },
    { name: "Ail en poudre", quantity: 1, unit: "cc" },
    { name: "Herbes de Provence", quantity: 1, unit: "cc" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Préchauffer le four à 200°C (chaleur tournante).",
    "Sortir 2 bols en verre adaptés au four. Mettre 30 g de riz cru au fond de chaque bol.",
    "Détailler le brocoli en petits bouquets, couper les tomates en deux, émietter la feta. Répartir équitablement dans les 2 bols.",
    "Émietter 150 g de steak haché par bol directement sur les légumes (pas besoin de former de boulettes).",
    "Saler, poivrer, parsemer paprika + ail + herbes selon les goûts dans chaque bol.",
    "Verser 250 ml de bouillon chaud dans chaque bol (juste assez pour couvrir).",
    "Recouvrir chaque bol d'une feuille de papier alu en mode couvercle — l'alu ne doit pas toucher les aliments, juste piéger la vapeur.",
    "Enfourner 40 min. Le steak cuit dans son jus, le riz absorbe le bouillon.",
    "Sortir, retirer l'alu (vapeur chaude — attention aux mains), mélanger et servir directement dans le bol.",
  ],
  notes:
    "~540 kcal et ~50 g de protéines par bol. Steak haché 5% pour un bon ratio prot/lipides. Tu peux mixer poulet + steak dans le même four si tu fais 2 bols différents — la technique est identique.",
};

export default recipe;
