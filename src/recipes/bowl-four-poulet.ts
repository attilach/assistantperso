import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "bowl-four-poulet",
  title: "Bowl au four — poulet, brocolis & feta",
  emoji: "🥦",
  category: "Plat principal",
  description: "Tout cuit dans un bol en verre, riz inclus. 40 min au four, zéro vaisselle.",
  prepTime: 5,
  cookTime: 40,
  servings: 2,
  ingredients: [
    { name: "Blanc de poulet", quantity: 300, unit: "g" },
    { name: "Riz", quantity: 60, unit: "g", note: "cru, complet ou basmati" },
    { name: "Brocoli", quantity: 500, unit: "g", note: "soit 1 grosse pièce" },
    { name: "Tomate cerise", quantity: 160, unit: "g" },
    { name: "Feta", quantity: 80, unit: "g" },
    { name: "Bouillon de volaille", quantity: 500, unit: "ml" },
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
    "Couper le poulet en morceaux d'environ 3 cm. Poser 150 g par bol par-dessus les légumes.",
    "Saler, poivrer, parsemer paprika + ail + herbes selon les goûts dans chaque bol.",
    "Verser 250 ml de bouillon chaud dans chaque bol (juste assez pour couvrir).",
    "Recouvrir chaque bol d'une feuille de papier alu en mode couvercle — l'alu ne doit pas toucher les aliments, juste piéger la vapeur.",
    "Enfourner 40 min. Le riz cuit dans le bouillon, le poulet reste fondant, les légumes vapeur.",
    "Sortir, retirer l'alu (vapeur chaude — attention aux mains), mélanger et servir directement dans le bol.",
  ],
  notes:
    "~495 kcal et ~50 g de protéines par bol — top ratio pour la recomposition. Tu peux varier les épices (curry, cumin, harissa) sans changer la base. Se prépare en avance : assemble les bols la veille, enfourne le jour J.",
};

export default recipe;
