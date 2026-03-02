import { streamText, Message } from 'ai'
import { google } from '@ai-sdk/google'
import { createClient } from '@/lib/supabase/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages, recipeId, recipeContext } = await req.json()

    // In a full production app you'd fetch the previous thread from Supabase right here
    // and append the new message. For this scope, the `ai` SDK client handles the rolling 
    // context window locally and sends the full array in `messages`.

    // We provide the current recipe context as a system prompt injected at the start.
    const initialMessages = messages.slice(0, -1)
    const currentMessage = messages[messages.length - 1]

    const systemPrompt = `
    You are an expert culinary assistant helping the user cook the following recipe.
    You must be encouraging, concise, and highly knowledgeable about cooking techniques, substitutions, and fixing mistakes.
    
    RECIPE CONTEXT:
    Title: ${recipeContext?.title}
    Servings: ${recipeContext?.servings}
    Ingredients: ${recipeContext?.ingredients?.map((i: any) => `${i.quantity || ''} ${i.unit || ''} ${i.name}`).join(', ')}
    Steps: ${recipeContext?.steps?.map((s: any) => `${s.stepNumber}. ${s.instruction}`).join(' ')}

    RULES:
    1. Only answer questions related to cooking, this recipe, or food.
    2. Give short, direct, actionable advice. No long essays.
    3. Use markdown formatting sparingly but effectively (e.g. bolding key temperatures or times).
  `

    const result = streamText({
        model: google('gemini-1.5-flash'),
        system: systemPrompt,
        messages: messages,
    })

    // We could implement an onFinish callback here to persist the `messages` array 
    // to Supabase chat_messages table if `recipeId` and the user are authenticated.

    return result.toDataStreamResponse()
}
