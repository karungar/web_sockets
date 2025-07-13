import React from 'react';
import { HashtagIcon, UsersIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const RoomList = ({
  rooms,
  currentRoom,
  onRoomChange
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Channels
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      
      {rooms.map(room => (
        <Button
          key={room.id}
          variant="ghost"
          onClick={() => onRoomChange(room.id)}
          className={cn(
            "w-full justify-start h-auto p-3 text-left font-normal",
            currentRoom === room.id && "bg-accent border-r-2 border-primary"
          )}
        >
          <div className="flex items-center space-x-3 w-full">
            <HashtagIcon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium text-card-foreground">{room.name}</div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <UsersIcon className="w-3 h-3" />
              <span>{room.userCount}</span>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};