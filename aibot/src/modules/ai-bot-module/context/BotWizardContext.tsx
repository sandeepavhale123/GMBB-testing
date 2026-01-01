import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  BotIntent, 
  BotWizardFormData, 
  KnowledgeSource, 
  QAPair, 
  INTENT_TEMPLATES, 
  SystemTemplate,
  CompanyInfo,
  EMPTY_COMPANY_INFO,
  DEFAULT_USER_MESSAGE_TEMPLATE,
  DEFAULT_EMBED_SETTINGS,
  EmbedSettings,
} from '../types';
import { Json } from '@/integrations/supabase/types';

export interface QueuedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface ExistingSource {
  id: string;
  source_type: string;
  title: string;
  file_name: string | null;
  char_count: number;
  status: string;
}

interface BotWizardContextType {
  currentStep: number;
  formData: BotWizardFormData;
  queuedFiles: QueuedFile[];
  isEditMode: boolean;
  editBotId: string | null;
  isLoadingBot: boolean;
  existingSources: ExistingSource[];
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<BotWizardFormData>) => void;
  selectIntent: (intent: BotIntent) => void;
  selectTemplate: (template: SystemTemplate) => void;
  addKnowledgeSource: (source: Partial<KnowledgeSource>) => void;
  removeKnowledgeSource: (index: number) => void;
  updateKnowledgeSource: (index: number, source: Partial<KnowledgeSource>) => void;
  addQAPair: (pair: Partial<QAPair>) => void;
  removeQAPair: (index: number) => void;
  updateQAPair: (index: number, pair: Partial<QAPair>) => void;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  resetWizard: () => void;
  getTotalCharCount: () => number;
  isStepComplete: (step: number) => boolean;
  // Embed security methods
  addAllowedDomain: (domain: string) => void;
  removeAllowedDomain: (index: number) => void;
  updateApiKeys: (openaiKey?: string, geminiKey?: string) => void;
  // Queued files methods
  addQueuedFile: (file: File) => void;
  removeQueuedFile: (fileId: string) => void;
  clearQueuedFiles: () => void;
}

const initialFormData: BotWizardFormData = {
  name: '',
  intent: null,
  systemPrompt: '',
  userMessageTemplate: DEFAULT_USER_MESSAGE_TEMPLATE,
  modelProvider: 'openai',
  modelName: 'gpt-4o-mini',
  knowledgeSources: [],
  qaPairs: [],
  companyInfo: EMPTY_COMPANY_INFO,
  // RAG configuration defaults
  temperature: 0.3,
  maxTokens: 1024,
  fallbackMessage: "I apologize, but I don't have specific information about that in my knowledge base. Please contact us directly for assistance.",
  // Embed security defaults
  allowedDomains: [],
  isPublic: true,
  embedSettings: DEFAULT_EMBED_SETTINGS,
};

// Parse embed settings from Json to EmbedSettings type
function parseEmbedSettings(json: Json | null): EmbedSettings {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return DEFAULT_EMBED_SETTINGS;
  }
  const obj = json as Record<string, unknown>;
  return {
    bubble_position: (obj.bubble_position as 'bottom-right' | 'bottom-left') || DEFAULT_EMBED_SETTINGS.bubble_position,
    bubble_color: (obj.bubble_color as string) || DEFAULT_EMBED_SETTINGS.bubble_color,
    welcome_message: (obj.welcome_message as string) || DEFAULT_EMBED_SETTINGS.welcome_message,
    chat_height: (obj.chat_height as string) || DEFAULT_EMBED_SETTINGS.chat_height,
    chat_width: (obj.chat_width as string) || DEFAULT_EMBED_SETTINGS.chat_width,
  };
}

const BotWizardContext = createContext<BotWizardContextType | null>(null);

