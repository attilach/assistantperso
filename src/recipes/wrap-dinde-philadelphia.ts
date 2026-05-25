import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "wrap-dinde-philadelphia",
  title: "Wrap dinde, Philadelphia & épinards",
  emoji: "🌯",
  category: "healthy",
  description: "En-cas froid, prêt en 5 min. Idéal lunch sur le pouce.",
  prepTime: 5,
  cookTime: 0,
  servings: 2,
  ingredients: [
    { name: "Tortilla de farine", quantity: 4 },
    { name: "Philadelphia", quantity: 6, unit: "cs", note: "ou autre fromage à tartiner" },
    { name: "Moutarde", quantity: 2, unit: "cs" },
    { name: "Tranche de poitrine de dinde", quantity: 12, note: "3 par wrap" },
    { name: "Pousses d'épinards", quantity: 1, unit: "tasse", note: "≈ 50 g" },
  ],
  steps: [
    "Étaler 1,5 cs de Philadelphia sur chaque tortilla (face interne).",
    "Ajouter par-dessus 0,5 cs de moutarde, étaler.",
    "Déposer 3 tranches de poitrine de dinde sur chaque tortilla.",
    "Ajouter une généreuse poignée de pousses d'épinards.",
    "Enrouler bien serré. Couper en deux à la diagonale si tu veux le format snack.",
  ],
  notes:
    "Se conserve 24h au frigo bien filmé. Variantes : ajoute un peu d'avocat écrasé pour les bons lipides, ou du fromage râpé, ou des tomates séchées hachées. Pour une version plus consistante, prends du jambon en plus de la dinde.",
};

export default recipe;
