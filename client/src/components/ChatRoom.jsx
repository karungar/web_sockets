import React, { useState, useEffect, useRef } from 'react';
import { 
  UsersIcon, 
  HashtagIcon, 
  BellIcon, 
  MagnifyingGlassIcon, 
  Cog6ToothIcon, 
  Bars3Icon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserList } from './UserList';
import { RoomList } from './RoomList';
import { Sidebar } from './Sidebar';
import { NotificationCenter } from './NotificationCenter';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const ChatRoom = ({ socket, user, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [typingUsers, setTypingUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [currentPrivateChat, setCurrentPrivateChat] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef();
  const notificationSound = useRef();

  useEffect(() => {
    // Initialize notification sound
    notificationSound.current = new Audio('/notification.mp3');
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Socket event listeners
    socket.on('room_messages', (roomMessages) => {
      setMessages(roomMessages);
    });

    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Play notification sound
      if (message.userId !== user.id) {
        notificationSound.current?.play().catch(() => {});
      }
      
      // Mark as read if in current room
      if (message.userId !== user.id && currentRoom === message.roomId) {
        socket.emit('mark_read', { messageId: message.id, roomId: currentRoom });
      }
    });

    socket.on('private_message', (message) => {
      const chatKey = message.senderId === user.id ? message.recipientId : message.senderId;
      setPrivateChats(prev => {
        const updated = new Map(prev);
        const existing = updated.get(chatKey) || [];
        updated.set(chatKey, [...existing, message]);
        return updated;
      });
      
      // Play notification sound
      if (message.senderId !== user.id) {
        notificationSound.current?.play().catch(() => {});
      }
    });

    socket.on('room_users', (roomUsers) => {
      setUsers(roomUsers);
    });

    socket.on('room_list', (roomList) => {
      setRooms(roomList);
    });

    socket.on('user_typing', ({ userId, username, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter(name => name !== username);
        }
      });
    });

    socket.on('notification', (notification) => {
      setNotifications(prev => [...prev, notification]);
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/favicon.ico'
        });
      }
    });

    socket.on('search_results', (results) => {
      setSearchResults(results);
    });

    socket.on('reaction_added', ({ messageId, reactions }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, reactions } : msg
      ));
    });

    socket.on('message_read', ({ messageId, readBy }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, readBy } : msg
      ));
    });

    // Get initial data
    socket.emit('get_rooms');

    return () => {
      socket.off('room_messages');
      socket.off('new_message');
      socket.off('private_message');
      socket.off('room_users');
      socket.off('room_list');
      socket.off('user_typing');
      socket.off('notification');
      socket.off('search_results');
      socket.off('reaction_added');
      socket.off('message_read');
    };
  }, [socket, user.id, currentRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clear typing indicators after timeout
    if (typingUsers.length > 0) {
      const timeout = setTimeout(() => {
        setTypingUsers([]);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [typingUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomChange = (roomId) => {
    setCurrentRoom(roomId);
    setCurrentPrivateChat(null);
    socket.emit('join_room', { roomId });
  };

  const handlePrivateChat = (userId) => {
    setCurrentPrivateChat(userId);
    setCurrentRoom('');
  };

  const handleSendMessage = (content, type = 'text') => {
    if (currentPrivateChat) {
      socket.emit('send_private_message', {
        recipientId: currentPrivateChat,
        content
      });
    } else {
      socket.emit('send_message', {
        roomId: currentRoom,
        content,
        type
      });
    }
  };

  const handleTyping = (isTyping) => {
    if (currentRoom && !currentPrivateChat) {
      socket.emit('typing', { roomId: currentRoom, isTyping });
    }
  };

  const handleReaction = (messageId, emoji) => {
    if (currentRoom && !currentPrivateChat) {
      socket.emit('add_reaction', { messageId, roomId: currentRoom, emoji });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() && currentRoom) {
      socket.emit('search_messages', { roomId: currentRoom, query });
    } else {
      setSearchResults([]);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const currentMessages = currentPrivateChat 
    ? privateChats.get(currentPrivateChat) || [] 
    : messages;

  const currentRoomName = currentPrivateChat 
    ? users.find(u => u.id === currentPrivateChat)?.username || 'Private Chat'
    : rooms.find(r => r.id === currentRoom)?.name || 'General';

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowSidebar(false)}>
          <div className="w-80 bg-card h-full overflow-y-auto border-r" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat Rooms</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
            <Sidebar
              rooms={rooms}
              users={users}
              currentRoom={currentRoom}
              currentPrivateChat={currentPrivateChat}
              onRoomChange={handleRoomChange}
              onPrivateChat={handlePrivateChat}
              currentUser={user}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-card border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-card-foreground">Chat Rooms</h2>
        </div>
        <Sidebar
          rooms={rooms}
          users={users}
          currentRoom={currentRoom}
          currentPrivateChat={currentPrivateChat}
          onRoomChange={handleRoomChange}
          onPrivateChat={handlePrivateChat}
          currentUser={user}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden"
              >
                <Bars3Icon className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <HashtagIcon className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold text-card-foreground">{currentRoomName}</h1>
              </div>
              {!currentPrivateChat && (
                <div className="flex items-center space-x-1">
                  <UsersIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{users.length} members</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <BellIcon className="w-5 h-5" />
                {notifications.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <>
              <Separator className="my-4" />
              <SearchBar onSearch={handleSearch} />
            </>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList
                messages={searchQuery ? searchResults : currentMessages}
                currentUser={user}
                onReaction={handleReaction}
                typingUsers={typingUsers}
              />
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                placeholder={`Message ${currentRoomName}...`}
              />
            </div>
          </div>

          {/* Right Sidebar - User List */}
          {!currentPrivateChat && (
            <div className="hidden xl:block w-64 bg-card border-l">
              <UserList
                users={users}
                currentUser={user}
                onPrivateChat={handlePrivateChat}
              />
            </div>
          )}
        </div>
      </div>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClear={clearNotifications}
        />
      )}
    </div>
  );
};