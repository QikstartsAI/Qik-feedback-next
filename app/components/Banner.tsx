import { cn } from '@/app/lib/utils'
import Image from 'next/image'

interface Props {
  className: string
  businessCountry: string
}

function Banner ({ className, businessCountry }: Props) {
  return (
    <div className={cn('w-full items-center flex justify-center bg-qik shadow z-10', className)}>
      <Image
        src={
          businessCountry === 'US'
            ? '/cortesia-en.gif'
            : businessCountry === 'CA'
              ? '/cortesia-fr.gif'
              : '/cortesia-es.gif'
        }
        alt={
          businessCountry === 'US'
            ? 'Remember to ask the waiter for your courtesy.'
            : businessCountry === 'CA'
              ? "N'oubliez pas de demander votre courtoisie au serveur"
              : '¡Recuerda pedir tu cortesía al mesero!'
        }
        className='h-12 md:h-14'
        width={260}
        height={56}
        loading='eager'
      />
    </div>
  )
}

export default Banner
