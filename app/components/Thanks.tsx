import { cn } from '@/app/lib/utils'
import Image from 'next/image'

interface Props {
  businessCountry: string
}

function Thanks ({ businessCountry }: Props) {
  return (
    <div className={cn('w-full min-h-screen items-center flex justify-center bg-qik shadow z-10')}>
      <Image
        src={businessCountry === 'US'
          ? '/thanks-en.webp'
          : businessCountry === 'CA'
            ? '/thanks-fr.webp'
            : '/thanks.webp'}
        alt={
          businessCountry === 'US'
            ? 'Remember to ask the waiter for your courtesy.'
            : businessCountry === 'CA'
              ? "N'oubliez pas de demander votre courtoisie au serveur"
              : '¡Recuerda pedir tu cortesía al mesero!'
        }
        className='h-auto max-w-sm px-4 md:px-0'
        width={2251}
        height={2126}
      />
    </div>
  )
}

export default Thanks
