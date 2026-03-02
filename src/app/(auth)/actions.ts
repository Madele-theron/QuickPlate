import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const supabase = await createClient()

    // Use Magic link email auth
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function loginWithGoogle() {
    'use server'
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (data.url) {
        redirect(data.url)
    }

    if (error) {
        return { error: error.message }
    }
}

export async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}
