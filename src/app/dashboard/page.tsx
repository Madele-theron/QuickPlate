'use client'

import { useState } from "react"
import { useUserStore } from "@/lib/store"
import { Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import PantryBuilder from "@/components/pantry-builder"

export default function DashboardPage() {
    const { pantry, setPantry, preferences } = useUserStore()
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const router = useRouter()

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setIsGenerating(true)

        try {
            const response = await fetch('/api/recipe/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, preferences, pantry })
            })

            const data = await response.json()
            if (response.ok && data.recipeId) {
                router.push(`/recipe/${data.recipeId}`)
            } else {
                console.error(data.error)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Workspace</h1>
                <p className="text-muted-foreground">Manage your pantry and generate new recipes.</p>
            </div>

            <Tabs defaultValue="build" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 p-1">
                    <TabsTrigger value="build" className="rounded-lg">Build Recipe</TabsTrigger>
                    <TabsTrigger value="pantry" className="rounded-lg">
                        Pantry
                        {pantry.length > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-900 dark:text-zinc-50">
                                {pantry.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="build" className="mt-6 space-y-6">
                    <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle>What are you craving?</CardTitle>
                            <CardDescription>Tell the AI what you want to make, and we'll handle the rest.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="e.g. A high-protein dinner that uses chicken and broccoli..."
                                className="min-h-[120px] rounded-xl text-base resize-none bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-zinc-500 w-full sm:w-auto">
                                    Using <span className="font-medium text-zinc-900 dark:text-zinc-50">{preferences.diet}</span> diet and <span className="font-medium text-zinc-900 dark:text-zinc-50">{pantry.length}</span> pantry items.
                                </div>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isGenerating}
                                    className="rounded-xl px-6 w-full sm:w-auto h-11 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    Generate Recipe
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="pantry" className="mt-6">
                    <PantryBuilder items={pantry} setItems={setPantry} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
