import { Input } from "@/components/ui/input"
import { Command, CommandList, CommandItem } from "@/components/ui/command"

export function SearchBar() {
  return (
    <div className="relative">
      <Input placeholder="Search messages..." />
      {results.length > 0 && (
        <Command className="absolute top-full left-0 right-0 border shadow-lg">
          <CommandList>
            {results.map(result => (
              <CommandItem>{result.content}</CommandItem>
            ))}
          </CommandList>
        </Command>
      )}
    </div>
  )
}