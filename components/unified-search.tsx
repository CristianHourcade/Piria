"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTerminology } from "@/context/terminology-context"
import { unifiedSearch } from "@/utils/search-utils"

interface UnifiedSearchProps<T> {
  items: T[]
  onSearch: (filteredItems: T[]) => void
  itemType: "client" | "project" | "task"
  placeholder?: string
  className?: string
}

export function UnifiedSearch<T>({ items, onSearch, itemType, placeholder, className }: UnifiedSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const { clientTerm, projectTerm, taskTerm } = useTerminology()

  // Determine default placeholder based on item type
  const defaultPlaceholder = () => {
    switch (itemType) {
      case "client":
        return `Buscar ${clientTerm.toLowerCase()}s...`
      case "project":
        return `Buscar ${projectTerm.toLowerCase()}s...`
      case "task":
        return `Buscar ${taskTerm.toLowerCase()}s...`
      default:
        return "Buscar..."
    }
  }

  // Apply search when term changes
  useEffect(() => {
    const filteredItems = unifiedSearch(searchTerm, items, itemType)
    onSearch(filteredItems)
  }, [searchTerm, items, itemType, onSearch])

  return (
    <div className={`relative ${className || ""}`}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder || defaultPlaceholder()}
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
