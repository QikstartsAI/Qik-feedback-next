import React, { useEffect, useState } from 'react'

import { cn } from '../lib/utils'
import { Button } from './ui/Button'

import Image from 'next/image'
import { Branch } from '../types/business'
import {
  IconCircle,
  IconCircleCheck,
  IconLocation,
  IconPinned,
} from '@tabler/icons-react'
const RequestLocationDialog = ({
  view = 'grantPermissions',
  branches = [],
  open = false,
  getLocation,
  denyLocation,
  onConfirm,
}: {
  branches?: (Branch | undefined)[]
  open?: boolean
  view?: string
  getLocation: () => void
  denyLocation: () => void
  onConfirm: (branch: Branch | undefined) => void
}) => {
  const [currentView, setCurrentView] = React.useState('grantPermissions')

  useEffect(() => {
    setCurrentView(view)
  }, [view])

  const goToSuggestedView = () => {
    setCurrentView('suggestedLocations')
  }

  const handleOnDeny = () => {
    denyLocation()
    goToSuggestedView()
  }

  const handleOnGrant = async () => {
    getLocation()
    goToSuggestedView()
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 h-[0px] w-screen flex flex-col justify-between items-center gap-10 bg-white transition-all ease-in-out duration-[2000ms]  overflow-hidden',
        { 'h-screen': open },
        { 'p-10': open }
      )}>
      {currentView == 'grantPermissions' && (
        <>
          <div className='grow'></div>

          <Image
            src={'/location.svg'}
            alt={'Permisos de ubicación'}
            className='animate-bounce delay-[2000ms]'
            width={120}
            height={120}
          />

          <div className='flex flex-col items-center gap-3'>
            <h2 className='font-bold text-[1.5rem] text-sky-500 text-center'>
              Mejora tu experiencia
            </h2>
            <p className='text-center text-sky-900'>
              Inicia compartiendo tu ubicación
            </p>
          </div>
          <div className='grow'></div>
          <div className='flex flex-col gap-3 w-full'>
            <Button onClick={handleOnGrant} className='w-full' type='button'>
              Compartir ubicación
            </Button>
            <Button
              onClick={handleOnDeny}
              className='w-full'
              type='button'
              variant={'secondary'}>
              Tal vez después
            </Button>
          </div>
        </>
      )}
      {currentView == 'suggestedLocations' && (
        <SuggestedLocations branches={branches} onConfirm={onConfirm} />
      )}
    </div>
  )
}

const SuggestedLocations = ({
  branches,
  onConfirm,
}: {
  toggleView?: () => void
  onConfirm: (branch: Branch | undefined) => void
  branches: (Branch | undefined)[]
}) => {
  const getNormalizedBusinessName = (name: string | undefined) => {
    if (!name) {
      return ''
    }
    return name.toLocaleLowerCase().split(' ').join('-')
  }

  const [selected, setSelected] = useState<string>()

  useEffect(() => {
    if (branches.length == 0) return
    setSelected(getNormalizedBusinessName(branches[0]?.Name))
  }, [branches])

  const handleClickSelected = (branchName: string | undefined) => {
    setSelected(getNormalizedBusinessName(branchName))
  }
  return (
    <div className='flex flex-col w-full h-full justify-between items-center '>
      <div className='grow'></div>
      <div className='flex flex-col items-center gap-3'>
        <Image
          src={'/location.svg'}
          alt={'Permisos de ubicación'}
          className='animate-bounce delay-[2000ms]'
          width={120}
          height={120}
        />
        <h2 className='font-bold text-[1.5rem] text-sky-500 text-center'>
          ¿Dónde te encuentras?
        </h2>
        <p className='text-center text-sky-900 mb-3'>
          Selecciona en qué sucursal estás
        </p>
      </div>
      <div className='grow'></div>

      <div className='flex flex-col gap-3 w-full overflow-y-scroll'>
        {branches.map((branch, idx) => {
          return (
            <div
              onClick={() => handleClickSelected(branch?.Name)}
              className='flex items-center gap-4 border py-2 px-3 rounded-lg cursor-pointer focus:ring'
              key={idx}>
              {selected == getNormalizedBusinessName(branch?.Name ?? '') ? (
                <span>
                  <IconCircleCheck
                    size={18}
                    strokeWidth={3}
                    className='text-qik'
                  />
                </span>
              ) : (
                <span>
                  <IconCircle size={18} />
                </span>
              )}
              <div className='flex flex-col'>
                <h4 className='text-qik text-[1rem] font-bold'>
                  {branch?.Name}
                </h4>
                <div className='flex items-center gap-1'>
                  <span>
                    <IconPinned size={10} />
                  </span>
                  <p className='text-sky-900 text-[0.7rem] font-light'>
                    {branch?.Address}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className='flex flex-col gap-3 w-full mt-10'>
        <Button
          onClick={() =>
            onConfirm(
              branches.find(
                (branch) => getNormalizedBusinessName(branch?.Name) === selected
              )
            )
          }
          className='w-full'
          type='button'>
          ¡Aquí estoy!
        </Button>
      </div>
    </div>
  )
}

export default RequestLocationDialog
