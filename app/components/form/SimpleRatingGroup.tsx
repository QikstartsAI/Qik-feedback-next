import { FormControl, FormItem, FormLabel } from '../ui/Form'
import { cn } from '@/app/lib/utils'
import { RadioGroupItem } from '../ui/RadioGroup'
import { Ratings } from '@/app/types/feedback'

import Image from 'next/image'

type RatingRadioGroupProps = {
  value: string;
}

function SimpleRatingRadioGroup({ value }: RatingRadioGroupProps) {
  return (
    <ul className='grid grid-cols-4 text-sm font-medium'>
      <li className={cn('py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter  transition-all', {
        ' scale-110 sm:scale-125': value === Ratings.Mal
      })}
      >
        <FormItem className='flex flex-col items-center '>
          <FormControl>
            <RadioGroupItem
              value='1'
              className='sr-only'
            />
          </FormControl>
          <FormLabel
            className={cn('text-center font-normal flex flex-col items-center cursor-pointer space-y-1')}
          >
            <Image
              src='/mal.png'
              alt='Bad'
              className='w-8 h-8 md:w-52 md:h-52'
              width={668}
              height={657}
            />
            <p className='text-2xl font-semibold text-gray-500'>
              Bad
            </p>
          </FormLabel>
        </FormItem>
      </li>
      <li className={cn('py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter  transition-all', {
        ' scale-110 sm:scale-125': value === Ratings.Regular
      })}
      >
        <FormItem className='flex flex-col items-center '>
          <FormControl>
            <RadioGroupItem
              value='2'
              className='sr-only'
            />
          </FormControl>
          <FormLabel
            className={cn('text-center font-normal flex flex-col items-center cursor-pointer space-y-1')}
          >
            <Image
              src='/regular.png'
              alt='Regular'
              className='w-8 h-8 md:w-52 md:h-52'
              width={668}
              height={657}
            />
            <p className='text-2xl font-semibold text-gray-500'>
              Regular
            </p>

          </FormLabel>
        </FormItem>
      </li>
      <li className={cn('py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter  transition-all', {
        ' scale-110 sm:scale-125': value === Ratings.Bueno
      })}
      >
        <FormItem className='flex flex-col items-center '>
          <FormControl>
            <RadioGroupItem
              value='4'
              className='sr-only'
            />
          </FormControl>
          <FormLabel
            className={cn('text-center font-normal flex flex-col items-center cursor-pointer space-y-1')}
          >
            <Image
              src='/bueno.png'
              alt='Good'
              className='w-8 h-8 md:w-52 md:h-52'
              width={668}
              height={657}
            />
            <p className='text-2xl font-semibold text-gray-500'>
              Good
            </p>

          </FormLabel>
        </FormItem>
      </li>
      <li className={cn('py-1 sm:py-2 cursor-pointer hover:scale-110 hover:sm:scale-125 filter  transition-all', {
        ' scale-110 sm:scale-125': value === Ratings.Excelente
      })}
      >
        <FormItem className='flex flex-col items-center '>
          <FormControl>
            <RadioGroupItem
              value='5'
              className='sr-only'
            />
          </FormControl>
          <FormLabel
            className={cn('text-center font-normal flex flex-col items-center cursor-pointer space-y-1')}
          >
            <Image
              src='/excelente.png'
              alt='Excellent'
              className='w-8 h-8 md:w-52 md:h-52'
              width={668}
              height={657}
            />
            <p className='text-2xl font-semibold text-gray-500'>
              Excellent
            </p>
          </FormLabel>
        </FormItem>
      </li>
    </ul>
  )
}

export default SimpleRatingRadioGroup
