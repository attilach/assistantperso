import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "chili-con-carne-batch",
  title: "Chili con carne (batch)",
  emoji: "🌶️",
  category: "batch",
  description: "6 portions en une fois. Se congèle parfaitement, ~38 g de protéines par portion.",
  prepTime: 15,
  cookTime: 40,
  servings: 6,
  ingredients: [
    { name: "Viande hachée de bœuf 5%", quantity: 700, unit: "g" },
    { name: "Haricots rouges en boîte", quantity: 2, unit: "boîtes", note: "≈ 800 g égouttés" },
    { name: "Tomates concassées", quantity: 800, unit: "g" },
    { name: "Concentré de tomate", quantity: 2, unit: "cs" },
    { name: "Oignon", quantity: 2 },
    { name: "Poivron rouge", quantity: 1 },
    { name: "Gousse d'ail", quantity: 3 },
    { name: "Cumin moulu", quantity: 1, unit: "cs" },
    { name: "Paprika fumé", quantity: 1, unit: "cc" },
    { name: "Piment doux", quantity: 1, unit: "cc", note: "ajuster selon goût" },
    { name: "Cacao non sucré", quantity: 1, unit: "cc", note: "le secret pour la profondeur" },
    { name: "Bouillon de bœuf", quantity: 200, unit: "ml" },
    { name: "Huile d'olive", quantity: 2, unit: "cs" },
    { name: "Riz", quantity: 300, unit: "g", note: "pour servir" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Émincer les oignons, hacher l'ail, couper le poivron en cubes.",
    "Dans une grande cocotte, chauffer l'huile et faire revenir les oignons 5 min à feu moyen.",
    "Ajouter l'ail et le poivron, 2 min.",
    "Ajouter la viande hachée, briser à la cuillère, faire dorer 5-6 min à feu vif.",
    "Ajouter cumin + paprika + piment + concentré de tomate, mélanger 1 min pour libérer les arômes.",
    "Verser tomates concassées + bouillon + haricots rouges égouttés + cacao. Saler, poivrer.",
    "Couvrir, baisser à feu doux, laisser mijoter 25-30 min en remuant de temps en temps. La sauce doit épaissir.",
    "Pendant la fin de la cuisson, cuire le riz selon le paquet.",
    "Servir le chili sur le riz. Répartir le surplus en portions, frigo 4 jours ou congélateur 2 mois.",
  ],
  notes:
    "Le cacao + paprika fumé apportent une profondeur incroyable, sans changer le profil santé. ~38 g de protéines par portion grâce au combo bœuf + haricots rouges (complémentarité acides aminés). Idéal post-séance. Encore meilleur le lendemain.",
};

export default recipe;
