import { notFound } from "next/navigation";
import { getAllSlugs, getRecipeBySlug } from "@/recipes";
import RecipeDetail from "@/components/RecipeDetail";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();
  return <RecipeDetail recipe={recipe} />;
}
