import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Database } from '@/types/database'

type Json = Database['public']['Tables']['preferences']['Row']['data']

interface Preferences {
    diet: string
    allergies: string[]
    avoidIngredients: string[]
    budget: number
    budgetCurrency: string
    budgetType: 'per_meal' | 'per_serving'
    healthGoals: string[]
    mealFrequency: string
    timeConstraints: string
    maxCookTime: number
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
    appliances: string[]
    likes: string[]
    dislikes: string[]
}

const defaultPreferences: Preferences = {
    diet: 'omnivore',
    allergies: [],
    avoidIngredients: [],
    budget: 100,
    budgetCurrency: 'ZAR',
    budgetType: 'per_meal',
    healthGoals: [],
    mealFrequency: '3 meals a day',
    timeConstraints: '',
    maxCookTime: 45,
    skillLevel: 'intermediate',
    appliances: ['stove', 'oven', 'microwave'],
    likes: [],
    dislikes: [],
}

interface UserState {
    isGuest: boolean
    userId: string | null
    preferences: Preferences
    pantry: string[]
    syncing: boolean

    // Actions
    setUserId: (id: string | null) => void
    setIsGuest: (guest: boolean) => void
    updatePreferences: (prefs: Partial<Preferences>) => void
    setPantry: (items: string[]) => void
    setSyncing: (isSyncing: boolean) => void
    resetState: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            isGuest: true,
            userId: null,
            preferences: defaultPreferences,
            pantry: [],
            syncing: false,

            setUserId: (id) => set({ userId: id, isGuest: !id }),
            setIsGuest: (guest) => set({ isGuest: guest, userId: guest ? null : get().userId }),
            updatePreferences: (prefs) => set((state) => ({
                preferences: { ...state.preferences, ...prefs }
            })),
            setPantry: (items) => set({ pantry: items }),
            setSyncing: (isSyncing) => set({ syncing: isSyncing }),
            resetState: () => set({ isGuest: true, userId: null, preferences: defaultPreferences, pantry: [] }),
        }),
        {
            name: 'recipe-builder-storage',
            // skip syncing state
            partialize: (state) => ({
                isGuest: state.isGuest,
                preferences: state.preferences,
                pantry: state.pantry,
            }),
        }
    )
)
