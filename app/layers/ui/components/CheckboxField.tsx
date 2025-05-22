import React, { ReactNode } from "react";
import { FormField } from "../types/wizardTypes";
import { useTranslation } from "react-i18next";
import { cn } from "@/app/lib/utils";

interface CheckboxFieldProps {
  field: FormField;
  children?: ReactNode;
  value?: boolean;
  onChange?: (checked: boolean) => void;
  brandColor?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  onChange,
  value,
  brandColor,
  children,
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={field.id}
        required={field.required}
        checked={value}
        defaultChecked={field.defaultValue}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        className="hidden w-5 h-5 border border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
      />
      <div
        className="flex justify-center items-center w-5 h-5 border border-gray-400 rounded focus:ring-2 focus:ring-blue-400 bg-[#000000] transition"
        style={{
          backgroundColor: value ? brandColor ?? "#058FFF" : "transparent",
        }}
        onClick={onChange ? (_) => onChange(!value) : undefined}
      >
        <svg
          className={`w-3.5 h-3.5 text-white ${value ? "block" : "hidden"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
        </svg>
      </div>

      <label
        htmlFor={field.id}
        className="ml-3 text-gray-700 font-medium cursor-pointer"
        onClick={onChange ? (_) => onChange(!value) : undefined}
      >
        {children ?? t(field.label?.trim() ?? "")}
      </label>
    </div>
  );
};

export default CheckboxField;
