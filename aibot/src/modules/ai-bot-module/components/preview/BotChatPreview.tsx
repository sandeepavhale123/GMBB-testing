import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { EmbedSettings, DEFAULT_EMBED_SETTINGS } from '../../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BotChatPreviewProps {
  botId: string;
  botName: string;
  embedSettings?: EmbedSettings;
}

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export const BotChatPreview: React.FC<BotChatPreviewProps> = ({
  botId,
  botName,
  embedSettings = DEFAULT_EMBED_SETTINGS,
}) => {
  const {
    bubble_color = '#3B82F6',
    header_color,
    display_name,
    welcome_message,
    user_message_color,
    bot_message_color,
    font_family = 'system-ui',
    border_radius = '12',
    show_bot_avatar = true,
    bot_avatar_url,
    input_placeholder = 'Type your message...',
    privacy_policy_url,
    privacy_policy_name = 'Privacy Policy',
  } = embedSettings;

  const headerBg = header_color || bubble_color;
  const headerTextColor = isLightColor(headerBg) ? '#000000' : '#ffffff';
  const displayTitle = display_name || botName;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (welcome_message) {
      setMessages([{ role: 'assistant', content: welcome_message }]);
    }
  }, [welcome_message]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-bot-chat', {
        body: {
          bot_id: botId,
          message: userMessage,
          session_id: sessionId,
          conversation_history: messages,
        },
      });

      if (error) throw error;

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (welcome_message) {
      setMessages([{ role: 'assistant', content: welcome_message }]);
    } else {
      setMessages([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderBotAvatar = () => {
    if (!show_bot_avatar) return null;
    if (bot_avatar_url) {
      return (
        <img
          src={bot_avatar_url}
          alt="Bot"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      );
    }
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bubble_color }}
      >
        <Bot className="w-4 h-4 text-white" />
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-[600px] w-full max-w-[400px] mx-auto border overflow-hidden shadow-lg bg-background"
      style={{
        borderRadius: `${border_radius}px`,
        fontFamily: font_family,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: headerBg,
          borderTopLeftRadius: `${border_radius}px`,
          borderTopRightRadius: `${border_radius}px`,
        }}
      >
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" style={{ color: headerTextColor }} />
          <h3 className="font-semibold" style={{ color: headerTextColor }}>{displayTitle}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="hover:bg-white/10"
          style={{ color: headerTextColor }}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start a conversation to test your bot</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && renderBotAvatar()}
              <div
                className="max-w-[80%] rounded-lg px-4 py-2"
                style={
                  msg.role === 'user'
                    ? {
                        backgroundColor: user_message_color || undefined,
                        color: user_message_color && isLightColor(user_message_color) ? '#000' : '#fff',
                      }
                    : {
                        backgroundColor: bot_message_color || undefined,
                        color: bot_message_color && isLightColor(bot_message_color) ? '#000' : '#fff',
                      }
                }
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              {renderBotAvatar()}
              <div
                className="rounded-lg px-4 py-2"
                style={{ backgroundColor: bot_message_color || 'hsl(var(--muted))' }}
              >
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: bot_message_color && isLightColor(bot_message_color) ? '#666' : '#ccc', animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: bot_message_color && isLightColor(bot_message_color) ? '#666' : '#ccc', animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: bot_message_color && isLightColor(bot_message_color) ? '#666' : '#ccc', animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={input_placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            style={{ backgroundColor: bubble_color }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {privacy_policy_url && (
          <div className="text-center mt-2">
            <a
              href={privacy_policy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:underline"
            >
              {privacy_policy_name}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
