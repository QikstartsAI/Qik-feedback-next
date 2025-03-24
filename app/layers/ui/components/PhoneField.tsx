import { Form } from "antd";
import { FormField } from "../types/wizardTypes";
import CheckboxField from "./CheckboxField";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface TextFieldProps {
  field: FormField;
  value?: string;
  checked?: boolean;
  onChange?: (value: any, fieldId?: string) => void;
}

const PhoneField: React.FC<TextFieldProps> = ({
  field,
  value,
  checked,
  onChange,
}) => {
  return (
    <div className="relative mb-3">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {field.label?.trim()}
      </span>
      <Form.Item
        name={field.id}
        rules={[
          {
            required: field.required,
            message: "Por favor ingrese su teléfono",
          },
        ]}
      >
        <PhoneInput
          id={field.id}
          placeholder="(XXX)-XXX-XXXX"
          defaultCountry="EC"
          value={value}
          onChange={(value) => onChange && onChange(value, field.id)}
          required={field.required}
          limitMaxLength
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Form.Item>
      <CheckboxField
        field={{
          id: "checkWhatsApp",
          defaultValue: true,
          label: "Acepto recibir promociones por WhatsApp",
        }}
        value={checked}
        onChange={(checked) => onChange && onChange(checked, "checkWhatsApp")}
      />
    </div>
  );
};

export default PhoneField;
