import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "bowl-thon-riz-avocat-edamame",
  title: "Bowl thon, riz, avocat & edamame",
  emoji: "🥗",
  category: "Plat principal",
  description: "Zéro cuisson hors riz et edamame. Prêt en 15 min, ultra rassasiant.",
  prepTime: 10,
  cookTime: 15,
  servings: 2,
  ingredients: [
    {
      name: "Thon en boîte au naturel",
      quantity: 2,
      unit: "boîtes",
      note: "≈ 130 g égoutté chacune",
    },
    { name: "Riz complet", quantity: 150, unit: "g" },
    { name: "Avocat", quantity: 1, note: "mûr" },
    { name: "Edamame surgelé décortiqué", quantity: 150, unit: "g" },
    { name: "Sauce soja", quantity: 2, unit: "cs" },
    { name: "Huile de sésame", quantity: 1, unit: "cs" },
    { name: "Graines de sésame", quantity: 1, unit: "cs" },
    { name: "Citron vert", quantity: 1 },
    { name: "Cébette", quantity: 2, note: "ou oignon nouveau" },
  ],
  steps: [
    "Cuire le riz complet selon les indications du paquet (15-20 min en moyenne).",
    "Pendant ce temps, plonger les edamame dans une casserole d'eau bouillante salée 5 min, égoutter.",
    "Couper l'avocat en lamelles. Émincer la cébette finement. Égoutter le thon.",
    "Préparer la sauce : mélanger la sauce soja, l'huile de sésame et le jus du citron vert.",
    "Dresser dans 2 bols : riz au fond, puis thon, avocat, edamame séparés. Arroser de sauce, parsemer de sésame et de cébette.",
  ],
  notes:
    "~30 g de protéines par portion. Avocat = bons lipides, edamame = bonus protéines végétales + fibres. Se prépare en avance : tout sauf l'avocat se garde 2 jours au frigo.",
};

export default recipe;
