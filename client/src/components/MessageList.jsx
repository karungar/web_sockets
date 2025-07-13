import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckIcon } from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';
import { MessageReactions } from './MessageReaction';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const MessageList = ({
  messages,
  currentUser,
  onReaction,
  typingUsers
}) => {
  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const isOwnMessage = (userId) => userId === currentUser.id;

  const getReadStatus = (message) => {
    if (message.userId !== currentUser.id) return null;
    
    const readCount = message.readBy.length;
    if (readCount === 1) return <CheckIcon className="w-4 h-4 text-muted-foreground" />;
    if (readCount > 1) return <CheckSolidIcon className="w-4 h-4 text-primary" />;
    return null;
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            isOwnMessage(message.userId) ? "justify-end" : "justify-start"
          )}
        >
          <div className={cn(
            "max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl",
            isOwnMessage(message.userId) ? "order-2" : "order-1"
          )}>
            <div className="flex items-start space-x-3">
              {!isOwnMessage(message.userId) && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-sm">
                    {message.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex-1">
                {!isOwnMessage(message.userId) && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{message.username}</span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                  </div>
                )}
                
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    isOwnMessage(message.userId)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {isOwnMessage(message.userId) && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
                      <div className="flex items-center space-x-1">
                        {getReadStatus(message)}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Reactions */}
                <MessageReactions
                  reactions={message.reactions}
                  onReaction={(emoji) => onReaction(message.id, emoji)}
                  currentUserId={currentUser.id}
                />
              </div>
              
              {isOwnMessage(message.userId) && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-sm bg-primary/10">
                    {message.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
        </div>
      )}
    </div>
  );
};