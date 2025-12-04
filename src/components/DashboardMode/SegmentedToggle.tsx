import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SegmentedToggleProps {
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
  leftLabel: string;
  rightLabel: string;
  leftTooltip?: string;
  rightTooltip?: string;
}

export const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  isActive,
  onToggle,
  disabled = false,
  leftLabel,
  rightLabel,
  leftTooltip,
  rightTooltip,
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "flex rounded-sm border border-success overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => !disabled && onToggle(false)}
              disabled={disabled}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-all duration-200 ease-in-out",
                !isActive
                  ? "bg-success text-success-foreground scale-[1.02]"
                  : "bg-background text-foreground hover:bg-muted hover:scale-[1.02]",
              )}
            >
              {leftLabel} { !isActive ? "Dashboard" : "" }  
            </button>
          </TooltipTrigger>
          {leftTooltip && (
            <TooltipContent side="bottom" className="text-xs">
              {leftTooltip} 
            </TooltipContent>
          )}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => !disabled && onToggle(true)}
              disabled={disabled}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-success text-success-foreground scale-[1.02]"
                  : "bg-background text-foreground hover:bg-muted hover:scale-[1.02]",
              )}
            >
              {rightLabel} { isActive ? "Dashboard" : "" } 
            </button>
          </TooltipTrigger>
          {rightTooltip && (
            <TooltipContent side="bottom" className="text-xs">
              {rightTooltip}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default SegmentedToggle;
