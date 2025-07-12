import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

export function MessageList() {
  return (
    <div className="p-4 space-y-4">
      {messages.map(msg => (
        <Card key={msg.id}>
          <CardContent className="p-3">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={msg.avatar} />
              </Avatar>
              <div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">{msg.username}</span>
                  <Badge variant="secondary">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
                <p>{msg.content}</p>
                <MessageReactions reactions={msg.reactions} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}