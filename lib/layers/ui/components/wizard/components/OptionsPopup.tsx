import { cn } from "@/lib/lib/utils";
import { useEffect, useRef } from "react";
import { Option } from "../../../types/wizardTypes";
import { useTranslation } from "react-i18next";

interface OptionsPopupProps {
  show: boolean;
  onClose: () => void;
  onSelect: (fieldId: string, option: Option) => void;
  options: Record<string, Option[]>;
  responses: Record<string, any>;
  brandColor?: string;
}

export const OptionsPopup: React.FC<OptionsPopupProps> = ({
  show,
  onClose,
  onSelect,
  options,
  responses,
  brandColor,
}) => {
  const { t } = useTranslation("common");

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={popupRef}
        className="!text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full"
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{
            color: brandColor ? brandColor : "#058FFF",
          }}
        >
          Selecciona una opción
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.values(options)[0].map((option) => (
            <button
              key={option.id}
              className={cn(
                "border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition",
                {
                  "text-white":
                    responses[Object.keys(options)[0]] === option.id,
                }
              )}
              style={{
                color:
                  responses[Object.keys(options)[0]] === option.id && brandColor
                    ? "#ffffff"
                    : undefined,
                backgroundColor:
                  responses[Object.keys(options)[0]] === option.id && brandColor
                    ? brandColor
                    : undefined,
              }}
              onClick={() => {
                onSelect(Object.keys(options)[0], option);
                onClose();
              }}
            >
              {t(option.label ?? "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
