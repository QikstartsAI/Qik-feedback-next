import React from "react";
import { Form } from "antd";
import cn from "classnames";
import { FormField } from "../types/wizardTypes";

interface ChipsFieldProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
}

const ChipsField: React.FC<ChipsFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="mt-4 flex flex-col">
      <span className="font-bold text-[24px] text-center text-qik">
        {field.title?.trim()}
      </span>
      <Form.Item
        name={field.id}
        required={field.required}
        rules={[{ required: field.required, message: "Selecciona una opción" }]}
      >
        <div className="mt-4 flex gap-3 justify-center items-center flex-wrap">
          {field.options?.map((option) => (
            <button
              key={option.id}
              className={cn(
                "border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-qik hover:border-qik transition",
                {
                  "bg-qik text-white border-qik": value == option.id,
                }
              )}
              onClick={() => onChange && onChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Form.Item>
    </div>
  );
};

export default ChipsField;
