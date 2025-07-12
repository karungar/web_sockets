import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"

export function MessageReactions({ reactions }) {
  return (
    <div className="flex gap-1 mt-2">
      {Object.entries(reactions).map(([emoji, users]) => (
        <HoverCard>
          <HoverCardTrigger>
            <Badge variant="outline">
              {emoji} {users.length}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent>
            {users.map(user => user.username).join(', ')}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}