import { getSupabase } from "@/lib/supabase";
import { blockedOffline } from "@/lib/offline";
import { ingredientKey, type Recipe } from "@/lib/recipes";

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  checked: boolean;
  added_from: string | null;
  created_at: string;
};

/**
 * Add all ingredients of a recipe to the shopping list, merging with
 * unchecked existing items that share the same name+unit (case-insensitive).
 */
export async function addRecipeToShoppingList(
  recipe: Recipe
): Promise<{ inserted: number; merged: number }> {
  if (blockedOffline()) return { inserted: 0, merged: 0 };
  const sb = getSupabase();

  const { data: existing } = await sb
    .from("shopping_items")
    .select("id, name, quantity, unit")
    .eq("checked", false);

  const byKey = new Map<string, { id: string; quantity: number | null }>();
  for (const it of existing ?? []) {
    byKey.set(ingredientKey(it.name, it.unit ?? undefined), {
      id: it.id,
      quantity: it.quantity,
    });
  }

  let inserted = 0;
  let merged = 0;

  for (const ing of recipe.ingredients) {
    const key = ingredientKey(ing.name, ing.unit);
    const match = byKey.get(key);
    if (match) {
      const newQty = (match.quantity ?? 0) + ing.quantity;
      await sb.from("shopping_items").update({ quantity: newQty }).eq("id", match.id);
      // Keep map in sync if the same recipe lists the ingredient twice
      byKey.set(key, { id: match.id, quantity: newQty });
      merged++;
    } else {
      const { data } = await sb
        .from("shopping_items")
        .insert({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit ?? null,
          added_from: recipe.slug,
        })
        .select()
        .single();
      if (data) byKey.set(key, { id: data.id, quantity: data.quantity });
      inserted++;
    }
  }

  return { inserted, merged };
}
