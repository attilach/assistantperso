import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "burritos-boeuf-haricots",
  title: "Burritos bœuf & haricots rouges",
  emoji: "🌯",
  category: "cheat",
  description: "6 ingrédients, une seule poêle, ~25 min. Le minimum vital pour un vrai burrito.",
  prepTime: 10,
  cookTime: 15,
  servings: 2,
  ingredients: [
    { name: "Grande tortilla de farine", quantity: 4, note: "2 par personne" },
    { name: "Bœuf haché", quantity: 300, unit: "g", note: "5% pour une version plus légère" },
    { name: "Oignon", quantity: 1 },
    { name: "Haricots rouges", quantity: 400, unit: "g", note: "1 boîte, égouttés et rincés" },
    { name: "Cheddar râpé", quantity: 100, unit: "g" },
    { name: "Cumin moulu", quantity: 2, unit: "cc" },
  ],
  steps: [
    "Émincer l'oignon et le faire revenir 3 min à la poêle avec un filet d'huile.",
    "Ajouter le bœuf haché, l'écraser à la cuillère et cuire 6 min jusqu'à ce qu'il ne soit plus rosé. Saler, poivrer, ajouter le cumin et mélanger 1 min.",
    "Ajouter les haricots égouttés, cuire 3 min. Écraser une partie des haricots à la cuillère : ça lie la garniture et évite qu'elle tombe du burrito.",
    "Réchauffer les tortillas 20 s par face à la poêle sèche (ou 30 s au micro-ondes). Froides, elles craquent au pliage.",
    "Garnir chaque tortilla d'un quart de la préparation en laissant 3 cm de marge, couvrir de cheddar, rabattre les deux côtés puis rouler bien serré.",
    "Optionnel mais recommandé : repasser chaque burrito 2 min à la poêle, soudure en dessous. Ça le scelle et fait fondre le fromage.",
  ],
  notes:
    "~35 g de protéines par personne grâce au combo bœuf + haricots. Version plus légère : bœuf 5% ou dinde hachée, et moitié moins de cheddar. Pour enrichir sans compliquer : crème fraîche, avocat écrasé, coriandre, ou un reste de riz ajouté à la garniture. Les burritos se congèlent roulés et bien serrés dans du papier alu — 20 min au four à 180°C directement sortis du congélateur.",
};

export default recipe;
