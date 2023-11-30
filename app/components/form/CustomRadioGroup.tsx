import { FormControl, FormItem, FormLabel } from '../ui/Form'
import { cn } from '@/app/lib/utils'
import { RadioGroupItem } from '../ui/RadioGroup'
import { TablerIconsProps } from '@tabler/icons-react'
import React from 'react'

type Items = {
    value: string;
    label: string;
    icon?: (props: TablerIconsProps) => React.JSX.Element;
}

type CustomRadioGrouprops = {
  value: string;
  items: Items[];
}

function CustomRadioGroup ({ items, value }: CustomRadioGrouprops) {
  return (
    <ul className='grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-2 text-sm font-medium text-gray-900'>
      {items.map(({ icon: Icon, label, value: itemValue }) => (
        <li
          key={itemValue}
          className={cn('flex justify-center items-center w-full bg-white border border-gray-200 rounded-lg py-1 sm:py-2 cursor-pointer shadowhover:border-sky-500 hover:text-sky-500 transition-all', {
            'border-sky-500 text-sky-500': value === itemValue
          })}
        >
          <FormItem className='flex flex-col items-center space-y-0'>
            <FormControl>
              <RadioGroupItem
                value={itemValue}
                className='sr-only'
              />
            </FormControl>
            <FormLabel
              className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1', {
                'text-sky-500': value === itemValue
              })}
            >
              {Icon !== undefined && typeof Icon === 'function' && <Icon />}
              <p className='w-full text-[10px] sm:text-[11px]'>{label}</p>
            </FormLabel>
          </FormItem>
        </li>
      ))}
    </ul>
  )
}

export default CustomRadioGroup
