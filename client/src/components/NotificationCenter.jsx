import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NotificationCenter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <BellIcon />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-2">
        {notifications.map(notification => (
          <Card className="mb-2">
            <CardContent className="p-3">
              {notification.content}
            </CardContent>
          </Card>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}