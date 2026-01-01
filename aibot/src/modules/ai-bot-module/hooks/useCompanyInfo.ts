import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyInfo, EMPTY_COMPANY_INFO } from '../types';
import { toast } from 'sonner';

export const useCompanyInfo = (botId?: string) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(EMPTY_COMPANY_INFO);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCompanyInfo = useCallback(async () => {
    if (!botId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ab_company_info')
        .select('*')
        .eq('bot_id', botId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company info:', error);
        return;
      }

      if (data) {
        setCompanyInfo({
          id: data.id,
          bot_id: data.bot_id,
          company_name: data.company_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          contact_person: data.contact_person || '',
          company_address: data.company_address || '',
          logo_url: data.logo_url || '',
          company_profile: data.company_profile || '',
          established_date: data.established_date || '',
          industry: data.industry || '',
          product_description: data.product_description || '',
          service_description: data.service_description || '',
          website: data.website || '',
          business_hours: data.business_hours || '',
          social_media_links: data.social_media_links || '',
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    } finally {
      setIsLoading(false);
    }
  }, [botId]);

  const saveCompanyInfo = useCallback(async (info: CompanyInfo, targetBotId?: string) => {
    const actualBotId = targetBotId || botId;
    if (!actualBotId) {
      toast.error('Bot ID is required');
      return null;
    }

    setIsSaving(true);
    try {
      const payload = {
        bot_id: actualBotId,
        company_name: info.company_name,
        email: info.email,
        phone_number: info.phone_number,
        contact_person: info.contact_person,
        company_address: info.company_address,
        logo_url: info.logo_url,
        company_profile: info.company_profile,
        established_date: info.established_date,
        industry: info.industry,
        product_description: info.product_description,
        service_description: info.service_description,
        website: info.website,
        business_hours: info.business_hours,
        social_media_links: info.social_media_links,
      };

      // Upsert - insert or update
      const { data, error } = await supabase
        .from('ab_company_info')
        .upsert(payload, { onConflict: 'bot_id' })
        .select()
        .single();

      if (error) {
        console.error('Error saving company info:', error);
        toast.error('Failed to save company info');
        return null;
      }

      setCompanyInfo(prev => ({ ...prev, ...data }));
      return data;
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Failed to save company info');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [botId]);

  const updateField = useCallback((field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  // Convert company info to text for embedding
  const companyInfoToText = useCallback((info: CompanyInfo): string => {
    const lines: string[] = [];
    
    if (info.company_name) lines.push(`Company Name: ${info.company_name}`);
    if (info.email) lines.push(`Email: ${info.email}`);
    if (info.phone_number) lines.push(`Phone Number: ${info.phone_number}`);
    if (info.contact_person) lines.push(`Contact Person: ${info.contact_person}`);
    if (info.company_address) lines.push(`Company Address: ${info.company_address}`);
    if (info.website) lines.push(`Website: ${info.website}`);
    if (info.industry) lines.push(`Industry: ${info.industry}`);
    if (info.established_date) lines.push(`Established Date: ${info.established_date}`);
    if (info.business_hours) lines.push(`Business Hours: ${info.business_hours}`);
    if (info.social_media_links) lines.push(`Social Media: ${info.social_media_links}`);
    if (info.company_profile) lines.push(`\nCompany Profile:\n${info.company_profile}`);
    if (info.product_description) lines.push(`\nProducts:\n${info.product_description}`);
    if (info.service_description) lines.push(`\nServices:\n${info.service_description}`);
    
    return lines.join('\n');
  }, []);

  // Check if company info has any meaningful content
  const hasCompanyInfoContent = useCallback((info: CompanyInfo): boolean => {
    return !!(
      info.company_name ||
      info.email ||
      info.phone_number ||
      info.contact_person ||
      info.company_address ||
      info.company_profile ||
      info.product_description ||
      info.service_description ||
      info.website ||
      info.industry ||
      info.business_hours
    );
  }, []);

  // Save company info and create/update knowledge source for embedding
  const saveCompanyInfoWithEmbedding = useCallback(async (info: CompanyInfo, targetBotId: string): Promise<boolean> => {
    try {
      // 1. Save to ab_company_info table
      const savedInfo = await saveCompanyInfo(info, targetBotId);
      if (!savedInfo) return false;

      // 2. Convert to text for embedding
      const companyText = companyInfoToText(info);
      if (!companyText.trim()) return true; // No content to embed

      // 3. Check if company_info knowledge source exists
      const { data: existingSource } = await supabase
        .from('ab_knowledge_sources')
        .select('id')
        .eq('bot_id', targetBotId)
        .eq('source_type', 'company_info')
        .maybeSingle();

      let sourceId: string;

      if (existingSource) {
        // Update existing source
        const { error: updateError } = await supabase
          .from('ab_knowledge_sources')
          .update({
            content: companyText,
            char_count: companyText.length,
            status: 'pending',
            title: info.company_name || 'Company Information',
          })
          .eq('id', existingSource.id);

        if (updateError) throw updateError;
        sourceId = existingSource.id;
      } else {
        // Create new source
        const { data: newSource, error: insertError } = await supabase
          .from('ab_knowledge_sources')
          .insert({
            bot_id: targetBotId,
            source_type: 'company_info',
            title: info.company_name || 'Company Information',
            content: companyText,
            char_count: companyText.length,
            status: 'pending',
          })
          .select()
          .single();

        if (insertError) throw insertError;
        sourceId = newSource.id;
      }

      // 4. Trigger embedding via edge function
      console.log('Calling ai-bot-process-knowledge with:', { 
        knowledge_source_id: sourceId, 
        bot_id: targetBotId,
        source_type: 'company_info' 
      });
      
      const { error: processError } = await supabase.functions.invoke('ai-bot-process-knowledge', {
        body: { 
          knowledge_source_id: sourceId,
          bot_id: targetBotId,
          source_type: 'company_info',
          content: companyText,
        },
      });

      if (processError) {
        console.error('Error processing company info embedding:', processError);
        // Update status to failed
        await supabase
          .from('ab_knowledge_sources')
          .update({ status: 'failed', error_message: processError.message })
          .eq('id', sourceId);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving company info with embedding:', error);
      return false;
    }
  }, [saveCompanyInfo, companyInfoToText]);

  return {
    companyInfo,
    setCompanyInfo,
    isLoading,
    isSaving,
    fetchCompanyInfo,
    saveCompanyInfo,
    updateField,
    companyInfoToText,
    hasCompanyInfoContent,
    saveCompanyInfoWithEmbedding,
  };
};
