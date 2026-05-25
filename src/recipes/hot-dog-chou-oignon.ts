import type { Recipe } from "@/lib/recipes";

const recipe: Recipe = {
  slug: "hot-dog-chou-oignon",
  title: "Hot dog chou blanc & oignon",
  emoji: "🌭",
  category: "cheat",
  description: "Saucisse, pain moelleux, chou-oignon poêlé. Express et réconfortant.",
  prepTime: 5,
  cookTime: 12,
  servings: 2,
  ingredients: [
    {
      name: "Saucisse de Strasbourg",
      quantity: 4,
      note: "ou de Francfort, 2 par personne",
    },
    { name: "Pain à hot dog", quantity: 4 },
    { name: "Chou blanc", quantity: 200, unit: "g", note: "soit ¼ d'un petit chou" },
    { name: "Oignon", quantity: 1 },
    { name: "Huile d'olive", quantity: 1, unit: "cs" },
    { name: "Moutarde", quantity: 2, unit: "cs", note: "au goût" },
    { name: "Ketchup", quantity: 2, unit: "cs", note: "au goût" },
    { name: "Sel", quantity: 1, unit: "pincée" },
    { name: "Poivre", quantity: 1, unit: "pincée" },
  ],
  steps: [
    "Émincer finement le chou blanc et l'oignon.",
    "Dans une poêle, faire chauffer l'huile à feu moyen. Ajouter chou + oignon, saler, poivrer. Faire revenir 8-10 min en remuant — ils doivent rester légèrement croquants.",
    "Pendant ce temps, plonger les saucisses dans une casserole d'eau frémissante (pas bouillante, elles éclateraient) 5-6 min.",
    "Réchauffer les pains à hot dog au four ou au grille-pain (1-2 min), pour qu'ils soient moelleux et chauds.",
    "Ouvrir chaque pain en deux dans le sens de la longueur. Tartiner moutarde et/ou ketchup sur la face interne.",
    "Déposer une saucisse dans chaque pain, garnir généreusement de chou-oignon par-dessus. Servir immédiatement.",
  ],
  notes:
    "Astuce : ajoute un peu de paprika fumé ou de cumin sur le chou pour booster le goût. Pour une touche acidulée façon choucroute, ajoute 1 cs de vinaigre de cidre dans le chou en fin de cuisson. Version plus light : saucisse de volaille + pain complet.",
};

export default recipe;
