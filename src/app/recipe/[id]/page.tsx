import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RecipeDisplay from './recipe-display'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// For Next.js App Router, we fetch data on the server component
export default async function RecipePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // We will assume the recipe ID is a valid Supabase UUID for authenticated users
    // Note: Guest users won't hit this route because their recipes persist entirely in Zustand/localStorage.
    // We'll actually modify the client logic to handle "Guest Recipes" via localStorage, 
    // but for the Server Component, we fetch the saved DB recipe.

    const supabase = await createClient()
    const { data: recipe, error } = await (supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single() as any)

    if (error || !recipe) {
        // If not found in DB, it might be a guest recipe living in local storage,
        // we'll let the client component handle that fallback.
        return (
            <div className="flex flex-col min-h-screen items-center py-20 bg-zinc-50 dark:bg-zinc-950 px-4">
                <Link href="/dashboard" className="self-start mb-8 flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Link>
                <RecipeDisplay recipeId={id} dbRecipe={null} />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen items-center py-8 sm:py-16 bg-zinc-50 dark:bg-zinc-950 px-4">
            <div className="w-full max-w-4xl">
                <Link href="/dashboard" className="self-start mb-8 flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Link>
                <RecipeDisplay recipeId={id} dbRecipe={recipe.recipe_json} />
            </div>
        </div>
    )
}
