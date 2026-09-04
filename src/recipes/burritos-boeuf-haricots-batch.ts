import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "burritos-boeuf-haricots-batch",
  title: "Burritos bœuf & haricots rouges (batch)",
  emoji: "🌯",
  category: "batch",
  description:
    "8 burritos en une fois, 6 ingrédients. Se congèlent roulés, ~40 g de protéines par portion.",
  prepTime: 15,
  cookTime: 25,
  servings: 8,
  ingredients: [
    { name: "Grande tortilla de farine", quantity: 8 },
    { name: "Bœuf haché", quantity: 1000, unit: "g", note: "5%" },
    { name: "Oignon", quantity: 2 },
    { name: "Haricots rouges en boîte", quantity: 2, unit: "boîtes", note: "≈ 800 g égouttés" },
    { name: "Cheddar râpé", quantity: 200, unit: "g" },
    { name: "Cumin moulu", quantity: 1, unit: "cs" },
  ],
  steps: [
    "Émincer les oignons et les faire revenir 5 min à feu moyen dans une grande cocotte avec un filet d'huile.",
    "Ajouter le bœuf haché, le briser à la cuillère et le faire dorer 8-10 min à feu vif. Sur 1 kg, procéder en deux fois si la cocotte est petite : entassée, la viande bout au lieu de dorer.",
    "Saler, poivrer, ajouter le cumin et mélanger 1 min pour libérer les arômes.",
    "Ajouter les haricots égouttés et rincés, cuire 5 min. Écraser une partie des haricots à la cuillère : ça lie la garniture et évite qu'elle tombe du burrito.",
    "Laisser tiédir 10 min hors du feu. Une garniture brûlante détrempe la tortilla et la fait craquer au pliage.",
    "Réchauffer les tortillas 20 s par face à la poêle sèche, garnir chacune d'un huitième de la préparation en laissant 3 cm de marge, couvrir de cheddar, rabattre les côtés puis rouler bien serré.",
    "Manger les burritos du jour, éventuellement repassés 2 min à la poêle soudure en dessous pour les sceller. Emballer le reste individuellement dans du papier alu.",
  ],
  notes:
    "Frigo 4 jours, congélateur 2 mois. Réchauffage : 20 min à 180°C dans l'alu directement sorti du congélateur, ou 10 min s'ils viennent du frigo. Éviter le micro-ondes, qui ramollit la tortilla. ~40 g de protéines par portion grâce au combo bœuf + haricots (complémentarité des acides aminés). Version plus légère : dinde hachée et moitié moins de cheddar. Pour enrichir sans compliquer : crème fraîche, avocat écrasé ou coriandre à l'assemblage — mais pas avant congélation.",
};

export default recipe;
