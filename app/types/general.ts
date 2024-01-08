import { TablerIconsProps } from "@tabler/icons-react";

export interface SelectedOption {
  value: string,
  label: string,
  icon: (props: TablerIconsProps) => JSX.Element
}