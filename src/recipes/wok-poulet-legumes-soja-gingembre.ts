import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "wok-poulet-legumes-soja-gingembre",
  title: "Wok poulet, légumes & sauce soja-gingembre",
  emoji: "🥢",
  category: "Plat principal",
  description: "Express : 12 min chrono. Légumes surgelés OK, zéro découpe.",
  prepTime: 5,
  cookTime: 12,
  servings: 2,
  ingredients: [
    { name: "Émincé de poulet", quantity: 300, unit: "g" },
    { name: "Mélange légumes wok surgelés", quantity: 400, unit: "g", note: "ou frais" },
    { name: "Gingembre frais", quantity: 2, unit: "cm" },
    { name: "Gousse d'ail", quantity: 2 },
    { name: "Sauce soja", quantity: 3, unit: "cs" },
    { name: "Miel", quantity: 1, unit: "cc" },
    { name: "Huile de sésame", quantity: 1, unit: "cs" },
    { name: "Huile neutre", quantity: 1, unit: "cs", note: "tournesol, colza" },
    { name: "Graines de sésame", quantity: 1, unit: "cs" },
    { name: "Riz basmati", quantity: 150, unit: "g", note: "optionnel" },
  ],
  steps: [
    "Râper le gingembre, hacher l'ail. Dans un bol, mélanger sauce soja + miel + huile de sésame.",
    "Si tu prends du riz : le cuire selon le paquet pendant que tu fais le wok.",
    "Chauffer l'huile neutre dans un wok ou grande poêle à feu vif. Saisir le poulet 5 min en remuant souvent, jusqu'à doré.",
    "Ajouter ail et gingembre, faire revenir 30 secondes (attention à ne pas brûler).",
    "Jeter les légumes surgelés dans le wok, sauter à feu vif 4-5 min — ils doivent rester croquants.",
    "Verser la sauce, mélanger 1 min pour bien enrober. Parsemer de graines de sésame.",
    "Servir immédiatement, avec ou sans riz.",
  ],
  notes:
    "~32 g de protéines par portion. Les légumes surgelés gardent leurs vitamines (souvent mieux que les frais du supermarché). Pour booster les protéines sans riz : remplace par un œuf au plat sur le dessus.",
};

export default recipe;
