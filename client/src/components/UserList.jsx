import React from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const UserList = ({
  users,
  currentUser,
  onPrivateChat
}) => {
  const otherUsers = users.filter(user => user.id !== currentUser.id);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-card-foreground">Online Users</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-2">
            {otherUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                      user.isOnline ? "bg-green-500" : "bg-muted-foreground"
                    )} />
                  </div>
                  
                  <div>
                    <div className="font-medium text-card-foreground">{user.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPrivateChat(user.id)}
                  className="h-8 w-8"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {otherUsers.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p>No other users online</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};