import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "spaghetti-bolognaise",
  title: "Spaghetti à la bolognaise",
  emoji: "🍝",
  category: "Plat principal",
  description: "Le grand classique, mijoté 30 min pour bien développer les saveurs.",
  prepTime: 10,
  cookTime: 30,
  servings: 2,
  ingredients: [
    { name: "Spaghetti", quantity: 200, unit: "g" },
    { name: "Viande hachée de bœuf", quantity: 250, unit: "g" },
    { name: "Oignon", quantity: 1 },
    { name: "Gousse d'ail", quantity: 2 },
    { name: "Coulis de tomate", quantity: 400, unit: "g" },
    { name: "Concentré de tomate", quantity: 1, unit: "cs" },
    { name: "Huile d'olive", quantity: 2, unit: "cs" },
    { name: "Origan séché", quantity: 1, unit: "cc" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
    { name: "Parmesan râpé", quantity: 30, unit: "g" },
  ],
  steps: [
    "Émincer l'oignon et hacher finement l'ail.",
    "Faire chauffer l'huile d'olive dans une grande poêle à feu moyen. Ajouter l'oignon, faire revenir 3 min jusqu'à transparence, puis ajouter l'ail 30 secondes.",
    "Ajouter la viande hachée, briser à la cuillère en bois, et faire dorer 5 min à feu vif.",
    "Incorporer le concentré de tomate, mélanger 1 min, puis verser le coulis de tomate et l'origan. Saler, poivrer.",
    "Baisser à feu doux, couvrir et laisser mijoter 20 à 25 min en remuant de temps en temps. Goûter et rectifier l'assaisonnement.",
    "Pendant ce temps, cuire les spaghetti dans une grande casserole d'eau bouillante salée selon les instructions du paquet (al dente).",
    "Égoutter les pâtes, garder un peu d'eau de cuisson. Mélanger les pâtes avec la sauce, ajouter un peu d'eau de cuisson si nécessaire pour lier.",
    "Servir immédiatement, parsemer de parmesan râpé.",
  ],
  notes:
    "Tu peux remplacer le bœuf par un mélange bœuf/veau pour une bolognaise plus douce. Une feuille de laurier pendant le mijotage apporte beaucoup.",
};

export default recipe;
