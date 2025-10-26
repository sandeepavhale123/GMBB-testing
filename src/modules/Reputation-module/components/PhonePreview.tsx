import React from "react";
import { cn } from "@/lib/utils";

interface PhonePreviewProps {
  channel: "sms" | "email" | "whatsapp";
  content: string;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ channel, content }) => {
  return (
    <div className="relative mx-auto scale-90 sm:scale-100" style={{ width: 380, height: 460 }}>
      {/* Phone frame */}
      <div className="absolute inset-0 border-[12px] border-black rounded-[40px] bg-white overflow-hidden shadow-2xl border-bottom-0 ">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-10" />

        {/* Status bar */}
        <div className="absolute top-2 left-4 right-4 flex justify-between items-center text-xs z-10">
          <span className="text-black">9:41</span>
        </div>

        {/* Content area */}
        <div className="pt-12 px-4 h-full overflow-auto bg-gray-50">
          <div className="mt-4">
            <div
              className={cn(
                "p-4 rounded-2xl max-w-[85%] shadow-sm",
                channel === "sms"
                  ? "bg-blue-500 text-white  rounded-tr-sm"
                  : channel === "whatsapp"
                    ? "bg-green-100 text-black  rounded-tr-sm"
                    : "bg-white border border-gray-200 text-black rounded-tl-sm",
              )}
            >
              <div className="text-sm whitespace-pre-wrap break-words">
                {content.split("Review Link").map((part, index, array) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <span
                        className={cn(
                          "underline font-medium cursor-pointer",
                          channel === "sms" ? "text-white" : channel === "whatsapp" ? "text-blue-600" : "text-blue-600",
                        )}
                      >
                        Review Link
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        {/* <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full" /> */}
      </div>
    </div>
  );
};
