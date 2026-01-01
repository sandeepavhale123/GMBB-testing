import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BotWizardProvider, useBotWizard } from '../context/BotWizardContext';
import { StepIndicator } from '../components/wizard/StepIndicator';
import { MobileStepIndicator } from '../components/wizard/MobileStepIndicator';
import { Step1Intent } from '../components/wizard/Step1Intent';
import { Step2Instructions } from '../components/wizard/Step2Instructions';
import { Step3Knowledge } from '../components/wizard/Step3Knowledge';
import { ChatPreview } from '../components/preview/ChatPreview';
import { useBot } from '../hooks/useBot';
import { useFileUpload } from '../hooks/useFileUpload';
import { useCompanyInfo } from '../hooks/useCompanyInfo';
import { WizardStep } from '../types';
import { toast } from 'sonner';

const BotWizardContent: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    formData, 
    isStepComplete, 
    queuedFiles, 
    clearQueuedFiles,
    isEditMode,
    editBotId,
    isLoadingBot,
  } = useBotWizard();
  const { createBot, updateBot, loading } = useBot();
  const { uploadFileForBot } = useFileUpload();
  const { hasCompanyInfoContent, saveCompanyInfoWithEmbedding } = useCompanyInfo();
  const [isUploading, setIsUploading] = useState(false);

  const steps: WizardStep[] = useMemo(
    () => [
      { number: 1, title: 'Select Intent', completed: isStepComplete(1) },
      { number: 2, title: 'Configure Bot', completed: isStepComplete(2) },
      { number: 3, title: 'Add Knowledge', completed: currentStep > 3 },
    ],
    [currentStep, isStepComplete]
  );

  const handleSaveBot = async (status: 'draft' | 'published') => {
    let bot;
    
    if (isEditMode && editBotId) {
      // Update existing bot
      bot = await updateBot(editBotId, { ...formData, status } as any);
    } else {
      // Create new bot
      bot = await createBot(formData, status);
    }
    
    if (!bot) return;

    // Save company info if provided
    if (formData.companyInfo && hasCompanyInfoContent(formData.companyInfo)) {
      toast.info('Saving company information...');
      const companyResult = await saveCompanyInfoWithEmbedding(formData.companyInfo, bot.id);
      if (companyResult) {
        toast.success('Company information saved and queued for embedding');
      } else {
        toast.error('Failed to save company information');
      }
    }

    // Upload queued files after bot is created/updated
    if (queuedFiles.length > 0) {
      setIsUploading(true);
      toast.info(`Uploading ${queuedFiles.length} file(s)...`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const queuedFile of queuedFiles) {
        try {
          const result = await uploadFileForBot(queuedFile.file, bot.id);
          if (result) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error('File upload error:', error);
          failCount++;
        }
      }
      
      setIsUploading(false);
      clearQueuedFiles();
      
      if (successCount > 0) {
        toast.success(`${successCount} file(s) uploaded successfully`);
        toast.info('Vector embedding in progress. Check Sources tab for status.', { duration: 5000 });
      }
      if (failCount > 0) {
        toast.error(`${failCount} file(s) failed to upload`);
      }
    }

    navigate(`/detail/${bot.id}`);
  };

  const handleSaveDraft = () => handleSaveBot('draft');
  const handlePublish = () => handleSaveBot('published');

  const renderCurrentStep = () => {
    // Show loading state while fetching bot data in edit mode
    if (isLoadingBot) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading bot data...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <Step1Intent />;
      case 2:
        return <Step2Instructions />;
      case 3:
        return <Step3Knowledge />;
      default:
        return <Step1Intent />;
    }
  };

  const isSaving = loading || isUploading;

  return (
    <div className="min-h-screen bg-background">
      <MobileStepIndicator steps={steps} currentStep={currentStep} />
      <div className="flex">
        <StepIndicator steps={steps} currentStep={currentStep} />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            {isEditMode && formData.name && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm text-muted-foreground">Editing Bot</p>
                <p className="font-semibold">{formData.name}</p>
              </div>
            )}
            
            {renderCurrentStep()}
            
            {currentStep === 3 && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
                  {isUploading ? 'Uploading...' : 'Save as Draft'}
                </Button>
                <Button onClick={handlePublish} disabled={isSaving || !isStepComplete(2)}>
                  {isSaving ? 'Saving...' : isEditMode ? 'Update Bot' : 'Publish Bot'}
                </Button>
              </div>
            )}
          </div>

          {currentStep >= 2 && !isLoadingBot && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="h-[400px]">
                <ChatPreview />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BotWizard: React.FC = () => {
  return (
    <BotWizardProvider>
      <BotWizardContent />
    </BotWizardProvider>
  );
};

export default BotWizard;
