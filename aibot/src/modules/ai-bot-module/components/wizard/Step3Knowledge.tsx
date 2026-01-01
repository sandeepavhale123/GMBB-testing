import React, { useState } from 'react';
import { Globe, FileText, MessageCircle, Building2, Trash2, Upload, File, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBotWizard } from '../../context/BotWizardContext';
import { KnowledgeSourceType } from '../../types';
import { CompanyInfoForm } from './CompanyInfoForm';
import { KnowledgeGuide } from '../KnowledgeGuide';

export const Step3Knowledge: React.FC = () => {
  const { 
    formData, 
    prevStep, 
    getTotalCharCount,
    updateCompanyInfo,
    // Use context for queued files
    queuedFiles,
    addQueuedFile,
    removeQueuedFile,
    isEditMode,
    existingSources,
  } = useBotWizard();
  const [activeTab, setActiveTab] = useState<KnowledgeSourceType>('file');

  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;
    
    Array.from(fileList).forEach(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return; // Skip invalid files
      }
      if (file.size > MAX_FILE_SIZE) {
        return; // Skip large files
      }
      addQueuedFile(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const totalCharCount = getTotalCharCount();
  const maxChars = 500000;
  const charPercentage = Math.min((totalCharCount / maxChars) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Knowledge Sources</h2>
          <p className="text-muted-foreground mt-1">
            Train your bot with relevant information. This is optional - you can add sources later.
          </p>
        </div>
        <KnowledgeGuide />
      </div>

      {/* Character count indicator */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Training Data Usage</span>
            <span className="text-sm text-muted-foreground">
              {totalCharCount.toLocaleString()} / {maxChars.toLocaleString()} characters
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${charPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Existing Sources Section - Only shown in edit mode */}
      {isEditMode && existingSources.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Existing Sources ({existingSources.length})
            </CardTitle>
            <CardDescription>
              These sources are already saved and trained. Adding new sources will be combined with these.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {existingSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {source.source_type === 'file' && <FileText className="w-4 h-4 text-muted-foreground" />}
                  {source.source_type === 'website' && <Globe className="w-4 h-4 text-muted-foreground" />}
                  {source.source_type === 'qa' && <MessageCircle className="w-4 h-4 text-muted-foreground" />}
                  {source.source_type === 'company_info' && <Building2 className="w-4 h-4 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">{source.title || source.file_name || 'Untitled'}</p>
                    <p className="text-xs text-muted-foreground">
                      {source.char_count?.toLocaleString() || 0} chars • {source.source_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {source.status === 'completed' && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Trained
                    </span>
                  )}
                  {source.status === 'pending' && (
                    <span className="text-xs text-yellow-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                  {source.status === 'error' && (
                    <span className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Error
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as KnowledgeSourceType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Files</span>
          </TabsTrigger>
          <TabsTrigger value="company_info" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Files</CardTitle>
              <CardDescription>
                Upload documents to train your bot. Supported: .txt, .pdf, .doc, .docx (max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or
                </p>
                <label>
                  <input
                    type="file"
                    multiple
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>

              {queuedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Queued files ({queuedFiles.length})</p>
                  {queuedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <File className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQueuedFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Files will be uploaded and processed after the bot is saved.
              </p>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="company_info" className="space-y-4 mt-4">
          <CompanyInfoForm
            companyInfo={formData.companyInfo}
            onChange={(field, value) => updateCompanyInfo({ [field]: value })}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <div className="flex gap-2">
          {/* Save/Publish handled by parent */}
        </div>
      </div>
    </div>
  );
};
