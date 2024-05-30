'use client'

import Image from "next/image"
import { DSC_SOLUTIONS_ID } from "@/app/constants/general"


function Footer() {
  const searchParams = new URLSearchParams(document.location.search)

  const businessId = searchParams.get('id')
  const isDscSolutions = businessId === DSC_SOLUTIONS_ID
  return (
    <footer className='py-4 flex justify-center items-center border-t'>
      <div className='flex justify-center items-center space-x-1 sm:space-x-2'>
        <a
          href='https://qikstarts.com/' target='_blank' rel='noopener noreferrer'
        >
          <Image
            src='/qikstarts.png'
            alt='Qik starts'
            width={220}
            height={127}
          />
        </a>
        {
          isDscSolutions && (
            <Image
              src='/dsc-solutions.webp'
              alt='DSC Solutions'
              width={113}
              height={110}
            />
          )
        }
      </div>
    </footer>
  )
}

export default Footer
