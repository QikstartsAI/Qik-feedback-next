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
        priority={true}
      />
      <div className="relative bg-gray-900 bg-opacity-75 flex items-center">
        <div className="px-4 md:px-12 flex items-center space-x-8">
          <Image
            src={business?.Icono || ''}
            className='lg:w-32 md:w-24 sm:w-18 animate-in h-auto'
            alt={business?.Name || 'Icono del negocio'}
            width={160}
            height={90}
            loading='eager'
          />
          <div>
            <h2 className='font-sans lg:text-2xl sm:text-3xl font-bold tracking-tight text-white'>
              {business?.Name}
            </h2>
            <p className='max-w-xl text-xs sm:text-base text-white/80'>
              <IconMapPin className='w-4 h-4 sm:w-6 sm:h-6 inline-block'/>{' '}
              {business?.Address}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero