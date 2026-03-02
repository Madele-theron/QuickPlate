import { z } from "zod"

export const recipeSchema = z.object({
    title: z.string().describe("The name of the recipe."),
    description: z.string().describe("A short mouth-watering description of the dish."),
    servings: z.number().describe("How many people this recipe serves."),
    prepTimeMinutes: z.number().describe("Estimated preparation time in minutes."),
    cookTimeMinutes: z.number().describe("Estimated cooking time in minutes."),
    totalTimeMinutes: z.number().describe("Total time to make the recipe."),
    ingredients: z.array(z.object({
        name: z.string().describe("The name of the ingredient."),
        quantity: z.number().optional().describe("The amount of the ingredient (e.g. 2, 0.5). Should be empty if it's 'to taste' or a pinch."),
        unit: z.string().optional().describe("The unit of measurement (e.g. cups, tbsp, grams). Should be empty if it's a count like '1 onion'."),
        notes: z.string().optional().describe("E.g. diced, minced, at room temperature."),
        optionalSubstitute: z.string().optional().describe("A suggested substitute if the user might not have this, or if an allergy/diet alternative is needed."),
    })).describe("The list of ingredients needed."),
    steps: z.array(z.object({
        stepNumber: z.number(),
        instruction: z.string().describe("Detailed instruction for this step."),
        timerMinutes: z.number().optional().describe("If this step involves waiting or cooking for a specific time, provide the minutes for a UI timer."),
    })).describe("Step by step instructions to cook the meal."),
    tips: z.array(z.string()).optional().describe("Chef tips, serving suggestions, or how to store leftovers."),
    estimatedCost: z.number().optional().describe("A rough estimated total cost in the user's requested budget currency."),
    costNotes: z.string().optional().describe("Explanation of the cost (e.g. 'Assumes you already have the spices')."),
    nutritionEstimate: z.object({
        calories: z.number().optional(),
        protein: z.number().optional(),
        carbs: z.number().optional(),
        fat: z.number().optional(),
    }).optional().describe("Rough nutritional estimate per serving."),
    whyThisMatchesPreferences: z.array(z.string()).describe("A short 1-3 bullet list explaining why this recipe fits their specific dietary needs, budget, or timeframe."),
})

export type Recipe = z.infer<typeof recipeSchema>
