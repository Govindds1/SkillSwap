'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Search, MoreVertical, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
  unread?: number;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Sarah Johnson', avatar: 'S', online: true, lastMessage: 'That sounds great!' },
  { id: '2', name: 'Marcus Lee', avatar: 'M', online: true, lastMessage: 'Can we reschedule?' },
  { id: '3', name: 'Emily Rodriguez', avatar: 'E', online: false, lastMessage: 'Thank you!' },
  { id: '4', name: 'James Wilson', avatar: 'J', online: true, lastMessage: 'See you tomorrow' },
  { id: '5', name: 'Priya Patel', avatar: 'P', online: false, lastMessage: 'Perfect, thanks!' },
];

export function ChatInterface() {
  const [selectedUserId, setSelectedUserId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'user',
      text: 'Hey Sarah! How are you doing?',
      timestamp: new Date(Date.now() - 600000),
      isOwn: true,
    },
    {
      id: '2',
      senderId: '1',
      text: 'I&apos;m doing great! Just finished the UI design tutorial you recommended.',
      timestamp: new Date(Date.now() - 480000),
      isOwn: false,
    },
    {
      id: '3',
      senderId: 'user',
      text: 'That&apos;s awesome! How did you find it?',
      timestamp: new Date(Date.now() - 300000),
      isOwn: true,
    },
    {
      id: '4',
      senderId: '1',
      text: 'Really helpful! Would love to learn more about Figma from you.',
      timestamp: new Date(Date.now() - 120000),
      isOwn: false,
    },
  ]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId);

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        senderId: 'user',
        text: messageText,
        timestamp: new Date(),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');

      // Simulate reply after 1s
      setTimeout(() => {
        const replyMessage: Message = {
          id: String(messages.length + 2),
          senderId: selectedUserId,
          text: 'That&apos;s great! Let me know when you want to schedule a session.',
          timestamp: new Date(),
          isOwn: false,
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 1000);
    }
  };

  return (
    <div className="h-screen flex bg-warm-cream overflow-hidden animate-in fade-in duration-700">
      {/* Left Sidebar - Users List */}
      <div className="w-full md:w-80 bg-white border-r border-border flex flex-col shadow-lg md:shadow-none">
        {/* Header */}
        <div className="p-6 border-b border-border animate-in fade-in slide-in-from-left-4 duration-700">
          <h2 className="text-2xl font-bold text-foreground mb-4">Messages</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-warm-cream border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user, index) => (
            <button
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`w-full px-6 py-4 border-b border-border text-left transition-all hover:bg-warm-cream ${
                selectedUserId === user.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
              } animate-in fade-in slide-in-from-left-4 duration-700`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    selectedUserId === user.id
                      ? 'bg-gradient-to-br from-primary to-primary/60'
                      : 'bg-gradient-to-br from-golden-yellow to-golden-yellow/60'
                  }`}>
                    {user.avatar}
                  </div>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{user.lastMessage}</p>
                </div>

                {/* Unread Badge */}
                {user.unread && (
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {user.unread}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="hidden md:flex flex-col flex-1">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-border p-6 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-700">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-white">
                    {selectedUser.avatar}
                  </div>
                  {selectedUser.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.online ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-warm-cream rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                    message.isOwn ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
                      message.isOwn
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white rounded-br-none'
                        : 'bg-warm-cream text-foreground rounded-bl-none border border-border'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1.5 ${
                      message.isOwn ? 'text-primary/40' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-border p-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-warm-cream rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-muted-foreground" />
                </button>

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 bg-warm-cream border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-2 hover:bg-warm-cream rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-muted-foreground">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
