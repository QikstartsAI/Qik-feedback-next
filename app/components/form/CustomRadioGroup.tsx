import { FormControl, FormItem, FormLabel } from "../ui/Form";
import { cn } from "@/app/lib/utils";
import { RadioGroupItem } from "../ui/RadioGroup";
import { TablerIconsProps } from "@tabler/icons-react";
import React, { HTMLAttributes } from "react";

type Items = {
  value: string;
  label: string;
  icon?: (props: TablerIconsProps) => React.JSX.Element;
};

type CustomRadioGrouprops = {
  value: string;
  items: Items[];
  isHooters?: boolean
};

function CustomRadioGroup({ items, value, className, isHooters }: CustomRadioGrouprops & HTMLAttributes<HTMLDivElement>) {
  return (
    <ul className={cn(className, 'grid grid-cols-4 gap-1 sm:gap-2 text-sm font-medium text-gray-900')}>
      {items.map(({ icon: Icon, label, value: itemValue }) => (
        <FormItem
          className='flex flex-col items-center space-y-0'
          key={itemValue}>
          <FormControl>
            <RadioGroupItem value={itemValue} className='sr-only' />
          </FormControl>
          <li
            className={cn(
              `flex justify-center items-center w-full bg-white border border-gray-200 rounded-lg py-1 sm:py-2 cursor-pointer shadow hover:${'border-sky-500' ? !isHooters : 'border-hooters'} hover:${'text-sky-500' ? !isHooters : 'text-hooters'} transition-all`,
              {
                "border-sky-500 text-sky-500": value === itemValue && !isHooters,
                "border-hooters text-hooters": value === itemValue && isHooters,
              }
            )}>
            <FormLabel
              className={cn(
                "text-center w-full font-normal flex flex-col items-center cursor-pointer",
                {
                  "text-sky-500": value === itemValue && !isHooters,
                  "text-hooters": value === itemValue && isHooters,
                }
              )}>
              {Icon !== undefined && typeof Icon === "function" && <Icon />}
              <p className='w-full text-[10px] sm:text-[11px]'>{label}</p>
            </FormLabel>
          </li>
        </FormItem>
      ))}
    </ul>
  );
}

export default CustomRadioGroup;
