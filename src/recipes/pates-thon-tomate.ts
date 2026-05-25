import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "pates-thon-tomate",
  title: "Pâtes au thon, tomates & oignon",
  emoji: "🐟",
  category: "healthy",
  description: "Express, équilibré, prêt en 20 min avec les placards.",
  prepTime: 5,
  cookTime: 15,
  servings: 2,
  ingredients: [
    { name: "Pâtes", quantity: 200, unit: "g", note: "penne, spaghetti, ce que tu as" },
    {
      name: "Thon en boîte au naturel",
      quantity: 2,
      unit: "boîtes",
      note: "≈ 260 g égoutté total",
    },
    { name: "Tomate cerise", quantity: 250, unit: "g" },
    { name: "Oignon", quantity: 1 },
    { name: "Sauce tomate", quantity: 400, unit: "g", note: "ou coulis, 1 brique" },
    { name: "Huile d'olive", quantity: 2, unit: "cs" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Lancer les pâtes dans une grande casserole d'eau bouillante salée pour qu'elles cuisent pendant que tu prépares la sauce.",
    "Émincer l'oignon finement, couper les tomates cerise en deux.",
    "Faire chauffer l'huile d'olive dans une poêle à feu moyen. Ajouter l'oignon et faire dorer 3 min jusqu'à transparence.",
    "Ajouter les tomates cerise, faire revenir 2 min pour qu'elles ramollissent.",
    "Verser la sauce tomate, saler, poivrer. Laisser mijoter 5 min à feu doux.",
    "Émietter le thon égoutté dans la sauce et mélanger 1 min, juste pour le réchauffer (pas plus, sinon il devient sec).",
    "Égoutter les pâtes, les ajouter dans la poêle et bien mélanger pour qu'elles s'imprègnent de sauce. Servir immédiatement.",
  ],
  notes:
    "Optionnel pour booster : 1 gousse d'ail haché avec l'oignon, du basilic frais en fin de cuisson, ou du parmesan râpé au moment de servir. Variante crémeuse : ajoute 2 cs de crème fraîche en fin de cuisson.",
};

export default recipe;
