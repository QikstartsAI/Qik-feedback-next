import React from "react";
import { FormField } from "../types/wizardTypes";

interface CheckboxFieldProps {
  field: FormField;
  value?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  onChange,
  value,
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={field.id}
        required={field.required}
        checked={value}
        defaultChecked={field.defaultValue}
        onChange={onChange ? (_) => onChange(!value) : undefined}
        className="w-5 h-5 text-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
      />
      <label htmlFor={field.id} className="ml-3 text-gray-700 font-medium">
        {field.label}
      </label>
    </div>
  );
};

export default CheckboxField;
