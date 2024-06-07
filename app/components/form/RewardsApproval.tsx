import { IconGift } from '@tabler/icons-react';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '../ui/Button';
import { cn } from '@/app/lib/utils';

type Props = {
  handleUserApprovesLoyalty: (value: boolean) => void
  setIsRewardButtonClicked: Dispatch<SetStateAction<boolean>>
}

function RewardsApproval({ handleUserApprovesLoyalty, setIsRewardButtonClicked }: Props) {
  const [acceptButtonIsClicked, setAcceptButtonIsClicked] = useState<boolean>(false)
  const [declineButtonIsClicked, setDeclineButtonIsClicked] = useState<boolean>(false)

  const handleAcceptButtonClick = () => {
    setDeclineButtonIsClicked(false)
    setAcceptButtonIsClicked(true)
    handleUserApprovesLoyalty(true)
    setIsRewardButtonClicked(true)
  }

  const handleDeclineButtonClick = () => {
    setAcceptButtonIsClicked(false)
    setDeclineButtonIsClicked(true)
    handleUserApprovesLoyalty(false)
    setIsRewardButtonClicked(true)
  }

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
          className={cn('scale-105 border', {
            'border-white opacity-90' : acceptButtonIsClicked
          })}
          onClick={handleAcceptButtonClick}
        >
          Me encantaría!
        </Button>
        <Button
          type="button"
          variant='outline'
          className={cn('scale-105 text-muted-foreground', {
            'border-sky-500 text-sky-500' : declineButtonIsClicked
          })}
          onClick={handleDeclineButtonClick}
        >
          La próxima
        </Button>
      </div>
    </div>
  )
}

export default RewardsApproval