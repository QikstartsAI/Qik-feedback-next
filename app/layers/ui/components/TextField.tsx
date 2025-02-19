import React from "react";
import { Form } from "antd";
import { FormField } from "../types/wizardTypes";

interface TextFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {field.label?.trim()}
      </span>
      <Form.Item
        name={field.id}
        rules={
          field.type === "email"
            ? [
                { required: true, message: "Porfavor Ingrese su email" },
                { type: "email", message: "Email no valido" },
              ]
            : [
                { required: field.required, message: "Ingresa tu nombre" },
                { type: "string", message: "Nombre no valido" },
              ]
        }
        required={field.required}
      >
        <input
          type="text"
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

export default TextField;
