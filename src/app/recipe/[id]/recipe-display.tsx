'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Clock, Users, Flame, Info, MessageCircle, Send, Loader2, Utensils as ChefHat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Recipe } from '@/lib/schema/recipe'
import { useChat } from '@ai-sdk/react'
import { useUserStore } from '@/lib/store'
import ReactMarkdown from 'react-markdown'

export default function RecipeDisplay({ recipeId, dbRecipe }: { recipeId: string, dbRecipe: any }) {
    const [recipe, setRecipe] = useState<Recipe | null>(dbRecipe)
    const [loading, setLoading] = useState(!dbRecipe)
    const { isGuest } = useUserStore()

    useEffect(() => {
        if (!dbRecipe) {
            // Must be guest mode, fetch from local storage
            const fetchLocalRecipe = () => {
                try {
                    const stored = localStorage.getItem(`guest_recipe_${recipeId}`)
                    if (stored) {
                        setRecipe(JSON.parse(stored))
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    setLoading(false)
                }
            }
            fetchLocalRecipe()
        }
    }, [recipeId, dbRecipe])

    // Setup streaming chat
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        body: {
            recipeId,
            recipeContext: recipe, // Send recipe as context for the AI
        },
        // We can provide initial messages if we fetched them from the DB, 
        // but for now we start fresh or rely on standard ai/react persistence if configured.
    } as any) as any

    // We haven't implemented local storage for chat messages in this demo yet.

    if (loading) return <div className="p-8 text-center text-zinc-500">Loading recipe...</div>

    if (!recipe) return (
        <div className="p-8 text-center text-zinc-500">
            Recipe not found. It may have expired or you don't have access.
        </div>
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recipe Context Column */}
            <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                        {recipe.title}
                    </h1>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400">
                        {recipe.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <Clock className="h-5 w-5" />
                        <span>{recipe.totalTimeMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <Users className="h-5 w-5" />
                        <span>{recipe.servings} servings</span>
                    </div>
                    {recipe.nutritionEstimate?.calories && (
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                            <Flame className="h-5 w-5" />
                            <span>~{recipe.nutritionEstimate.calories} kcal</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl">Ingredients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className="flex justify-between items-start gap-4 text-sm border-b border-zinc-100 dark:border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-zinc-900 dark:text-zinc-50">{ing.name}</span>
                                            {ing.notes && <span className="text-zinc-500 text-xs mt-0.5">{ing.notes}</span>}
                                        </div>
                                        <div className="text-right whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                                            {ing.quantity} {ing.unit}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl">Why this fits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {recipe.whyThisMatchesPreferences.map((reason, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>

                            {recipe.estimatedCost && (
                                <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                                    <div className="text-sm font-medium mb-1">Estimated Cost: {recipe.estimatedCost}</div>
                                    <div className="text-xs text-zinc-500">{recipe.costNotes}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Instructions</h2>
                    <div className="space-y-6">
                        {recipe.steps.map((step) => (
                            <div key={step.stepNumber} className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    {step.stepNumber}
                                </div>
                                <div className="space-y-2 flex-1 pt-1">
                                    <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                        {step.instruction}
                                    </p>
                                    {step.timerMinutes && (
                                        <Badge variant="outline" className="text-zinc-500 font-normal">
                                            <Clock className="w-3 h-3 mr-1 inline" /> {step.timerMinutes} min
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Column */}
            <div className="lg:col-span-1 h-[80vh] sticky top-24 pt-8 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 lg:pl-8">
                <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-zinc-500" />
                        <h3 className="font-semibold text-sm">Sous-Chef Chat</h3>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-sm text-zinc-500 mt-10">
                                <ChefHat className="w-12 h-12 mx-auto mb-4 text-zinc-200 dark:text-zinc-800" />
                                <p>Need a substitution? Ran out of salt? Just ask.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((m: any) => (
                                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                      max-w-[85%] rounded-2xl px-4 py-2 text-sm
                      ${m.role === 'user'
                                                ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                                                : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'}
                    `}>
                                            <div className="prose dark:prose-invert prose-sm max-w-none">
                                                <ReactMarkdown>
                                                    {m.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-zinc-100 dark:bg-zinc-800">
                                            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                        <form onSubmit={handleSubmit} className="flex gap-2 relative">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask about the recipe..."
                                className="rounded-xl pr-10 border-zinc-200 dark:border-zinc-800"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1 top-1 h-8 w-8 rounded-lg"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}
