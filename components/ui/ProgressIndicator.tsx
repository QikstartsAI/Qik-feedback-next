import React from "react";
import { Progress } from "./progress";

interface ProgressIndicatorProps {
  progress: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Main Progress Bar */}
      <div className="w-full space-y-2">
        <Progress
          value={progress}
          className={`h-2 ${progress === 100 ? "bg-green-100" : ""}`}
        />
        <div className="text-xs text-gray-500 text-center">
          {progress === 100 ? (
            <span className="text-green-600 font-medium">
              ¡Formulario completado!
            </span>
          ) : (
            `${Math.round(progress)}% completado`
          )}
        </div>
      </div>
    </div>
  );
};
