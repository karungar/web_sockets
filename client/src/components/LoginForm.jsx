import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const avatarOptions = [
  '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🎨', '👩‍🎨', '🧑‍🔬', '👨‍🏫', '👩‍🏫',
  '🧑‍⚕️', '👨‍🚀', '👩‍🚀', '🧑‍🎤', '👨‍🎭', '👩‍🎭', '🧑‍🍳', '👨‍🌾'
];

export const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim(), selectedAvatar);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl p-8 w-full max-w-md border">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Join the Chat</h1>
          <p className="text-muted-foreground">Enter your details to start chatting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-card-foreground">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="pl-10"
                required
                maxLength={20}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">
              Choose Avatar
            </label>
            <div className="grid grid-cols-8 gap-2">
              {avatarOptions.map((avatar) => (
                <Button
                  key={avatar}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={cn(
                    "h-10 w-10 rounded-lg text-xl transition-all",
                    selectedAvatar === avatar
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "hover:bg-accent"
                  )}
                >
                  {avatar}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!username.trim()}
            className="w-full"
            size="lg"
          >
            Start Chatting
          </Button>
        </form>
      </div>
    </div>
  );
};