import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "boulettes-boeuf-patate-douce-four",
  title: "Boulettes de bœuf & patate douce au four",
  emoji: "🍡",
  category: "Plat principal",
  description: "Sheet pan, batch-cookable, ~32 g de protéines par portion.",
  prepTime: 15,
  cookTime: 30,
  servings: 4,
  ingredients: [
    { name: "Viande hachée de bœuf 5%", quantity: 500, unit: "g" },
    { name: "Patate douce", quantity: 2, note: "≈ 800 g total" },
    { name: "Oignon", quantity: 1 },
    { name: "Gousse d'ail", quantity: 2 },
    { name: "Œuf", quantity: 1 },
    { name: "Flocons d'avoine", quantity: 30, unit: "g", note: "ou chapelure" },
    { name: "Cumin moulu", quantity: 1, unit: "cc" },
    { name: "Paprika", quantity: 1, unit: "cc" },
    { name: "Huile d'olive", quantity: 2, unit: "cs" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Préchauffer le four à 200°C (chaleur tournante).",
    "Éplucher la patate douce, couper en cubes de 2 cm. Mélanger avec 1 cs d'huile, paprika, sel. Étaler sur une grande plaque et enfourner 10 min.",
    "Pendant ce temps, hacher finement l'oignon et l'ail. Dans un saladier, mélanger viande + œuf + flocons d'avoine + oignon + ail + cumin + sel + poivre. Former 16 boulettes (~30 g chacune).",
    "Sortir la plaque, pousser les cubes sur la moitié, déposer les boulettes sur l'autre moitié avec 1 cs d'huile. Remettre au four 20 min, en retournant les boulettes à mi-cuisson.",
    "Servir tel quel, ou avec une sauce yaourt-citron-herbes pour un côté frais.",
  ],
  notes:
    "Les flocons d'avoine remplacent la chapelure pour plus de fibres. ~32 g de protéines par portion. Se garde 3 jours au frigo, se réchauffe 5 min au four à 180°C.",
};

export default recipe;
