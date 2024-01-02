import { Business } from '@/app/types/business'
import { IconMapPin } from '@tabler/icons-react'
import ImageRounded from './ui/ImageRounded'
import Image from 'next/image'

interface HeroProps {
  business: Business | null;
}

function Hero ({ business }: HeroProps) {
  return (
    <div className='relative'>
      <Image
        src={business?.Cover || ''}
        className='absolute inset-0 object-cover w-full h-full animate-in'
        alt='cover del negocio'
        width={1914}
        height={548}
      />
      <div className='relative bg-gray-900 bg-opacity-75'>
        <div className='px-6 md:px-12 flex flex-col items-center justify-center pb-4'>
          <>
            <div className='flex flex-col items-center'>
              <Image
                src={business?.Icono || ''}
                className='w-32 lg:w-40 animate-in'
                alt={business?.Name || 'Icono del negocio'}
                width={160}
                height={90}
                loading='eager'
              />
              <h2 className='font-sans lg:text-2xl sm:text-3xl font-bold tracking-tight text-white'>
                {business?.Name}
              </h2>
            </div>
            <div className='flex flex-col items-center text-white/80 mt-3 max-w-lg'>
              <p className='max-w-xl text-center text-xs sm:text-base'>
                <IconMapPin className='w-4 h-4  sm:w-6 sm:h-6 inline-block' />{' '}
                {business?.Address}
              </p>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}

export default Hero