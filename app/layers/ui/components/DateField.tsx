import React from "react";
import { FormField } from "../types/wizardTypes";
import { Form } from "antd";

interface DateFieldProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
}

const DateField: React.FC<DateFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {field.label?.trim()}
      </span>

      <Form.Item
        name={field.id}
        required={field.required}
        rules={[{ required: field.required, message: "Selecciona una fecha" }]}
      >
        <input
          type="date"
          id={field.id}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Form.Item>
    </div>
  );
};

export default DateField;
