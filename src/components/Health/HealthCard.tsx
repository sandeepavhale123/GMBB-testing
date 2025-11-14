import React from "react";
import { Card, CardContent } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface HealthCardProps {
  title: string;
  value: string;
  subtitle: string;
  bgColor: string;
  icon: LucideIcon;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  title,
  value,
  subtitle,
  bgColor,
  icon: Icon,
}) => {
  const isRating = title === "Rating"; // Check if this card is for the rating
  const review = title === "Reviews" || title === "Q&A";

  let formattedValue = value;
  if (isRating) {
    const [number] = value.split("/");
    const rating = parseFloat(number);
    formattedValue = isNaN(rating) ? value : `${rating.toFixed(1)}`; // Format to one decimal place
  }

  return (
    <Card className={bgColor}>
      <CardContent className="p-4">
        <div className="flex justify-end">
          <Icon className="size-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-semibold text-white mb-1 mt-6">
            {isRating ? (
              <>{formattedValue.split(" / ")[0]}</>
            ) : review ? (
              <>
                {value.split("/")[1].trim()}
                <span className="text-sm"> / {value.split("/")[0]}</span>
              </>
            ) : (
              formattedValue
            )}
          </div>
          <h3 className="text-xs text-white mt-2">{subtitle}</h3>
        </div>
      </CardContent>
    </Card>
  );
};
