import { FormControl, FormItem, FormLabel } from "../ui/Form";
import { cn } from "@/app/lib/utils";
import { RadioGroupItem } from "../ui/RadioGroup";
import { TablerIconsProps } from "@tabler/icons-react";
import React, { HTMLAttributes, useEffect, useState } from "react";

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
  const [variantValue, setVariantValue] = useState<string>('')
  const selectedValue = parseInt(value);

  const textStyle = `text-${variant}`
  const fillStyle = `${variant === 'hooters' ? 'hsl(var(--hooters))' : 'hsl(var(--gus))'}`
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
              selectedValue >= index + 1 ? textStyle : 'text-gray-300'
            )}>
            {Icon !== undefined && <Icon
              className="w-10 h-10 md:w-12 md:h-12"
              fill={`${selectedValue >= index + 1 ? fillStyle : '#d1d5db'}`}
            />}
            <small className={'text-question font-medium'}>{label}</small>
          </FormLabel>
        </FormItem>
      ))}
    </ul>
  );
}

export default StartsRatingGroup;
