import { Customer } from "@/app/types/customer"
import Image from "next/image"
import { Button } from "../../ui/Button"

interface Props {
  customerData: Customer | null
  businessIcon: string
  businessSelectedGifts: string[] | null
}

const CongratulationsBirthday = ({ customerData, businessIcon, businessSelectedGifts }: Props) => {
  return (
    <div className="relative">
      <Image
        src='/birthday-bg.webp'
        className='absolute inset-0 object-cover w-full h-full animate-in'
        alt='cover del negocio'
        width={1914}
        height={548}
        priority={true}
      />
      <div className="relative bg-gray-900 bg-opacity-75 flex items-center">
        <div
          className='w-full min-h-screen flex flex-col shadow z-10 gap-4
      justify-start items-center'
        >
          <h2 className="text-white text-center font-semibold text-xl mt-10 mb-4 w-1/3">
            HOLA {customerData?.name.toUpperCase()}
          </h2>
          <h1 className="text-white text-center font-semibold text-4xl mt-2 px-2">
            FELICIDADES POR TU CUMPLEÑOS
          </h1>
          <p className="text-white text-center font-normal text-base">
            Y lo celebramos juntos en
          </p>
          <Image
            src={businessIcon}
            className='w-24 animate-in h-auto'
            alt='Icono del negocio'
            width={160}
            height={90}
            loading='eager'
          />
          <h3 className="text-white text-center font-semibold text-xl px-6">
            PREMIOS Y BENEFICIOS DISPONIBLES HOY PARA TÍ EN TU CUMPLEAÑOS
          </h3>
          {
            businessSelectedGifts?.map((val, idx) => (
              <p key={idx}>{val}</p>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default CongratulationsBirthday
