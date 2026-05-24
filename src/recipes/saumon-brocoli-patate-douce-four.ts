import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "saumon-brocoli-patate-douce-four",
  title: "Saumon, brocoli & patate douce au four",
  emoji: "🐟",
  category: "Plat principal",
  description: "Sheet pan minute, riche en oméga-3 et glucides lents.",
  prepTime: 10,
  cookTime: 25,
  servings: 2,
  ingredients: [
    { name: "Pavé de saumon", quantity: 2 },
    { name: "Brocoli", quantity: 1 },
    { name: "Patate douce", quantity: 1, note: "grosse, ~400 g" },
    { name: "Huile d'olive", quantity: 2, unit: "cs" },
    { name: "Citron", quantity: 1 },
    { name: "Gousse d'ail", quantity: 2 },
    { name: "Herbes de Provence", quantity: 1, unit: "cc" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Préchauffer le four à 200°C (chaleur tournante).",
    "Éplucher la patate douce et la couper en cubes de 2 cm. Détailler le brocoli en petits bouquets.",
    "Sur une plaque, mélanger les légumes avec 1 cs d'huile d'olive, le sel, le poivre et les herbes. Étaler en une couche et enfourner 15 min.",
    "Pendant ce temps, hacher l'ail. Mélanger 1 cs d'huile + l'ail + le jus d'un demi citron, en arroser les pavés de saumon, saler et poivrer.",
    "Sortir la plaque, pousser les légumes pour faire de la place, déposer les pavés de saumon peau dessous. Enfourner 12 min de plus.",
    "Servir avec le reste du citron en quartiers.",
  ],
  notes:
    "~35 g de protéines par portion + oméga-3 du saumon. Patate douce = glucides à index glycémique modéré, parfait après séance. Sheet pan unique = vaisselle minimale.",
};

export default recipe;
