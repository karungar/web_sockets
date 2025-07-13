import React from 'react';
import { RoomList } from './RoomList';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const Sidebar = ({
  rooms,
  users,
  currentRoom,
  currentPrivateChat,
  onRoomChange,
  onPrivateChat,
  currentUser
}) => {
  const otherUsers = users.filter(user => user.id !== currentUser.id);

  return (
    <ScrollArea className="h-full">
      {/* Rooms Section */}
      <div className="border-b">
        <RoomList
          rooms={rooms}
          currentRoom={currentRoom}
          onRoomChange={onRoomChange}
        />
      </div>
      
      {/* Direct Messages Section */}
      <div className="py-4">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Direct Messages
          </h3>
        </div>
        
        <div className="space-y-1">
          {otherUsers.map(user => (
            <Button
              key={user.id}
              variant="ghost"
              onClick={() => onPrivateChat(user.id)}
              className={cn(
                "w-full justify-start h-auto p-3 text-left font-normal",
                currentPrivateChat === user.id && "bg-accent border-r-2 border-primary"
              )}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="relative">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-sm">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                    user.isOnline ? "bg-green-500" : "bg-muted-foreground"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-card-foreground">{user.username}</div>
                </div>
                <ChatBubbleLeftIcon className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </div>
        
        {otherUsers.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <p className="text-sm">No other users online</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};