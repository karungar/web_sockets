import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function ChatRoom() {
  return (
    <Card className="flex-1">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">#general</h2>
        </div>
        <ScrollArea className="flex-1">
          <MessageList />
        </ScrollArea>
        <Separator />
        <MessageInput />
      </CardContent>
    </Card>
  )
}