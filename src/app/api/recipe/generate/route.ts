import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { recipeSchema } from '@/lib/schema/recipe'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const { prompt, preferences, pantry } = await req.json()

        // Generate recipe JSON using Gemini
        const { object } = await generateObject({
            model: google('gemini-1.5-flash'),
            schema: recipeSchema,
            system: `
        You are an expert chef and culinary assistant. 
        Your job is to create a recipe that strictly adheres to the user's preferences, allergies, budget, and time constraints.
        Try to utilize ingredients from their pantry if provided, but you can suggest a few extra common items if necessary.
        
        USER CONSTRAINTS:
        - Diet: ${preferences.diet || 'Any'}
        - Allergies: ${preferences.allergies?.join(', ') || 'None'} - YOU MUST STRICTLY AVOID THESE.
        - Avoid: ${preferences.avoidIngredients?.join(', ') || 'None'}
        - Health Goals: ${preferences.healthGoals?.join(', ') || 'None'}
        - Budget: ${preferences.budget} ${preferences.budgetCurrency} (${preferences.budgetType})
        - Max Cook Time: ${preferences.maxCookTime} minutes
        - Skill Level: ${preferences.skillLevel}
        - Time Constraints Context: ${preferences.timeConstraints || 'None'}
        
        AVAILABLE PANTRY: 
        ${pantry?.length > 0 ? pantry.join(', ') : 'Assume a bare kitchen, suggest simple accessible ingredients.'}
      `,
            prompt: `I want to make: ${prompt}. Please create an amazing recipe for this!`,
        })

        // Prepare response. We are going to attempt to save it if the user is authenticated, 
        // otherwise we just return it for the Guest mode to use locally.

        let recipeId = null // UUID if saved to DB, null if guest

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Save to database
            const { data, error } = await (supabase.from('recipes') as any)
                .insert({
                    user_id: user.id,
                    title: object.title,
                    recipe_json: object as any,
                })
                .select()
                .single()

            if (error) {
                console.error("Failed to save recipe to DB:", error)
            } else {
                recipeId = (data as any).id
            }
        }

        return NextResponse.json({
            recipeId,
            recipe: object
        })

    } catch (error) {
        console.error('Recipe generation failed:', error)
        return NextResponse.json(
            { error: 'Failed to generate recipe' },
            { status: 500 }
        )
    }
}
