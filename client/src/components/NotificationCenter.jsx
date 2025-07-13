import React from 'react';
import { XMarkIcon, BellIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const NotificationCenter = ({
  notifications,
  onClose,
  onClear
}) => {
  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-card shadow-lg border-l z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellIcon className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-card-foreground">Notifications</h2>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                className="h-8 w-8"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <XMarkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-full pb-20">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <BellIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="p-3 bg-muted rounded-lg border"
              >
                <div className="font-medium text-card-foreground text-sm mb-1">
                  {notification.title}
                </div>
                <div className="text-muted-foreground text-sm">
                  {notification.content}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {notification.type === 'message' ? 'Message' : 'Private Message'}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};