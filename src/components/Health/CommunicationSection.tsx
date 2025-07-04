import React from "react";
import { Card, CardHeader } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { StatusBadge } from "./StatusBadge";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "react-tooltip";
import { CommunicationSection } from "../../types/health";

interface CommunicationSectionProps {
  section: CommunicationSection;
}

export const CommunicationSectionComponent: React.FC<
  CommunicationSectionProps
> = ({ section }) => {
  const groups = Array.isArray(section.items) ? section.items : [section.items];

  return (
    <Card className="bg-white">
      <CardHeader className="bg-blue-400 p-3 text-white text-sm font-semibold">
        <h3>
          {section.title} ({section.percentage}%)
        </h3>
      </CardHeader>

      <Accordion
        type="multiple"
        defaultValue={groups.map((_, index) => `comm-${index}`)}
        className="w-full pt-3 p-3"
      >
        {groups.map((group, groupIndex) => (
          <AccordionItem
            key={groupIndex}
            value={`comm-${groupIndex}`}
            className={groupIndex > 0 ? "pt-3" : ""}
          >
            <AccordionTrigger className="w-full ring-1 ring-blue-400 text-left p-2 bg-white">
              <div className="text-md font-medium text-black ps-2">
                {group.label}
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-white">
              <div className="divide-y divide-gray-100">
                {group.items?.map((item: any, itemIndex: number) => (
                  <React.Fragment key={itemIndex}>
                    <div className="flex items-center justify-between p-2 ring-1 ring-gray-200">
                      <div className="text-sm font-normal ps-2 text-gray-600">
                        {item.label}
                      </div>
                      <div className="flex gap-1">
                        <StatusBadge status={item.status} value={item.value} />
                        <InformationCircleIcon
                          data-tooltip-id={`tooltip-comm-${groupIndex}-${itemIndex}`}
                          data-tooltip-place="top-start"
                          data-tooltip-html={item.tooltip}
                          className="size-6 text-blue-400"
                        />
                        <Tooltip
                          id={`tooltip-comm-${groupIndex}-${itemIndex}`}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};
