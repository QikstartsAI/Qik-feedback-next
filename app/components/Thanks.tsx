import { cn } from '@/app/lib/utils'
import { ClockIcon, CalendarIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

interface Props {
  businessCountry: string
  businessName: string
  customerName: string
}

function Thanks ({ businessCountry, businessName, customerName }: Props) {
  const date = new Date()
  const currentDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={cn('w-full min-h-screen items-center flex flex-col justify-center bg-qik shadow z-10 gap-4')}>
      <Image
        src={businessCountry === 'US'
          ? '/thanks-en.webp'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? '/thanks-fr.webp'
            : '/thanks.webp'}
        alt={
          businessCountry === 'US'
            ? 'Remember to ask the waiter for your courtesy.'
            : businessCountry === 'CA' || businessCountry === 'FR'
              ? "N'oubliez pas de demander votre courtoisie au serveur"
              : '¡Recuerda pedir tu cortesía al mesero!'
        }
        className='h-auto max-w-sm px-4 md:px-0'
        width={2251}
        height={2126}
      />
      <div className='flex flex-col gap-3'>
        <div>
          <h3 className='text-white font-medium text-2xl text-center'>
            {businessCountry === 'US'
            ? 'Name'
            : businessCountry === 'CA' || businessCountry === 'FR'
              ? 'Nom'
              : 'Nombre'
            }
          </h3>
          <p className='text-white font-medium text-base text-center'>
            {customerName}
          </p>
        </div>
        <div>
          <h3 className='text-white font-medium text-2xl text-center'>
          {businessCountry === 'US'
            ? 'Business branch'
            : businessCountry === 'CA' || businessCountry === 'FR'
              ? "Branche d'activité"
              : 'Sucursal'
          }
          </h3>
          <p className='text-white font-medium text-base text-center'>
            {businessName}
          </p>
        </div>
        <div className='flex flex-row justify-center items-center gap-8'>
          <div className='flex flex-col justify-center items-center gap-1'>
            <CalendarIcon
              className='text-white h-5 w-5'
            />
            <span className='text-white font-medium'>
              {currentDate}
            </span>
          </div>
          <div className='flex flex-col justify-center items-center gap-1'>
            <ClockIcon
              className='text-white h-5 w-5'
            />
            <span className='text-white font-medium'>
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Thanks
