import Image from "next/image"

function Footer () {
    return (
      <footer className='py-4 flex justify-center items-center border-t'>
        <div className='flex justify-center items-center space-x-1 sm:space-x-2'>
          <a
            href='https://qikstarts.com/' target='_blank' rel='noopener noreferrer'
          >
            <Image
              src='/qik.svg'
              className='w-10 sm:w-12'
              alt='Qik starts'
              width={155}
              height={62}
            />
          </a>
          <span className='text-xs text-center'>Powered by</span>
          <Image
            src='/google.svg'
            alt='logo google'
            className='w-14 h-6'
            width={56}
            height={24}
            />
        </div>
      </footer>
    )
  }

  export default Footer
