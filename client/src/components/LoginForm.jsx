import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function LoginForm({ onLogin }) {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Join Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Avatar className="self-center w-24 h-24">
            <AvatarImage src={avatar} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Input placeholder="Username" />
          <Button onClick={handleLogin}>Enter Chat</Button>
        </div>
      </CardContent>
    </Card>
  )
}