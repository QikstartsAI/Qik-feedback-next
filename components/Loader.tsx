import Image from "next/image"

interface LoaderProps {
  message?: string;
}

function Loader({ message = "Cargando..." }: LoaderProps) {
  return (
    <div className='grid place-items-center min-h-[92vh] bg-gradient-to-b from-purple-100 via-blue-50 to-white'>
      <div className="text-center space-y-4">
        <Image
          src='/qik.svg'
          className='w-40 sm:w-44 animate-pulse'
          alt='QikStarts'
          width={155}
          height={62}
          priority={true}
        />
        <p className="text-gray-600 text-sm animate-pulse">{message}</p>
      </div>
    </div>
  )
}

export default Loader
