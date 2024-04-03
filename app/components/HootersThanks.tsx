import { cn } from '@/app/lib/utils'
import Image from 'next/image'

interface Props {
  businessCountry: string
}

function Thanks ({ businessCountry }: Props) {
  return (
    <div className={'w-full flex flex-col items-center justify-center h-screen bg-hooters'}>
      <Image
        src={'/thanks-icon.png'}
        alt={'¡Gracias por compartir tu experiencia!'}
        className='px-4 md:px-0'
        width={120}
        height={120}
      />

      <Image
        src={'/thanks-text.png'}
        alt={'¡Gracias por compartir tu experiencia!'}
        className='h-auto max-w-sm px-4 md:px-0'
        width={2251}
        height={2126}
      />
    </div>
  )
}

export default Thanks
