import React from "react";
import { Form } from "antd";
import cn from "classnames";
import { FormField, Option } from "../types/wizardTypes";
import { useTranslation } from "react-i18next";

interface ChipsFieldProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
  brandColor?: string;
}

const ChipsField: React.FC<ChipsFieldProps> = ({
  field,
  value,
  onChange,
  brandColor,
}) => {
  const { t } = useTranslation("common");

  const isOptionSelected = (id?: string): boolean =>
    (field.options
      ?.find((option) => option.id === id)
      ?.options?.some((opt) => opt.id === value) ??
      false) ||
    value == id;

  return (
    <div className="mt-4 flex flex-col">
      <span
        className="font-bold text-[24px] text-center "
        style={{
          color: brandColor || "#058FFF",
        }}
      >
        {t(field.title?.trim() ?? "")}
      </span>

      <Form.Item
        name={field.id}
        required={field.required}
        rules={[
          {
            required: field.required,
            message: t("chipsField.validation.required"),
          },
        ]}
      >
        <div className="mt-4 flex gap-3 justify-center items-center flex-wrap">
          {field.options?.map((option) => (
            <button
              key={option.id}
              className={cn(
                "border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition",
                {
                  [`text-white ${
                    value
                      ? `bg-[${brandColor}] border-[${brandColor}]`
                      : "bg-qik border-qik"
                  }`]: isOptionSelected(option.id),
                }
              )}
              style={{
                color:
                  isOptionSelected(option.id) && brandColor
                    ? "#ffffff"
                    : undefined,
                backgroundColor:
                  isOptionSelected(option.id) && brandColor
                    ? brandColor
                    : undefined,
              }}
              onClick={() => onChange && onChange(option.id)}
            >
              {t(option.label ?? "")}
            </button>
          ))}
        </div>
      </Form.Item>
    </div>
  );
};

export default ChipsField;