export const BotWizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { botId } = useParams<{ botId?: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BotWizardFormData>(initialFormData);
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [isLoadingBot, setIsLoadingBot] = useState(false);
  const [existingSources, setExistingSources] = useState<ExistingSource[]>([]);

  const isEditMode = Boolean(botId);
  const editBotId = botId || null;

  // Load existing bot data when in edit mode
  useEffect(() => {
    if (!botId) return;

    const loadBot = async () => {
      setIsLoadingBot(true);
      try {
        // Fetch bot data
        const { data: bot, error: botError } = await supabase
          .from('ab_bots')
          .select('*')
          .eq('id', botId)
          .single();

        if (botError) throw botError;

        // Fetch knowledge sources
        const { data: sources } = await supabase
          .from('ab_knowledge_sources')
          .select('*')
          .eq('bot_id', botId);

        // Store existing sources for display
        if (sources) {
          setExistingSources(sources.map(s => ({
            id: s.id,
            source_type: s.source_type,
            title: s.title,
            file_name: s.file_name,
            char_count: s.char_count,
            status: s.status,
          })));
        }

        // Fetch company info
        const { data: companyInfo } = await supabase
          .from('ab_company_info')
          .select('*')
          .eq('bot_id', botId)
          .maybeSingle();

        // Populate form data
        setFormData({
          name: bot.name || '',
          intent: bot.intent as BotIntent,
          systemPrompt: bot.system_prompt || '',
          userMessageTemplate: bot.user_message_template || DEFAULT_USER_MESSAGE_TEMPLATE,
          modelProvider: bot.model_provider as 'openai' | 'gemini',
          modelName: bot.model_name || 'gpt-4o-mini',
          knowledgeSources: (sources || []).map(s => ({
            id: s.id,
            source_type: s.source_type as KnowledgeSource['source_type'],
            title: s.title,
            content: s.content || null,
            url: s.url || null,
            file_url: s.file_url || null,
            file_name: s.file_name || null,
            char_count: s.char_count,
            status: s.status as KnowledgeSource['status'],
            error_message: s.error_message || null,
            metadata: s.metadata || {},
          })),
          qaPairs: [],
          companyInfo: companyInfo ? {
            company_name: companyInfo.company_name || '',
            company_profile: companyInfo.company_profile || '',
            industry: companyInfo.industry || '',
            website: companyInfo.website || '',
            email: companyInfo.email || '',
            phone_number: companyInfo.phone_number || '',
            company_address: companyInfo.company_address || '',
            business_hours: companyInfo.business_hours || '',
            service_description: companyInfo.service_description || '',
            product_description: companyInfo.product_description || '',
            contact_person: companyInfo.contact_person || '',
            established_date: companyInfo.established_date || '',
            social_media_links: companyInfo.social_media_links || '',
            logo_url: companyInfo.logo_url || '',
          } : EMPTY_COMPANY_INFO,
          temperature: bot.temperature ?? 0.3,
          maxTokens: bot.max_tokens ?? 1024,
          fallbackMessage: bot.fallback_message || initialFormData.fallbackMessage,
          allowedDomains: bot.allowed_domains || [],
          isPublic: bot.is_public ?? false,
          embedSettings: parseEmbedSettings(bot.embed_settings),
        });

        // Start at step 2 in edit mode (skip intent selection)
        setCurrentStep(2);
      } catch (err) {
        console.error('Failed to load bot for editing:', err);
      } finally {
        setIsLoadingBot(false);
      }
    };

    loadBot();
  }, [botId]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // Now 4 steps with settings
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const setStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const updateFormData = useCallback((data: Partial<BotWizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const selectIntent = useCallback((intent: BotIntent) => {
    const template = INTENT_TEMPLATES[intent];
    setFormData((prev) => ({
      ...prev,
      intent,
      name: template.name,
      systemPrompt: template.prompt,
      userMessageTemplate: template.userMessageTemplate,
    }));
  }, []);

  const selectTemplate = useCallback((template: SystemTemplate) => {
    setFormData((prev) => ({
      ...prev,
      intent: 'custom',
      name: template.name,
      systemPrompt: template.systemMessage,
      userMessageTemplate: template.userMessageTemplate,
    }));
  }, []);

  const addKnowledgeSource = useCallback((source: Partial<KnowledgeSource>) => {
    setFormData((prev) => ({
      ...prev,
      knowledgeSources: [...prev.knowledgeSources, source],
    }));
  }, []);

  const removeKnowledgeSource = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      knowledgeSources: prev.knowledgeSources.filter((_, i) => i !== index),
    }));
  }, []);

  const updateKnowledgeSource = useCallback((index: number, source: Partial<KnowledgeSource>) => {
    setFormData((prev) => ({
      ...prev,
      knowledgeSources: prev.knowledgeSources.map((s, i) => (i === index ? { ...s, ...source } : s)),
    }));
  }, []);

  const addQAPair = useCallback((pair: Partial<QAPair>) => {
    setFormData((prev) => ({
      ...prev,
      qaPairs: [...prev.qaPairs, pair],
    }));
  }, []);

  const removeQAPair = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      qaPairs: prev.qaPairs.filter((_, i) => i !== index),
    }));
  }, []);

  const updateQAPair = useCallback((index: number, pair: Partial<QAPair>) => {
    setFormData((prev) => ({
      ...prev,
      qaPairs: prev.qaPairs.map((p, i) => (i === index ? { ...p, ...pair } : p)),
    }));
  }, []);

  const updateCompanyInfo = useCallback((info: Partial<CompanyInfo>) => {
    setFormData((prev) => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...info },
    }));
  }, []);

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setFormData(initialFormData);
    setQueuedFiles([]);
    setExistingSources([]);
  }, []);

  const getTotalCharCount = useCallback(() => {
    let total = 0;
    // Count knowledge sources
    formData.knowledgeSources.forEach((source) => {
      total += source.char_count || 0;
    });
    // Count Q&A pairs
    formData.qaPairs.forEach((pair) => {
      total += (pair.question?.length || 0) + (pair.answer?.length || 0);
    });
    // Count company info
    Object.values(formData.companyInfo).forEach((value) => {
      if (typeof value === 'string') {
        total += value.length;
      }
    });
    return total;
  }, [formData]);

  const isStepComplete = useCallback(
    (step: number) => {
      switch (step) {
        case 1:
          return formData.intent !== null;
        case 2:
          const hasSystemPrompt = formData.systemPrompt.trim().length > 0;
          const hasApiKey = formData.modelProvider === 'openai' 
            ? !!formData.openaiApiKey?.trim() 
            : !!formData.geminiApiKey?.trim();
          return hasSystemPrompt && hasApiKey;
        case 3:
          return true; // Knowledge is optional
        case 4:
          return true; // Settings are optional
        default:
          return false;
      }
    },
    [formData]
  );

  // Embed security methods
  const addAllowedDomain = useCallback((domain: string) => {
    const trimmed = domain.trim().toLowerCase();
    if (trimmed && !formData.allowedDomains.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, trimmed],
      }));
    }
  }, [formData.allowedDomains]);

  const removeAllowedDomain = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter((_, i) => i !== index),
    }));
  }, []);

  const updateApiKeys = useCallback((openaiKey?: string, geminiKey?: string) => {
    setFormData((prev) => ({
      ...prev,
      openaiApiKey: openaiKey,
      geminiApiKey: geminiKey,
    }));
  }, []);

  // Queued files methods
  const addQueuedFile = useCallback((file: File) => {
    const newFile: QueuedFile = {
      id: `${Date.now()}-${file.name}`,
      file,
      name: file.name,
      size: file.size,
    };
    setQueuedFiles((prev) => [...prev, newFile]);
  }, []);

  const removeQueuedFile = useCallback((fileId: string) => {
    setQueuedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const clearQueuedFiles = useCallback(() => {
    setQueuedFiles([]);
  }, []);

  return (
    <BotWizardContext.Provider
      value={{
        currentStep,
        formData,
        queuedFiles,
        isEditMode,
        editBotId,
        isLoadingBot,
        existingSources,
        nextStep,
        prevStep,
        setStep,
        updateFormData,
        selectIntent,
        selectTemplate,
        addKnowledgeSource,
        removeKnowledgeSource,
        updateKnowledgeSource,
        addQAPair,
        removeQAPair,
        updateQAPair,
        updateCompanyInfo,
        resetWizard,
        getTotalCharCount,
        isStepComplete,
        addAllowedDomain,
        removeAllowedDomain,
        updateApiKeys,
        addQueuedFile,
        removeQueuedFile,
        clearQueuedFiles,
      }}
    >
      {children}
    </BotWizardContext.Provider>
  );
};

export const useBotWizard = () => {
  const context = useContext(BotWizardContext);
  if (!context) {
    throw new Error('useBotWizard must be used within a BotWizardProvider');
  }
  return context;
};
