import { Customer } from "@/app/types/customer"
import Image from "next/image"
import { Button } from "../../ui/Button"

interface Props {
  customerData: Customer | null
  businessIcon: string
}

const CongratulationsBirthday = ({ customerData, businessIcon }: Props) => {
  return (
    <div
      className='w-full min-h-screen flex flex-col bg-qik shadow z-10 gap-4
      justify-start items-center'
    >
      <h2 className="text-white text-center font-semibold text-3xl mt-10 mb-4 w-1/3">
        HOLA {customerData?.name.toUpperCase()}
      </h2>
      <h1 className="text-white text-center font-semibold text-4xl mt-2 px-2">
        FELICIDADES POR TU CUMPLEÑOS
      </h1>
      <p className="text-white text-center font-normal text-lg">
        Y lo celebramos juntos en
      </p>
      <Image
        src={businessIcon}
        className='lg:w-32 md:w-24 sm:w-18 animate-in h-auto'
        alt='Icono del negocio'
        width={160}
        height={90}
        loading='eager'
      />
      <div>
        <Button
          variant="default"
        >
          VER BENEFICIOS
        </Button>
      </div>
    </div>
  )
}

export default CongratulationsBirthday
