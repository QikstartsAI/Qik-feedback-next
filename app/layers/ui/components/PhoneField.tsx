import { Form } from "antd";
import { FormField } from "../types/wizardTypes";
import CheckboxField from "./CheckboxField";

interface TextFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneField: React.FC<TextFieldProps> = ({ field, value, onChange }) => {
  return (
    <div className="relative">
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
          {
            pattern: /^[0-9]+$/,
            message: "El número de teléfono no es válido",
          },
        ]}
      >
        <input
          type="number"
          id={field.id}
          placeholder={field.placeholder}
          required={field.required}
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        />
      </Form.Item>
      <CheckboxField field={{ id: "checkWhatsApp", defaultValue: true }} />
    </div>
  );
};

export default PhoneField;
