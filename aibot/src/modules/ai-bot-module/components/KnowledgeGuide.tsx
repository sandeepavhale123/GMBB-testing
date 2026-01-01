import React, { useState } from 'react';
import { BookOpen, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const KNOWLEDGE_TEMPLATE = `## About Us

Citation Builder Pro offers different white label services for agencies that help rank local businesses higher in Google Maps and local search results.
Founded: 2012
Location: Aurangabad (Chhatrapati Sambhaji Nagar), India
Website: https://citationbuilderpro.com
Contact email: sales@citationbuilderpro.com
Contact Number: +919822298988

***

## Our Services

### Local Citation Service

Useful for every small and medium business that wants better local visibility in 50+ countries.

- One-time pricing with no recurring fee for standard packs. (50 / 100 / 200 citations)
- Option to order monthly builds, such as 10 or 20 citations per month, up to a maximum of 200 total citations per location. (good for steady growth).
- 100% manual submissions, including rich media (logo, photos, video, social links) wherever supported.
- Full white label report at the end of each order with all login details, live URLs, and status for agencies.
- Supported for more than 50 countries including USA, UK, Canada, Australia, India, Germany, UAE and many more.


### Local Citation Audit & Cleanup

Helps agencies fix messy existing listings before scaling citations.

- Deep audit to find existing, inconsistent, incomplete, and duplicate citations.
- Cleanup of incorrect NAP data and handling of duplicates where possible (suppress or correct).


### GMB Optimization Service

Designed to improve rankings and conversions from Google Maps and Google Business Profiles.

- Full GMB audit, category optimization, services and description updates, media optimization, and posting plan.
- Especially useful for **multi-location** brands needing consistent optimization across cities and countries.`;

export const KnowledgeGuide: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(KNOWLEDGE_TEMPLATE);
      setCopied(true);
      toast.success('Template copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy template');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Format Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Knowledge File Format Guide
          </DialogTitle>
          <DialogDescription>
            Structure your knowledge files using this format for best AI performance
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Template
              </>
            )}
          </Button>
        </div>
        
        <ScrollArea className="h-[50vh] rounded-md border p-4 bg-muted/30">
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {KNOWLEDGE_TEMPLATE}
          </pre>
        </ScrollArea>
        
        <div className="text-sm text-muted-foreground mt-2 space-y-1">
          <p><strong>Why this format works:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Headers (##) help the AI understand topic boundaries</li>
            <li>Q&A pairs are recognized and kept together</li>
            <li>Bullet points are easy to extract and match</li>
            <li>Redundancy ensures key info is always found</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
