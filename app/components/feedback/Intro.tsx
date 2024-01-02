import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Business } from '@/app/types/business';
import ImageRounded from '../ui/ImageRounded';

type IntroProps = {
  business: Business | null
  toggleStartTest: () => void
}

function Intro({ business, toggleStartTest }: IntroProps) {
  const country = business?.Country || 'EC'
  const waiter = business?.Waiter
  const isUsCountry = country === 'US'
  const isCaCountry = country === 'CA'

  return (
<div className='mx-auto py-12 lg:py-24 max-w-xl px-6'>
<Card>
          <CardHeader>
            <CardTitle className='text-center' >
              {
              isUsCountry
                ? 'We value your opinion 😊, it will take you less than '
                : isCaCountry
                  ? 'Nous apprécions votre avis 😊, cela vous prendra moins de '
                  : 'Valoramos tu opinión 😊, te tomará menos de '
            }
              <span className='text-sky-500 font-medium'>
                {
                isUsCountry
                  ? '1 minute'
                  : isCaCountry
                    ? '1 minute'
                    : '1 minuto'
              }
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
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
            <div className='flex flex-row justify-center items-center space-x-4 mt-4'>
              <Button
                onClick={toggleStartTest}
              >
                {
                isUsCountry
                  ? 'New client'
                  : isCaCountry
                    ? 'Nouveau client'
                    : 'Nuevo cliente'
              }
              </Button>
              <Button variant='secondary' onClick={toggleStartTest} >
                {
                isUsCountry
                  ? 'I am already a client'
                  : isCaCountry
                    ? 'Je suis déjà client'
                    : 'Ya soy cliente'
              }
              </Button>
            </div>
          </CardContent>
          </Card>
    </div>
  )
}

export default Intro