"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { blockedOffline, cachedRead } from "@/lib/offline";
import { formatQuantity } from "@/lib/recipes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLongPress } from "@/lib/use-long-press";
import { Check, Plus, ShoppingCart, Loader2 } from "lucide-react";

type ShoppingItem = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  checked: boolean;
  added_from: string | null;
  created_at: string;
};

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { data } = await cachedRead<ShoppingItem[]>("shopping", () =>
        getSupabase().from("shopping_items").select("*").order("created_at", { ascending: false })
      );
      setItems(data ?? []);
      setLoading(false);
    }
    fetchItems();
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (blockedOffline()) return;
    setNewName("");

    const optimistic: ShoppingItem = {
      id: crypto.randomUUID(),
      name,
      quantity: null,
      unit: null,
      checked: false,
      added_from: "manual",
      created_at: new Date().toISOString(),
    };
    setItems((prev) => [optimistic, ...prev]);

    const { data } = await getSupabase()
      .from("shopping_items")
      .insert({ name, added_from: "manual" })
      .select()
      .single();
    if (data) {
      setItems((prev) => prev.map((i) => (i.id === optimistic.id ? data : i)));
    }
  }

  async function toggleItem(item: ShoppingItem) {
    if (blockedOffline()) return;
    const next = !item.checked;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, checked: next } : i)));
    await getSupabase().from("shopping_items").update({ checked: next }).eq("id", item.id);
  }

  async function deleteItem(id: string) {
    if (blockedOffline()) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await getSupabase().from("shopping_items").delete().eq("id", id);
  }

  async function clearChecked() {
    const checkedIds = items.filter((i) => i.checked).map((i) => i.id);
    if (!checkedIds.length) return;
    if (blockedOffline()) return;
    if (
      !confirm(
        `Vider les ${checkedIds.length} article${checkedIds.length > 1 ? "s" : ""} achetés ?`
      )
    )
      return;
    setItems((prev) => prev.filter((i) => !i.checked));
    await getSupabase().from("shopping_items").delete().in("id", checkedIds);
  }

  const pending = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  return (
    <div>
      {/* Add form */}
      <form onSubmit={addItem} className="mb-6 flex gap-2">
        <Input
          ref={inputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Article à ajouter..."
          className="bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
        />
        <Button
          type="submit"
          disabled={!newName.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {loading && (
        <div className="text-muted-foreground flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="py-12 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <ShoppingCart className="text-primary h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-sm">
            Aucun article pour l&apos;instant.
            <br />
            Ajoute manuellement ou via une recette.
          </p>
        </div>
      )}

      {!loading && pending.length > 0 && (
        <div className="mb-4">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
            À acheter ({pending.length})
          </p>
          <ul className="space-y-2">
            {pending.map((item) => (
              <Item key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
            ))}
          </ul>
        </div>
      )}

      {!loading && checked.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Acheté ({checked.length})
            </p>
            <button
              onClick={clearChecked}
              className="text-muted-foreground/60 hover:text-destructive text-xs"
            >
              Tout effacer
            </button>
          </div>
          <ul className="space-y-2">
            {checked.map((item) => (
              <Item key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Item({
  item,
  onToggle,
  onDelete,
}: {
  item: ShoppingItem;
  onToggle: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
}) {
  const [pressing, setPressing] = useState(false);
  const longPress = useLongPress(() => {
    setPressing(false);
    if (confirm(`Supprimer "${item.name}" ?`)) {
      onDelete(item.id);
    }
  }, 550);

  const qtyLabel = formatQuantity(item.quantity, item.unit ?? undefined);

  return (
    <li
      onTouchStart={(e) => {
        setPressing(true);
        longPress.onTouchStart(e);
      }}
      onTouchEnd={() => {
        setPressing(false);
        longPress.onTouchEnd();
      }}
      onTouchMove={() => {
        setPressing(false);
        longPress.onTouchMove();
      }}
      onTouchCancel={() => {
        setPressing(false);
        longPress.onTouchCancel();
      }}
      onMouseDown={() => {
        setPressing(true);
        longPress.onMouseDown();
      }}
      onMouseUp={() => {
        setPressing(false);
        longPress.onMouseUp();
      }}
      onMouseLeave={() => {
        setPressing(false);
        longPress.onMouseLeave();
      }}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all select-none ${
        pressing
          ? "border-destructive/40 bg-destructive/10 scale-[0.98]"
          : item.checked
            ? "border-border bg-card/50"
            : "border-border bg-card"
      }`}
    >
      <button
        onClick={() => onToggle(item)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          item.checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        }`}
      >
        {item.checked && <Check className="h-3 w-3" />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            item.checked ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {item.name}
        </p>
        {qtyLabel && <p className="text-muted-foreground/70 text-xs">{qtyLabel}</p>}
      </div>

      {item.added_from && item.added_from !== "manual" && !item.checked && (
        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium">
          recette
        </span>
      )}
    </li>
  );
}
