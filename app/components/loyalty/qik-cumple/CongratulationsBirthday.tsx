import { Customer } from "@/app/types/customer"

interface Props {
  customerData: Customer | null
}

const CongratulationsBirthday = ({ customerData }: Props) => {
  return (
    <div
      className='w-full min-h-screen items-center flex flex-col justify-center
      bg-qik shadow z-10 gap-4'
    >
      <h2 className="text-white text-center font-semibold text-5xl">
        Hola {customerData?.name}
      </h2>
    </div>
  )
}

export default CongratulationsBirthday
