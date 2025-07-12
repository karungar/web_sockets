import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function UserList() {
  return (
    <div className="space-y-2">
      {users.map(user => (
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2 w-full">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            </Avatar>
            <span>{user.username}</span>
          </TooltipTrigger>
          <TooltipContent>
            {user.isOnline ? 'Online' : `Last seen ${user.lastSeen}`}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}