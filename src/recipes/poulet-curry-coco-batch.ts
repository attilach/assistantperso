import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "poulet-curry-coco-batch",
  title: "Poulet curry rouge au lait de coco",
  emoji: "🍛",
  category: "batch",
  description: "Batch cooking : crémeux, riche en protéines, se conserve 4-5 jours au frigo.",
  prepTime: 15,
  cookTime: 30,
  servings: 6,
  ingredients: [
    { name: "Blanc de poulet", quantity: 1000, unit: "g" },
    { name: "Lait de coco", quantity: 400, unit: "ml" },
    { name: "Oignon", quantity: 2 },
    { name: "Pâte de curry rouge", quantity: 2, unit: "cs" },
    { name: "Huile d'olive", quantity: 1, unit: "cs" },
    { name: "Brocoli", quantity: 1 },
    { name: "Poivron", quantity: 2 },
    { name: "Courgette", quantity: 1 },
    { name: "Riz complet", quantity: 350, unit: "g" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Découper le poulet en morceaux d'environ 3 cm.",
    "Émincer finement les oignons. Détailler le brocoli en petits bouquets, couper poivrons et courgette en cubes.",
    "Dans une grande sauteuse ou un faitout, faire chauffer l'huile à feu moyen et faire revenir les oignons jusqu'à ce qu'ils soient translucides (3-4 min).",
    "Ajouter la pâte de curry rouge et faire revenir 2 min en remuant pour libérer les arômes.",
    "Ajouter le poulet et faire dorer sur toutes les faces (5-6 min à feu vif).",
    "Verser le lait de coco, ajouter les légumes coupés. Saler, poivrer. Mélanger.",
    "Laisser mijoter à feu doux 20-25 min, à découvert pour épaissir la sauce. Remuer de temps en temps.",
    "Pendant ce temps, cuire le riz complet selon les instructions du paquet.",
    "Répartir en portions dans des contenants hermétiques. Conserver au frigo jusqu'à 4-5 jours.",
  ],
  notes:
    "Profil nutritionnel adapté à la recomposition (perte de gras + prise de muscle) : ~28 g de protéines par portion, glucides complexes du riz complet, lipides modérés du lait de coco. Variantes : 1.2 kg de poulet pour plus de protéines, ou lait de coco light pour réduire le gras. Le riz peut être ajusté selon ton timing (post-training = portion plus généreuse).",
};

export default recipe;
