import React from "react";
import { Form, Radio, Image } from "antd";
import cn from "classnames";
import { FormField } from "../types/wizardTypes";

interface RateFieldProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
}

const RateField: React.FC<RateFieldProps> = ({ field, value, onChange }) => {
  return (
    <Form.Item
      name={field.id}
      required={field.required}
      rules={[{ required: field.required, message: "Selecciona una opción" }]}
    >
      <Radio.Group
        value={value}
        className="grid grid-cols-4 text-sm font-medium text-gray-900"
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      >
        {field.options?.map((option) => (
          <Radio
            key={option.id}
            value={option.id}
            className="w-full cursor-pointer hover:scale-110 transition-all"
          >
            <div className="flex flex-col items-center">
              <Image
                src={`/${option.id}.png`}
                alt={`experiencia ${option?.label?.toLowerCase()}`}
                className={cn("w-16 h-16 sm:w-10 sm:h-10", {
                  grayscale: value != option.id,
                })}
                unselectable="on"
                preview={false}
              />
              <p className="text-[10px] sm:text-[11px]">{option.label}</p>
            </div>
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default RateField;
