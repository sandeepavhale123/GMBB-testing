import React from "react";
import { cn } from "@/lib/utils";

interface SegmentedToggleProps {
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
  leftLabel: string;
  rightLabel: string;
}

export const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  isActive,
  onToggle,
  disabled = false,
  leftLabel,
  rightLabel,
}) => {
  return (
    <div
      className={cn(
        "flex rounded-md border border-success overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <button
        type="button"
        onClick={() => !disabled && onToggle(false)}
        disabled={disabled}
        className={cn(
          "px-3 py-1 text-xs font-medium transition-colors",
          !isActive
            ? "bg-success text-success-foreground"
            : "bg-background text-foreground hover:bg-muted"
        )}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => !disabled && onToggle(true)}
        disabled={disabled}
        className={cn(
          "px-3 py-1 text-xs font-medium transition-colors",
          isActive
            ? "bg-success text-success-foreground"
            : "bg-background text-foreground hover:bg-muted"
        )}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default SegmentedToggle;
