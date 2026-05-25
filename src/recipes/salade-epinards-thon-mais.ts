import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "salade-epinards-thon-mais",
  title: "Salade d'épinards, thon, tomates cerise & maïs",
  emoji: "🥗",
  category: "healthy",
  description: "Salade complète express, fraîche et riche en protéines.",
  prepTime: 5,
  cookTime: 0,
  servings: 2,
  ingredients: [
    { name: "Pousses d'épinards", quantity: 120, unit: "g", note: "2 grosses poignées" },
    { name: "Tomate cerise", quantity: 250, unit: "g" },
    { name: "Maïs en boîte", quantity: 1, unit: "boîte", note: "≈ 140 g égoutté" },
    {
      name: "Thon en boîte au naturel",
      quantity: 2,
      unit: "boîtes",
      note: "≈ 260 g égoutté total",
    },
    { name: "Huile d'olive", quantity: 3, unit: "cs" },
    { name: "Vinaigre balsamique", quantity: 1, unit: "cs" },
    { name: "Moutarde", quantity: 1, unit: "cc" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Rincer rapidement les pousses d'épinards et les essorer. Les répartir dans un grand saladier ou directement dans deux assiettes creuses.",
    "Couper les tomates cerise en deux et les ajouter.",
    "Égoutter le maïs et le thon. Ajouter par-dessus les épinards.",
    "Préparer la vinaigrette : dans un petit bol, fouetter moutarde + vinaigre balsamique + sel + poivre, puis incorporer l'huile d'olive en filet pour émulsionner.",
    "Verser la vinaigrette sur la salade et mélanger délicatement juste avant de servir (sinon les épinards rendent de l'eau).",
  ],
  notes:
    "Boost protéines : ajoute un œuf dur coupé en deux par personne (~6 g de plus). Variante : remplace le balsamique par un trait de citron + un peu de zeste pour une vinaigrette plus fraîche. Si tu prépares en avance, garde la vinaigrette à part.",
};

export default recipe;
