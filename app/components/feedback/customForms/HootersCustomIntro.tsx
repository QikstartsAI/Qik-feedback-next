import React from 'react'
import { Button } from '../../ui/Button';
import { Business } from '@/app/types/business';
import ImageRounded from '../../ui/ImageRounded';
import { CustomerRole } from '@/app/types/customer';

type HootersCustomIntroProps = {
  business: Business | null
  toogleCustomerType: (customer: CustomerRole) => void
}

function HootersCustomIntro({ business, toogleCustomerType }: HootersCustomIntroProps) {
  const country = business?.Country || 'EC'
  const waiter = business?.Waiter
  const isUsCountry = country === 'US'
  const isCaCountry = country === 'CA'

  return (
    <div className='mx-auto pt-8 pb-40 lg:py-18 max-w-xl px-6'>
      <h4 className={'text-center font-medium text-colorText'}>
        {
          isUsCountry
            ? 'We value your opinion 😊, it will take you less than '
            : isCaCountry
              ? 'Nous apprécions votre avis 😊, cela vous prendra moins de '
              : 'Valoramos tu opinión 😊, te llevará menos de '
        }
        <span className='text-hooters font-bold'>
          {
            isUsCountry
              ? '1 minute'
              : isCaCountry
                ? '1 minute'
                : '1 minuto'
          }
        </span>
      </h4>

      {
        waiter && (
          <div className='flex flex-col justify-center items-center my-2'>
            {
              waiter.gender === 'masculino' || waiter.gender === 'male' || waiter.gender === 'mâle'
                ? (
                  <ImageRounded imageUrl='/waiter_male.gif' imageAlt='Icono de mesero' />
                )
                : (
                  <ImageRounded imageUrl='/waiter_female.gif' imageAlt='Icono de mesera' />
                )
            }
            <p className='text-center text-sm sm:text-lg pb-1 font-medium'>
              {
                business?.Country === 'US'
                  ? 'Today I attended to you:'
                  : business?.Country === 'CA'
                    ? "Aujourd'hui, je me suis occupé de vous:"
                    : 'Hoy te atendí:'
              }
            </p>
            <p className='text-center text-base sm:text-lg pb-1 font-semibold'>
              {waiter.name}
            </p>
          </div>
        )
      }

      <div className='flex flex-row justify-center items-center space-x-4 my-8'>
        <Button variant={'hootersPrimary'}
          onClick={() => toogleCustomerType("new")}
        >
          {
            isUsCountry
              ? 'New client'
              : isCaCountry
                ? 'Nouveau client'
                : 'Nuevo cliente'
          }
        </Button>
        <Button variant='hootersSecondary' onClick={() => toogleCustomerType("frequent")}>
          {
            isUsCountry
              ? 'I am already a client'
              : isCaCountry
                ? 'Je suis déjà client'
                : 'Ya soy cliente'
          }
        </Button>
      </div>
    </div>
  )
}

export default HootersCustomIntro