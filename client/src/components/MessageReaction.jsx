import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🔥'];

export const MessageReactions = ({
  reactions,
  onReaction,
  currentUserId
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const hasReacted = (emoji) => {
    return reactions[emoji]?.some(r => r.userId === currentUserId) || false;
  };

  const getReactionCount = (emoji) => {
    return reactions[emoji]?.length || 0;
  };

  const handleReactionClick = (emoji) => {
    onReaction(emoji);
    setShowEmojiPicker(false);
  };

  const reactionKeys = Object.keys(reactions).filter(emoji => reactions[emoji].length > 0);

  if (reactionKeys.length === 0 && !showEmojiPicker) {
    return (
      <div className="mt-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEmojiPicker(true)}
          className="h-6 w-6"
        >
          <PlusIcon className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1 items-center">
      {reactionKeys.map(emoji => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          onClick={() => handleReactionClick(emoji)}
          className={cn(
            "h-6 px-2 text-xs rounded-full",
            hasReacted(emoji)
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          <span className="mr-1">{emoji}</span>
          <span>{getReactionCount(emoji)}</span>
        </Button>
      ))}
      
      {showEmojiPicker ? (
        <div className="flex flex-wrap gap-1 ml-2">
          {commonEmojis.map(emoji => (
            <Button
              key={emoji}
              variant="ghost"
              size="icon"
              onClick={() => handleReactionClick(emoji)}
              className="h-6 w-6 text-sm hover:bg-accent"
            >
              {emoji}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(false)}
            className="h-6 w-6 text-muted-foreground"
          >
            ×
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEmojiPicker(true)}
          className="h-6 w-6 ml-1"
        >
          <PlusIcon className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};