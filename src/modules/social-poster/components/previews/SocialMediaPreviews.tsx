import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FacebookPreview } from "./FacebookPreview";
import { InstagramPreview } from "./InstagramPreview";
import { LinkedInPreview } from "./LinkedInPreview";
import { TwitterPreview } from "./TwitterPreview";
import { ThreadsPreview } from "./ThreadsPreview";
import { MediaItem } from "../../types";

interface SocialMediaPreviewsProps {
  content: string;
  media?: MediaItem[];
  platforms: string[];
}

export const SocialMediaPreviews: React.FC<SocialMediaPreviewsProps> = ({
  content,
  media,
  platforms,
}) => {
  const platformConfig = [
    { id: "facebook", name: "Facebook", component: FacebookPreview },
    { id: "instagram", name: "Instagram", component: InstagramPreview },
    { id: "linkedin", name: "LinkedIn", component: LinkedInPreview },
    { id: "twitter", name: "Twitter", component: TwitterPreview },
    { id: "threads", name: "Threads", component: ThreadsPreview },
  ];

  const enabledPlatforms = platformConfig.filter(platform => 
    platforms.includes(platform.id)
  );

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={enabledPlatforms.map(p => p.id)} className="w-full space-y-2">
        {enabledPlatforms.map(({ id, name, component: PreviewComponent }) => (
          <AccordionItem key={id} value={id} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
              <span className="font-semibold">{name}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <PreviewComponent content={content} media={media} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
