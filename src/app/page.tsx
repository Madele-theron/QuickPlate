import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChefHat } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950 font-sans px-6 text-center">
      <main className="flex max-w-2xl flex-col items-center gap-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <ChefHat className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Cook smarter, not harder.
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Your personal AI sous-chef. Generate custom recipes from your pantry,
            respecting your diet, budget, and time. Plus, a continuous chat to
            guide you through every step of the cooking process.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Button size="lg" className="rounded-full shadow-sm" asChild>
            <Link href="/dashboard">
              Try as Guest
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full shadow-sm bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900" asChild>
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
