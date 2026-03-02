import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock, Clock4 } from 'lucide-react'

export default async function HistoryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // Guests only have local storage history, we can't SSR it.
        // For this build, we direct guests to sign in or just show a fallback message.
        return (
            <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">History</h1>
                    <p className="text-zinc-500">Sign in to sync your generated recipes across devices.</p>
                </div>

                <Card className="rounded-2xl border-dashed border-2 bg-transparent shadow-none border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <Clock4 className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                        <h3 className="font-medium text-lg mb-2">Guest mode history is local only</h3>
                        <p className="text-zinc-500 mb-6 max-w-sm">
                            We haven't built local storage recipe history viewing yet, but if you sign in,
                            all your recipes will be saved securely to your account.
                        </p>
                        <Link
                            href="/login"
                            className="px-6 py-2 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                        >
                            Sign In to save recipes
                        </Link>
                    </div>
                </Card>
            </div>
        )
    }

    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, title, created_at, recipe_json')
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">History</h1>
                <p className="text-zinc-500">View and continue cooking your past recipes.</p>
            </div>

            {!recipes || recipes.length === 0 ? (
                <Card className="rounded-2xl border-dashed border-2 bg-transparent shadow-none border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col items-center justify-center py-16">
                        <Clock className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                        <p className="text-zinc-500">You haven't generated any recipes yet.</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipes.map((recipe) => (
                        <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
                            <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-md cursor-pointer group h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                        {recipe.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(recipe.created_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </CardDescription>
                                    <p className="text-sm text-zinc-500 mt-4 line-clamp-2">
                                        {/* We can peek into the JSON for a description if it exists */}
                                        {(recipe.recipe_json as any)?.description || "A delicious custom recipe"}
                                    </p>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
