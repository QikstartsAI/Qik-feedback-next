import { IconGift } from '@tabler/icons-react';
import React, { useState } from 'react'
import { Button } from '../ui/Button';
import { cn } from '@/app/lib/utils';

type Props = {}

function RewardsApproval({}: Props) {
  const [approved, setApproved] = useState(true)
  return (
    <div className='space-y-2'>
      <div className="flex flex-col items-center">
        <IconGift className='w-10 h-10 text-primary'/>
        <h2 className='text-primary uppercase font-bold text-lg'>Premiamos tu lealtad</h2>
      </div>
      <p className='text-center text-muted-foreground pb-2'>¿Deseas obtener recompensas y sorpresas por tus visitas y consumos?</p>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button" 
          className={cn({
            'scale-105': approved,
            'scale-100 opacity-50': !approved
          })} 
          onClick={() => setApproved(true)}
        >
          Me encantaría!
        </Button>
        <Button 
          type="button" 
          variant='outline'
          onClick={() => setApproved(false)}
        >
          La próxima
        </Button>
      </div>
    </div>
  )
}

export default RewardsApproval