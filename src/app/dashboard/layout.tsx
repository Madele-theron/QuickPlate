import Link from "next/link";
import { redirect } from "next/navigation";
import { ChefHat, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 px-4 sm:px-6 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <ChefHat className="h-5 w-5" />
                    <span className="sr-only sm:not-sr-only">AI Recipe Builder</span>
                </Link>
                <div className="ml-auto flex items-center gap-4">
                    <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
                        <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                            Workspace
                        </Link>
                        <Link href="/history" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                            History
                        </Link>
                        <Link href="/preferences" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                            Preferences
                        </Link>
                    </nav>

                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-zinc-500 hidden md:inline-block truncate max-w-[150px]">
                                {user.email}
                            </span>
                            <form action={logout}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" type="submit" title="Log out">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <span>Guest</span>
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-3 text-xs" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-6xl mx-auto">
                {children}
            </main>
        </div>
    );
}
