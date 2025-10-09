import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { submitSitemaps, autoSelectPages } from '@/services/liveSeoFixer';
import { toast } from 'sonner';

const sitemapSchema = z.object({
  selectionMode: z.enum(['auto', 'manual'], {
    required_error: 'Please select a page selection mode',
  }),
  sitemaps: z.array(z.object({
    url: z.string().url('Please enter a valid sitemap URL')
  }))
    .min(1, 'At least one sitemap is required')
    .max(2, 'Maximum 2 sitemaps allowed'),
});

type SitemapForm = z.infer<typeof sitemapSchema>;

interface SitemapConfigModalProps {
  projectId: string;
  trigger?: React.ReactNode;
}

export const SitemapConfigModal: React.FC<SitemapConfigModalProps> = ({
  projectId,
  trigger
}) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  // Auto-select mutation
  const autoSelectMutation = useMutation({
    mutationFn: (sitemapUrls: string[]) => autoSelectPages(projectId, sitemapUrls, 20),
    onSuccess: (data) => {
      toast.success(`Auto-selected ${data.data.selected_pages.length} pages based on priority!`);
      // Navigate directly to page selection with pre-selected pages
      navigate(`/module/live-seo-fixer/projects/${projectId}/page-selection?audit_id=${data.data.audit_id}&mode=auto`);
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to auto-select pages');
    },
  });

  // Manual select mutation
  const submitSitemapMutation = useMutation({
    mutationFn: (sitemapUrls: string[]) => submitSitemaps(projectId, sitemapUrls),
    onSuccess: (data) => {
      toast.success(`Sitemaps processed successfully!`);
      // Navigate to page selection with audit ID
      navigate(`/module/live-seo-fixer/projects/${projectId}/page-selection?audit_id=${data.data.audit_id}&mode=manual`);
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to process sitemaps');
    },
  });
  
  const form = useForm<SitemapForm>({
    resolver: zodResolver(sitemapSchema),
    defaultValues: {
      selectionMode: 'auto',
      sitemaps: [{ url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sitemaps',
  });

  const onSubmit = async (data: SitemapForm) => {
    const sitemapUrls = data.sitemaps.map(sitemap => sitemap.url);
    
    if (data.selectionMode === 'auto') {
      autoSelectMutation.mutate(sitemapUrls);
    } else {
      submitSitemapMutation.mutate(sitemapUrls);
    }
  };

  const addSitemap = () => {
    if (fields.length < 2) {
      append({ url: '' });
    }
  };

  const removeSitemap = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>Start Audit</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Configure Sitemap URLs</DialogTitle>
          <DialogDescription>
            Provide up to 2 sitemap URLs to discover pages for SEO audit. 
            We'll extract all pages and let you select which ones to analyze.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Selection Mode */}
              <FormField
                control={form.control}
                name="selectionMode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Page Selection Mode</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent">
                          <FormControl>
                            <RadioGroupItem value="auto" />
                          </FormControl>
                          <div className="flex-1">
                            <Label className="font-medium">Auto Select (Recommended)</Label>
                            <p className="text-sm text-muted-foreground">
                              System automatically selects up to 20 pages based on sitemap priority
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent">
                          <FormControl>
                            <RadioGroupItem value="manual" />
                          </FormControl>
                          <div className="flex-1">
                            <Label className="font-medium">Manual Select</Label>
                            <p className="text-sm text-muted-foreground">
                              You choose which pages to audit (up to 20 pages)
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`sitemaps.${index}.url`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>
                          Sitemap URL {index + 1}
                          {index > 0 && ' (Optional)'}
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl className="flex-1">
                            <Input 
                              placeholder="https://example.com/sitemap.xml" 
                              {...inputField} 
                            />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSitemap(index)}
                              className="px-3"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {fields.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSitemap}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Another Sitemap
                </Button>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• We'll fetch and analyze your sitemaps</li>
                  <li>• {form.watch('selectionMode') === 'auto' ? 'System will auto-select up to 20 pages by priority' : 'You can select up to 20 pages for SEO audit'}</li>
                  <li>• Set page types and target keywords for each page</li>
                  <li>• Our system will scrape and audit the selected pages</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitSitemapMutation.isPending || autoSelectMutation.isPending}>
                  {(submitSitemapMutation.isPending || autoSelectMutation.isPending) ? 'Processing...' : 'Continue to Page Selection'}
                </Button>
              </div>
            </form>
          </Form>
      </DialogContent>
    </Dialog>
  );
};