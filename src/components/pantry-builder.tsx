'use client'

import { useState } from 'react'
import { Plus, X, Search } from 'lucide-react'
import { COMMON_INGREDIENTS } from '@/lib/ingredients'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

/**
 * For this demo version, we manage pantry items loosely in local state, 
 * but to persist them we'll sync them right back up to the parent component or a store.
 * We'll use local state for immediate interaction, and we can hoist it if needed.
 */
export default function PantryBuilder({
    items,
    setItems
}: {
    items: string[],
    setItems: (items: string[]) => void
}) {
    const [customItem, setCustomItem] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const handleAddItem = (item: string) => {
        const trimmed = item.trim()
        if (!trimmed) return
        // Prevent duplicates
        if (!items.find(i => i.toLowerCase() === trimmed.toLowerCase())) {
            setItems([...items, trimmed])
        }
        setCustomItem('')
    }

    const handleRemoveItem = (itemToRemove: string) => {
        setItems(items.filter(item => item !== itemToRemove))
    }

    const toggleCommonItem = (item: string, checked: boolean) => {
        if (checked) {
            handleAddItem(item)
        } else {
            handleRemoveItem(item)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search or add custom ingredient..."
                            className="pl-9 mr-2 h-10 w-full rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                            value={customItem || searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCustomItem(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAddItem(customItem)
                                    setSearchQuery('')
                                }
                            }}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            handleAddItem(customItem)
                            setSearchQuery('')
                        }}
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl"
                        disabled={!customItem.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 min-h-[100px]">
                    {items.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-sm text-zinc-500 py-8">
                            Your pantry is empty. Add ingredients to start.
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {items.map(item => (
                                <Badge
                                    key={item}
                                    variant="secondary"
                                    className="pl-3 pr-2 py-1.5 text-sm gap-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-normal"
                                >
                                    {item}
                                    <button
                                        onClick={() => handleRemoveItem(item)}
                                        className="ml-1 rounded-full p-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <Card className="rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Common Ingredients</CardTitle>
                    <CardDescription>Quickly check off what you have available.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-6">
                            {COMMON_INGREDIENTS.map(category => (
                                <div key={category.category} className="space-y-3">
                                    <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                                        {category.category}
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {category.items
                                            .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map(item => (
                                                <div key={item} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`item-${item}`}
                                                        checked={items.includes(item)}
                                                        onCheckedChange={(checked) => toggleCommonItem(item, !!checked)}
                                                        className="rounded"
                                                    />
                                                    <Label
                                                        htmlFor={`item-${item}`}
                                                        className="text-sm font-normal text-zinc-700 dark:text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {item}
                                                    </Label>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
