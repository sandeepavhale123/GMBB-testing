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
import { HealthSection as HealthSectionType } from "../../types/health";

interface HealthSectionProps {
  section: HealthSectionType;
}

export const HealthSection: React.FC<HealthSectionProps> = ({ section }) => {
  return (
    <Card className="bg-white">
      <CardHeader className="bg-blue-400 p-3 text-white text-sm font-semibold">
        <h3>
          {section.title} ({section.percentage}%)
        </h3>
      </CardHeader>

      <Accordion
        type="multiple"
        defaultValue={section.items.map((_, index) => `item-${index}`)}
        className="w-full pt-3 p-3"
      >
        {section.items.map((category, categoryIndex) => {
          // For sections with multiple categories, group items
          const isGrouped = typeof category === "object" && "items" in category;

          if (isGrouped) {
            return (
              <AccordionItem
                key={categoryIndex}
                value={`item-${categoryIndex}`}
                className={categoryIndex > 0 ? "pt-3" : ""}
              >
                <AccordionTrigger className="w-full ring-1 ring-blue-400 text-left p-2 bg-white">
                  <div className="text-md font-medium text-black ps-2">
                    {category.label}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white">
                  <div className="divide-y divide-gray-100">
                    {(category.items as any[])?.map((item: any, itemIndex: number) => (
                      <React.Fragment key={itemIndex}>
                        <div className="flex items-center justify-between p-2 ring-1 ring-gray-200">
                          <div className="text-sm font-normal ps-2 text-gray-600">
                            {item.label}
                          </div>
                          <div className="flex gap-1">
                            <StatusBadge
                              status={item.status}
                              value={item.value}
                            />
                            <InformationCircleIcon
                              data-tooltip-id={`tooltip-${categoryIndex}-${itemIndex}`}
                              data-tooltip-place="top-start"
                              data-tooltip-html={item.tooltip}
                              className="size-6 text-blue-400"
                            />
                            <Tooltip
                              id={`tooltip-${categoryIndex}-${itemIndex}`}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          }

          // For simple items
          return (
            <div
              key={categoryIndex}
              className="flex items-center justify-between p-2 ring-1 ring-gray-200"
            >
              <div className="text-sm font-normal ps-2 text-gray-400">
                {category.label}
              </div>
              <div className="flex gap-1">
                <StatusBadge status={category.status} value={category.value} />
                <InformationCircleIcon
                  data-tooltip-id={`tooltip-single-${categoryIndex}`}
                  data-tooltip-place="top-start"
                  data-tooltip-html={category.tooltip}
                  className="size-6 text-blue-400"
                />
                <Tooltip id={`tooltip-single-${categoryIndex}`} />
              </div>
            </div>
          );
        })}
      </Accordion>
    </Card>
  );
};
