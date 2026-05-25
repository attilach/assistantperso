import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "burger-sauce-shake-shake",
  title: "Burger maison sauce shake shake",
  emoji: "🍔",
  category: "cheat",
  description: "Le smash burger avec la fameuse sauce mayo-moutarde-ketchup-cornichons.",
  prepTime: 10,
  cookTime: 8,
  servings: 2,
  ingredients: [
    { name: "Pain à burger", quantity: 2, note: "brioché de préférence" },
    {
      name: "Steak haché",
      quantity: 300,
      unit: "g",
      note: "2 steaks de 150g, 15% MG pour le goût",
    },
    { name: "Tranche de cheddar", quantity: 2 },
    { name: "Tomate", quantity: 1, note: "grosse, pour 4 rondelles" },
    { name: "Feuille de salade", quantity: 2, note: "iceberg ou laitue, grosses" },
    { name: "Beurre", quantity: 20, unit: "g", note: "pour toaster les pains" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
    // Sauce shake shake
    { name: "Mayonnaise", quantity: 4, unit: "cs" },
    { name: "Moutarde américaine", quantity: 2, unit: "cs", note: "moutarde jaune" },
    { name: "Ketchup", quantity: 2, unit: "cs" },
    { name: "Cornichon", quantity: 4, note: "finement hachés" },
    { name: "Piment de Cayenne", quantity: 0.5, unit: "cc" },
    { name: "Paprika", quantity: 1, unit: "cc" },
    { name: "Ail en poudre", quantity: 0.5, unit: "cc" },
  ],
  steps: [
    "Préparer la sauce secrète : dans un bol, mélanger mayonnaise + moutarde américaine + ketchup.",
    "Ajouter les épices (piment de Cayenne, paprika, ail en poudre) à la sauce.",
    "Hacher finement les cornichons et les incorporer. Mélanger, réserver.",
    "Couper les pains en deux. Étaler une noisette de beurre sur la face interne de chaque moitié.",
    "Toaster les pains dans une poêle bien chaude (face beurrée vers le bas) jusqu'à ce qu'ils soient bien dorés. Réserver.",
    "Dans la même poêle, cuire les steaks 2-3 min de chaque côté selon ton goût (saignant, à point, bien cuit). Saler et poivrer.",
    "1 min avant la fin de cuisson, déposer une tranche de cheddar sur chaque steak pour qu'il fonde.",
    "Sur la base de chaque pain : étaler généreusement de sauce shake shake.",
    "Déposer le steak avec sa tranche de cheddar fondue par-dessus.",
    "Ajouter 2 grosses rondelles de tomate par burger.",
    "Ajouter une grosse feuille de salade.",
    "Tartiner la face interne du chapeau de pain avec de la sauce, refermer le burger.",
    "Servir immédiatement, tant que c'est chaud et fondant.",
  ],
  notes:
    "C'est un cheat meal — on assume. Pour rester un peu plus reasonable, prends du steak 5% et du pain complet. Si tu veux le smash burger version pro : aplatis fortement la viande dans la poêle bien chaude au début pour faire la croûte caramélisée typique.",
};

export default recipe;
