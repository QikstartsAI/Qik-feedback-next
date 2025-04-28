import React from "react";
import { Form } from "antd";
import { FormField } from "../types/wizardTypes";
import { useTranslation } from "react-i18next";

interface TextFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({ field, value, onChange }) => {
  const { t } = useTranslation("common");

  return (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {t(field.label?.trim() ?? "")}
      </span>
      <Form.Item
        name={field.id}
        rules={
          field.type === "email"
            ? [
                {
                  required: true,
                  message: t("textField.email.validation.required"),
                },
                {
                  type: "email",
                  message: t("textField.email.validation.invalid"),
                },
              ]
            : [
                {
                  required: field.required,
                  message: t("textField.default.validation.required"),
                },
                {
                  type: "string",
                  message: t("textField.default.validation.invalid"),
                },
              ]
        }
        required={field.required}
      >
        <input
          type="text"
          id={field.id}
          placeholder={t(field.placeholder ?? "")}
          required={field.required}
          value={value ?? ""}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Form.Item>
    </div>
  );
};

export default TextField;
