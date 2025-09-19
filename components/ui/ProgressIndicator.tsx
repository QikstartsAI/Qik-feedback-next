import React from "react";
import { Progress } from "./progress";

interface ProgressIndicatorProps {
  progress: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
}) => {
  // Calculate color based on progress
  const getProgressColor = (progress: number) => {
    if (progress <= 25) {
      return "bg-red-500";
    } else if (progress <= 50) {
      return "bg-orange-500";
    } else if (progress <= 75) {
      return "bg-yellow-500";
    } else if (progress < 100) {
      return "bg-blue-500";
    } else {
      return "bg-green-500";
    }
  };

  const progressColor = getProgressColor(progress);

  return (
    <div className="w-full space-y-3">
      {/* Main Progress Bar */}
      <div className="w-full space-y-2">
        <Progress value={progress} className={`h-2 [&>div]:${progressColor}`} />
        <div className="text-xs text-gray-500 text-center">
          {progress < 100 && `${Math.round(progress)}% completado`}
        </div>
      </div>
    </div>
  );
};
