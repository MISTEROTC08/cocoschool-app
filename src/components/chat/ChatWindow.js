import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { chatService } from '@/services/ChatService';
import {
  Card,
  Button,
  Input,
  Avatar,
  ScrollArea,
} from '@/components/ui';

const ChatWindow = ({ chatId, onClose }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const typingTimeout = useRef(null);
  
  const {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    sendTypingStatus,
  } = chatService.useChat(chatId);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    // Gérer le statut "en train d'écrire"
    setIsTyping(true);
    sendTypingStatus(true);

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 1000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Convertir en base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        await sendMessage(reader.result, 'image');
      };
    } catch (error) {
      console.error('Erreur upload fichier:', error);
    }
  };

  return (
    <Card className="w-full max-w-md h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          ✕
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea 
        ref={scrollRef}
        className="flex-1 p-4"
      >
        {loading && (
          <div className="flex justify-center p-4">
            <span className="loading loading-dots"></span>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4">
            Erreur de chargement des messages
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`
                max-w-[70%] rounded-lg p-3
                ${msg.isSelf 
                  ? 'bg-blue-500 text-white ml-auto' 
                  : 'bg-gray-100'
                }
              `}
            >
              {!msg.isSelf && (
                <div className="flex items-center mb-1">
                  <Avatar
                    src={msg.sender.avatar}
                    alt={msg.sender.name}
                    size="sm"
                  />
                  <span className="ml-2 text-sm font-medium">
                    {msg.sender.name}
                  </span>
                </div>
              )}

              {msg.type === 'text' ? (
                <p className="break-words">{msg.content}</p>
              ) : msg.type === 'image' ? (
                <img
                  src={msg.content}
                  alt="Image partagée"
                  className="max-w-full rounded"
                />
              ) : null}

              <div className={`
                text-xs mt-1
                ${msg.isSelf ? 'text-blue-100' : 'text-gray-500'}
              `}>
                {format(new Date(msg.timestamp), 'HH:mm', { locale: fr })}
                {msg.isSelf && (
                  <span className="ml-2">
                    {msg.read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Input Area */}
      <form 
        onSubmit={handleSend}
        className="p-4 border-t flex items-center gap-2"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => document.getElementById('file-upload').click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Input
          value={message}
          onChange={handleTyping}
          placeholder="Votre message..."
          className="flex-1"
        />
        
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </Card>
  );
};

export default ChatWindow;