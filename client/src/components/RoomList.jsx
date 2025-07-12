import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function RoomList() {
  return (
    <ScrollArea>
      {rooms.map(room => (
        <Button variant="ghost" className="w-full justify-start">
          #{room.name}
          <Badge className="ml-auto">{room.userCount}</Badge>
        </Button>
      ))}
    </ScrollArea>
  )
}