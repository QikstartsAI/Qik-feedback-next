import React from "react";
import { FormField } from "../types/wizardTypes";
import { Form } from "antd";
import { useTranslation } from "react-i18next";

interface DateFieldProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
}

const DateField: React.FC<DateFieldProps> = ({ field, value, onChange }) => {
  const { t } = useTranslation("common");

  return (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {t(field.label?.trim() ?? "")}
      </span>

      <Form.Item
        name={field.id}
        required={field.required}
        rules={[
          {
            required: field.required,
            message: t("dateField.validation.required"),
          },
        ]}
      >
        <input
          type="date"
          id={field.id}
          placeholder={t(field.placeholder ?? "")}
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
