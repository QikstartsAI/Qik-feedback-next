import { Form } from "antd";
import { FormField } from "../types/wizardTypes";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";

interface TextFieldProps {
  field: FormField;
  value?: string;
  onChange?: (fieldId?: string, value?: any) => void;
}

const PhoneField: React.FC<TextFieldProps> = ({ field, value, onChange }) => {
  const { t } = useTranslation("common");

  return (
    <div className="relative mb-3">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {t(field.label?.trim() ?? "")}
      </span>
      <Form.Item
        name={field.id}
        rules={[
          {
            required: field.required,
            message: t("phoneField.validation.required"),
          },
        ]}
      >
        <PhoneInput
          id={field.id}
          placeholder={t("phoneField.placeholder")}
          defaultCountry="EC"
          value={value}
          onChange={(value) => onChange && onChange(field.id, value)}
          required={field.required}
          limitMaxLength
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Form.Item>
    </div>
  );
};

export default PhoneField;
