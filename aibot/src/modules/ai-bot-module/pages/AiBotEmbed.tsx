import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MessageCircle, Send, Minimize2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_EMBED_SETTINGS, EmbedSettings, LeadFormSettings, DEFAULT_LEAD_SETTINGS } from '../types';
import { LeadCaptureForm } from '../components/leads/LeadCaptureForm';

// Check if color is light (for text contrast)
function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BotConfig {
  id: string;
  name: string;
  embed_settings: EmbedSettings;
  is_public: boolean;
  owner_id: string | null;
}

interface UserBranding {
  show_powered_by: boolean;
  powered_by_text: string;
  powered_by_url: string;
}

const AiBotEmbed: React.FC = () => {
  const { botId } = useParams<{ botId: string }>();
  const [searchParams] = useSearchParams();
  const embedded = searchParams.get('embedded') === 'true';
  
  const [botConfig, setBotConfig] = React.useState<BotConfig | null>(null);
  const [leadSettings, setLeadSettings] = React.useState<LeadFormSettings | null>(null);
  const [branding, setBranding] = React.useState<UserBranding | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Session ID - persisted in localStorage (must be defined first)
  const [sessionId] = React.useState<string>(() => {
    if (!botId) return crypto.randomUUID();
    const stored = localStorage.getItem(`ai-bot-session-${botId}`);
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem(`ai-bot-session-${botId}`, newId);
    return newId;
  });
  
  // Lead capture state - use localStorage for persistence across sessions
  const [leadId, setLeadId] = React.useState<string | null>(() => {
    if (!botId) return null;
    return localStorage.getItem(`ai-bot-lead-${botId}-${sessionId}`) || null;
  });
  const [leadFormCompleted, setLeadFormCompleted] = React.useState<boolean>(() => {
    if (!botId) return false;
    return localStorage.getItem(`ai-bot-lead-${botId}-${sessionId}`) !== null;
  });
  
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Fetch bot configuration and lead settings
  React.useEffect(() => {
    const fetchBot = async () => {
      if (!botId) return;
      
      // Fetch bot config
      const { data: botData, error: botError } = await supabase
        .from('ab_bots')
        .select('id, name, embed_settings, is_public, owner_id')
        .eq('id', botId)
        .eq('is_public', true)
        .single();
      
      if (botError || !botData) {
        setError('Bot not found or not public');
        return;
      }
      
      const embedSettings = botData.embed_settings as unknown as EmbedSettings;
      setBotConfig({
        ...botData,
        embed_settings: embedSettings || DEFAULT_EMBED_SETTINGS,
      });

      // Fetch user branding if bot has owner
      if (botData.owner_id) {
        const { data: brandingData } = await supabase
          .from('ab_user_branding')
          .select('show_powered_by, powered_by_text, powered_by_url')
          .eq('user_id', botData.owner_id)
          .maybeSingle();
        
        if (brandingData) {
          setBranding(brandingData as UserBranding);
        }
      }

      // Fetch lead settings
      const { data: leadData, error: leadError } = await supabase
        .from('ab_bot_lead_settings')
        .select('*')
        .eq('bot_id', botId)
        .maybeSingle();
      
      if (leadError) {
        console.error('Error fetching lead settings:', leadError);
      }
      
      if (leadData) {
        setLeadSettings(leadData as LeadFormSettings);
      } else {
        setLeadSettings({ ...DEFAULT_LEAD_SETTINGS, bot_id: botId });
      }
      
      // Check localStorage for lead completion (no DB query needed for anon users)
      const storedLeadId = localStorage.getItem(`ai-bot-lead-${botId}-${sessionId}`);
      const isLeadCompleted = storedLeadId !== null;
      
      if (isLeadCompleted && storedLeadId) {
        setLeadId(storedLeadId);
        setLeadFormCompleted(true);
      }
      
      // Add welcome message if lead form not required or already completed
      if (!leadData?.enabled || leadData?.trigger_type !== 'pre_chat' || isLeadCompleted) {
        if (embedSettings?.welcome_message) {
          setMessages([{ role: 'assistant', content: embedSettings.welcome_message }]);
        }
      }
    };
    
    fetchBot();
  }, [botId, sessionId]);

  // postMessage communication with parent window
  React.useEffect(() => {
    if (embedded) {
      window.parent.postMessage({ 
        type: 'ai-bot-resize', 
        open: isOpen,
        botId 
      }, '*');
    }
  }, [isOpen, embedded, botId]);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMinimize = () => {
    setIsOpen(false);
    if (embedded) {
      window.parent.postMessage({ type: 'ai-bot-minimize', botId }, '*');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !botId || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-bot-chat', {
        body: {
          bot_id: botId,
          message: userMessage,
          session_id: sessionId,
          conversation_history: messages,
          lead_id: leadId,
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

  const handleLeadFormSubmit = (submittedLeadId: string) => {
    setLeadId(submittedLeadId);
    setLeadFormCompleted(true);
    // Persist lead completion to localStorage
    if (botId) {
      localStorage.setItem(`ai-bot-lead-${botId}-${sessionId}`, submittedLeadId);
    }
    // Show welcome message after form submission
    if (botConfig?.embed_settings?.welcome_message) {
      setMessages([{ role: 'assistant', content: botConfig.embed_settings.welcome_message }]);
    }
  };

  // Determine if we should show the lead form
  const showLeadForm = leadSettings?.enabled && 
    leadSettings?.trigger_type === 'pre_chat' && 
    !leadFormCompleted;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!botConfig || leadSettings === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const embedSettings = botConfig.embed_settings;
  const bubbleColor = embedSettings.bubble_color || '#3B82F6';
  const headerColor = embedSettings.header_color || bubbleColor;
  const displayName = embedSettings.display_name || botConfig.name;
  const userMessageColor = embedSettings.user_message_color || bubbleColor;
  const botMessageColor = embedSettings.bot_message_color || '#F3F4F6';
  const fontFamily = embedSettings.font_family || 'system-ui';
  const borderRadius = embedSettings.border_radius || '12';
  const showBotAvatar = embedSettings.show_bot_avatar !== false;
  const botAvatarUrl = embedSettings.bot_avatar_url;
  const inputPlaceholder = embedSettings.input_placeholder || 'Type your message...';
  const privacyPolicyUrl = embedSettings.privacy_policy_url;
  const privacyPolicyName = embedSettings.privacy_policy_name || 'Privacy Policy';

  const headerTextColor = isLightColor(headerColor) ? '#000000' : '#FFFFFF';
  const userTextColor = isLightColor(userMessageColor) ? '#000000' : '#FFFFFF';
  const botTextColor = isLightColor(botMessageColor) ? '#000000' : '#666666';


  return (
    <div
      className={`flex flex-col bg-background ${
        embedded
          ? 'w-full h-full overflow-hidden'
          : 'h-screen'
      }`}
      style={{
        fontFamily,
        borderRadius: embedded ? `${borderRadius}px` : undefined,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ 
          backgroundColor: headerColor,
          borderTopLeftRadius: embedded ? `${borderRadius}px` : undefined,
          borderTopRightRadius: embedded ? `${borderRadius}px` : undefined,
        }}
      >
        <div className="flex items-center gap-2">
          {showBotAvatar && (
            botAvatarUrl ? (
              <img 
                src={botAvatarUrl} 
                alt={displayName} 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${headerTextColor}20` }}
              >
                <Bot className="h-4 w-4" style={{ color: headerTextColor }} />
              </div>
            )
          )}
          <h3 className="font-semibold" style={{ color: headerTextColor }}>{displayName}</h3>
        </div>
        {embedded && (
          <button
            onClick={handleMinimize}
            style={{ color: `${headerTextColor}CC` }}
            className="hover:opacity-100 opacity-80"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Lead Form or Chat */}
      {showLeadForm && leadSettings ? (
        <LeadCaptureForm
          botId={botId}
          sessionId={sessionId}
          settings={leadSettings}
          bubbleColor={bubbleColor}
          onSubmit={handleLeadFormSubmit}
        />
      ) : (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && showBotAvatar && (
                    <div className="flex-shrink-0 mr-2">
                      {botAvatarUrl ? (
                        <img 
                          src={botAvatarUrl} 
                          alt={displayName} 
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="h-6 w-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: botMessageColor }}
                        >
                          <Bot className="h-3 w-3" style={{ color: botTextColor }} />
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className="max-w-[80%] px-4 py-2"
                    style={{
                      backgroundColor: msg.role === 'user' ? userMessageColor : botMessageColor,
                      color: msg.role === 'user' ? userTextColor : botTextColor,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  {showBotAvatar && (
                    <div className="flex-shrink-0 mr-2">
                      {botAvatarUrl ? (
                        <img 
                          src={botAvatarUrl} 
                          alt={displayName} 
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="h-6 w-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: botMessageColor }}
                        >
                          <Bot className="h-3 w-3" style={{ color: botTextColor }} />
                        </div>
                      )}
                    </div>
                  )}
                  <div 
                    className="px-4 py-2"
                    style={{ 
                      backgroundColor: botMessageColor,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <div className="flex space-x-1" style={{ color: botTextColor }}>
                      <span className="animate-bounce delay-0">●</span>
                      <span className="animate-bounce delay-100">●</span>
                      <span className="animate-bounce delay-200">●</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={inputPlaceholder}
                disabled={isLoading}
                className="flex-1"
                style={{ borderRadius: `${borderRadius}px` }}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                style={{ backgroundColor: bubbleColor, borderRadius: `${borderRadius}px` }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {privacyPolicyUrl && (
              <div className="mt-2 text-center">
                <a 
                  href={privacyPolicyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {privacyPolicyName}
                </a>
              </div>
            )}
            {/* Powered By Footer */}
            {(branding?.show_powered_by ?? true) && (
              <div className="mt-2 pt-2 border-t border-border text-center">
                <a 
                  href={branding?.powered_by_url || 'https://gmbbriefcase.com'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {branding?.powered_by_text || 'Powered by GMBBriefcase'}
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AiBotEmbed;
