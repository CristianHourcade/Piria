"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Collaborator {
  id: string | number
  name: string
  initial: string
}

interface CollaboratorSelectorProps {
  collaborators: Collaborator[]
  selectedCollaborator?: string
  onSelect: (collaboratorName: string) => void
  placeholder?: string
}

export function CollaboratorSelector({
  collaborators,
  selectedCollaborator,
  onSelect,
  placeholder = "Seleccionar colaborador",
}: CollaboratorSelectorProps) {
  return (
    <Select defaultValue={selectedCollaborator} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {collaborators.map((collaborator) => (
          <SelectItem key={collaborator.id.toString()} value={collaborator.name}>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {collaborator.initial}
                </AvatarFallback>
              </Avatar>
              {collaborator.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
