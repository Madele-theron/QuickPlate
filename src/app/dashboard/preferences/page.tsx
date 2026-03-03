'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useUserStore } from "@/lib/store"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const preferencesFormSchema = z.object({
    diet: z.string().min(1, "Please select a dietary preference."),
    allergies: z.string().optional(),
    avoidIngredients: z.string().optional(),
    budget: z.coerce.number().min(0, "Budget must be a positive number"),
    budgetCurrency: z.string().default("ZAR"),
    budgetType: z.enum(["per_meal", "per_serving"]),
    healthGoals: z.string().optional(),
    mealFrequency: z.string().optional(),
    timeConstraints: z.string().optional(),
    maxCookTime: z.coerce.number().min(5, "Cook time must be at least 5 minutes"),
    skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
})

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>

export default function PreferencesPage() {
    const { preferences, updatePreferences } = useUserStore()

    // Convert array preferences to comma-separated strings for simple text inputs
    const defaultValues: Partial<PreferencesFormValues> = {
        diet: preferences.diet,
        allergies: preferences.allergies.join(", "),
        avoidIngredients: preferences.avoidIngredients.join(", "),
        budget: preferences.budget,
        budgetCurrency: preferences.budgetCurrency,
        budgetType: preferences.budgetType,
        healthGoals: preferences.healthGoals.join(", "),
        mealFrequency: preferences.mealFrequency,
        timeConstraints: preferences.timeConstraints,
        maxCookTime: preferences.maxCookTime,
        skillLevel: preferences.skillLevel,
    }

    const form = useForm<PreferencesFormValues>({
        resolver: zodResolver(preferencesFormSchema) as any,
        defaultValues,
    })

    function onSubmit(data: PreferencesFormValues) {
        // Convert comma-separated strings back to arrays
        updatePreferences({
            ...data,
            allergies: data.allergies ? data.allergies.split(",").map(s => s.trim()).filter(Boolean) : [],
            avoidIngredients: data.avoidIngredients ? data.avoidIngredients.split(",").map(s => s.trim()).filter(Boolean) : [],
            healthGoals: data.healthGoals ? data.healthGoals.split(",").map(s => s.trim()).filter(Boolean) : [],
        })

        toast.success("Preferences updated successfully. The AI will now use these guidelines.")
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Preferences</h3>
                <p className="text-sm text-zinc-500">
                    Customize how the AI generates recipes for you.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Diet & Health</CardTitle>
                            <CardDescription>Tell us about what you can and can't eat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="diet"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dietary Preference</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-xl">
                                                    <SelectValue placeholder="Select a diet" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="omnivore">Omnivore (Anything)</SelectItem>
                                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                                <SelectItem value="vegan">Vegan</SelectItem>
                                                <SelectItem value="pescatarian">Pescatarian</SelectItem>
                                                <SelectItem value="keto">Keto</SelectItem>
                                                <SelectItem value="paleo">Paleo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Allergies (comma separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Peanuts, Shellfish, Dairy" className="rounded-xl" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The AI will strictly avoid these ingredients.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="avoidIngredients"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ingredients to Avoid (comma separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cilantro, Mushrooms, Olives" className="rounded-xl" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Things you just don't like.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="healthGoals"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Health Goals (comma separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="High protein, Low carb, Gut-friendly" className="rounded-xl" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Logistics</CardTitle>
                            <CardDescription>Budget, time, and skill constraints.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Budget Target</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="100" className="rounded-xl" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="budgetCurrency"
                                    render={({ field }) => (
                                        <FormItem className="w-24">
                                            <FormLabel>Currency</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ZAR" className="rounded-xl uppercase" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="budgetType"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Per</FormLabel>
                                            <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="per_meal">Total Meal</SelectItem>
                                                    <SelectItem value="per_serving">Serving</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="maxCookTime"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Max Cook Time (minutes)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="45" className="rounded-xl" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="skillLevel"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Cooking Skill</FormLabel>
                                            <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl">
                                                        <SelectValue placeholder="Select skill level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="timeConstraints"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time constraints / Context</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="I get home late from work, need something with minimal prep."
                                                className="rounded-xl resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>
                    </Card>

                    <Button type="submit" className="rounded-xl px-8 h-12 w-full sm:w-auto">
                        Save Preferences
                    </Button>
                </form>
            </Form>
        </div>
    )
}
