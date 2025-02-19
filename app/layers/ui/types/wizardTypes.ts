export interface FormField {
  id?: string;
  label?: string;
  type?: string;
  title?: string;
  defaultValue?: any;
  placeholder?: string;
  required?: boolean;
  max?: string;
  text?: string;
  options?: Option[];
}

export interface Option {
  id?: string;
  label?: string;
  text?: string;
  popupTitle?: string;
  buttonImageUrl?: string;
  options?: Option[];
}
