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

type StartsRatingGroupProps = {
  value: string;
  items: Items[];
  variant: "hooters" | "gus"
};

function StartsRatingGroup({ items, value, className, variant }: StartsRatingGroupProps & HTMLAttributes<HTMLDivElement>) {
  const selectedValue = parseInt(value);
  const textStyleColor = `text-${variant}`
  const fillStyleColor = `fill-${variant}`

  return (
    <ul className={cn(className, 'grid gap-1 sm:gap-2 text-sm font-medium text-gray-900 pb-3')}>
      {items.map(({ icon: Icon, label, value: itemValue }, index) => (
        <FormItem
          className='flex flex-col items-center space-y-0'
          key={itemValue}>
          <FormControl>
            <RadioGroupItem value={itemValue} className='sr-only' />
          </FormControl>
          <FormLabel
            className={cn(
              "text-center font-normal w-full flex flex-col items-center cursor-pointer space-y-1 text-gray-300 transition-all",
              selectedValue >= index + 1 ? textStyleColor : 'text-gray-300'
            )}>
            {Icon !== undefined && <Icon 
              className={cn(
                "w-10 h-10 md:w-12 md:h-12",
                selectedValue >= index + 1 ? fillStyleColor : 'fill-gray-300'
              )}
            />}
            <small className={'text-question font-medium'}>{label}</small>
          </FormLabel>
        </FormItem>
      ))}
    </ul>
  );
}

export default StartsRatingGroup;
