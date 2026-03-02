'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ChefHat, Mail, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, loginWithGoogle } from './actions'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('email', email)

        const res = await login(formData)
        setLoading(false)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Check your email for the login link!')
            setEmail('')
        }
    }

    const handleGoogleLogin = async () => {
        await loginWithGoogle()
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-sans p-4">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                <ChefHat className="h-5 w-5" />
                <span>AI Recipe Builder</span>
            </Link>

            <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome back</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Sign in to sync your pantry and recipes</p>
                </div>

                <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-xl"
                        />
                    </div>
                    <Button type="submit" className="h-12 w-full rounded-xl" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                        Continue with Email
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    type="button"
                    className="h-12 w-full rounded-xl"
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                </Button>
            </div>
        </div>
    )
}
