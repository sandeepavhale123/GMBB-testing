import React from 'react';
import { Bot, Send, X } from 'lucide-react';
import { EmbedSettings } from '../../types';

interface AppearancePreviewProps {
  settings: EmbedSettings;
  botName: string;
}

export const AppearancePreview: React.FC<AppearancePreviewProps> = ({ settings, botName }) => {
  const displayName = settings.display_name || botName;
  const borderRadius = `${settings.border_radius || 12}px`;
  
  return (
    <div className="sticky top-6">
      <p className="text-sm text-muted-foreground mb-3 text-center">Live Preview</p>
      <div 
        className="w-[320px] h-[480px] bg-background border shadow-xl flex flex-col overflow-hidden mx-auto"
        style={{ borderRadius }}
      >
        {/* Header */}
        <div 
          className="px-4 py-3 flex items-center justify-between text-white"
          style={{ 
            backgroundColor: settings.header_color || settings.bubble_color,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            fontFamily: settings.font_family || 'system-ui'
          }}
        >
          <div className="flex items-center gap-2">
            {settings.show_bot_avatar && (
              settings.bot_avatar_url ? (
                <img 
                  src={settings.bot_avatar_url} 
                  alt="Bot" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              )
            )}
            <span className="font-medium">{displayName}</span>
          </div>
          <button className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 p-4 space-y-3 overflow-auto bg-muted/30"
          style={{ fontFamily: settings.font_family || 'system-ui' }}
        >
          {/* Bot message */}
          <div className="flex items-start gap-2">
            {settings.show_bot_avatar && (
              settings.bot_avatar_url ? (
                <img 
                  src={settings.bot_avatar_url} 
                  alt="Bot" 
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: settings.header_color || settings.bubble_color }}
                >
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )
            )}
            <div 
              className="px-3 py-2 max-w-[80%] text-sm"
              style={{ 
                backgroundColor: settings.bot_message_color || '#F3F4F6',
                borderRadius: `${Math.max(4, parseInt(settings.border_radius || '12') - 4)}px`,
                color: isLightColor(settings.bot_message_color || '#F3F4F6') ? '#111' : '#fff'
              }}
            >
              {settings.welcome_message || 'Hi! How can I help you?'}
            </div>
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div 
              className="px-3 py-2 max-w-[80%] text-sm text-white"
              style={{ 
                backgroundColor: settings.user_message_color || settings.bubble_color,
                borderRadius: `${Math.max(4, parseInt(settings.border_radius || '12') - 4)}px`
              }}
            >
              I have a question about your services
            </div>
          </div>

          {/* Bot response */}
          <div className="flex items-start gap-2">
            {settings.show_bot_avatar && (
              settings.bot_avatar_url ? (
                <img 
                  src={settings.bot_avatar_url} 
                  alt="Bot" 
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: settings.header_color || settings.bubble_color }}
                >
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )
            )}
            <div 
              className="px-3 py-2 max-w-[80%] text-sm"
              style={{ 
                backgroundColor: settings.bot_message_color || '#F3F4F6',
                borderRadius: `${Math.max(4, parseInt(settings.border_radius || '12') - 4)}px`,
                color: isLightColor(settings.bot_message_color || '#F3F4F6') ? '#111' : '#fff'
              }}
            >
              Of course! I'd be happy to help. What would you like to know?
            </div>
          </div>
        </div>

        {/* Input */}
        <div 
          className="border-t bg-background"
          style={{ 
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            fontFamily: settings.font_family || 'system-ui'
          }}
        >
          <div className="p-3">
            <div className="flex items-center gap-2">
              <input 
                type="text"
                placeholder={settings.input_placeholder || 'Type your message...'}
                disabled
                className="flex-1 px-3 py-2 text-sm border rounded-lg bg-muted/50"
                style={{ borderRadius: `${Math.max(4, parseInt(settings.border_radius || '12') - 4)}px` }}
              />
              <button 
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: settings.header_color || settings.bubble_color }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Privacy Policy Link */}
          {settings.privacy_policy_url && (
            <div className="pb-2 text-center">
              <a 
                href={settings.privacy_policy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: settings.header_color || settings.bubble_color }}
              >
                {settings.privacy_policy_name || 'Privacy Policy'}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bubble preview */}
      <div className="mt-4 flex justify-center">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
          style={{ backgroundColor: settings.bubble_color }}
        >
          <Bot className="w-6 h-6" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">Widget Bubble</p>
    </div>
  );
};

// Helper to determine if color is light
function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
