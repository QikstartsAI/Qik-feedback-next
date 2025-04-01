import CheckboxField from "../../CheckboxField";
import ChipsField from "../../ChipsField";
import DateField from "../../DateField";
import PhoneField from "../../PhoneField";
import RateField from "../../RateField";
import TextField from "../../TextField";

interface FormFieldRendererProps {
  field: any;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
}) => {
  switch (field.type) {
    case "phone":
      return (
        <PhoneField
          field={field}
          value={value}
          onChange={(fieldId, checked) =>
            onChange(fieldId ?? field.id, checked)
          }
        />
      );
    case "checkbox":
      return (
        <CheckboxField
          field={field}
          value={value}
          onChange={(checked) => onChange(field.id, checked)}
        />
      );
    case "date":
      return (
        <DateField
          field={field}
          value={value}
          onChange={(value) => onChange(field.id, value)}
        />
      );
    case "chips":
      return (
        <ChipsField
          field={field}
          value={value}
          onChange={(value) => onChange(field.id, value)}
        />
      );
    case "rate":
      return (
        <RateField
          field={field}
          value={value}
          onChange={(value) => onChange(field.id, value)}
        />
      );
    default:
      return (
        <TextField
          field={field}
          value={value}
          onChange={(value) => onChange(field.id, value)}
        />
      );
  }
};
