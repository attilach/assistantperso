import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "penne-arrabbiata",
  title: "Penne à l'arrabbiata",
  emoji: "🌶️",
  category: "batch",
  description: "Pasta classique du Sud — sauce tomate-ail-piment qui mijote 25 min.",
  prepTime: 5,
  cookTime: 40,
  servings: 4,
  ingredients: [
    { name: "Penne", quantity: 220, unit: "g", note: "ou autres pâtes courtes" },
    { name: "Concassé de tomate", quantity: 800, unit: "g", note: "1 grosse boîte" },
    { name: "Oignon doux", quantity: 1 },
    { name: "Gousse d'ail", quantity: 2 },
    { name: "Huile d'olive", quantity: 6, unit: "cs" },
    { name: "Piment d'Espelette", quantity: 1, unit: "cs" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Émincer l'oignon, hacher finement l'ail.",
    "Dans une grande casserole, faire chauffer l'huile d'olive à feu moyen. Ajouter oignon + ail + piment d'Espelette et faire dorer 3 min en remuant.",
    "Verser le concassé de tomate et 10 cl d'eau (1 verre). Saler légèrement. Baisser à feu doux et laisser mijoter 25 min, en remuant de temps en temps. La sauce doit épaissir et concentrer ses arômes.",
    "Pendant les 10 dernières minutes, cuire les pâtes dans une grande casserole d'eau bouillante salée, selon les indications du paquet (al dente).",
    "Égoutter les pâtes en gardant une louche d'eau de cuisson. Mélanger les pâtes à la sauce, ajouter un peu d'eau de cuisson si besoin pour bien lier.",
    "Goûter, rectifier sel et poivre. Servir immédiatement.",
  ],
  notes:
    "Le piment d'Espelette remplace le peperoncino italien — moins fort mais plus aromatique. Pour la version classique, utilise du peperoncino séché écrasé. La sauce se conserve 4-5 jours au frigo et est encore meilleure le lendemain. Tu peux la préparer en avance et juste cuire les pâtes au moment.",
};

export default recipe;
