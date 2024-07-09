import { Customer } from "@/app/types/customer"
import Image from "next/image"
import { Button } from "../../ui/Button"
import { giftData } from "@/app/constants/loyalty/qik-birthday"
import { GiftData } from "@/app/types/loyalty"
import { useEffect, useState } from "react"
import loyaltyService from "@/app/services/loyaltyService"
import { QIK_CUMPLE_SUBCOLLECTION_NAME } from "@/app/constants/general"

interface Props {
  customerData: Customer | null
  businessIcon: string
  businessSelectedGifts: string[] | null
  businessId: string | null
}

const CongratulationsBirthday = ({ customerData, businessIcon, businessSelectedGifts, businessId }: Props) => {
  const [selectedOption, setSelectedOption] = useState<GiftData | null>(null)
  const [showRedeemInformation, setShowRedeemInformation] = useState<boolean>(false)
  const [pinText, setPinText] = useState<string>("001QIK")

  const handleGiftClick = (gift: GiftData) => {
    setSelectedOption(gift)
  };
  useEffect(() => {
    if (selectedOption) {
      console.log(selectedOption);
    }
  }, [selectedOption]);

  const handleRedeemGiftClick = () => {
    setShowRedeemInformation(true)
  }

  const handleRedeemPinClick = async () => {
    await loyaltyService.sendBenefitDataRedeem({
      businessId,
      customerData,
      qikLoyaltySubcollection: QIK_CUMPLE_SUBCOLLECTION_NAME
    }, selectedOption, pinText)
  }

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
          {
            !showRedeemInformation && (
              <>
                <h3 className="text-white text-center font-semibold text-xl px-6">
                  PREMIOS Y BENEFICIOS DISPONIBLES HOY PARA TÍ EN TU CUMPLEAÑOS
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  {
                    businessSelectedGifts?.map((value: string, index) => {
                      const indexValue = Number(value)
                      const gift = giftData[indexValue]
                      const starValue = gift.starValue
                      return (
                        <div
                          key={index}
                          className="w-full md:auto lg:auto mb-[2rem] relative"
                          onClick={() => handleGiftClick(gift)}
                        >
                          <div className="mx-auto flex justify-center">
                            <div className={`relative h-28 w-28 rounded-lg cursor-pointer
                        ${selectedOption && selectedOption.id == gift.id ? 'bg-primary' : 'border-white border-[2px]'}`}
                            >
                              <Image
                                className="w-full h-full"
                                src={gift.image}
                                alt={gift.text}
                                layout="fill"
                                objectFit="contain"
                              />
                            </div>
                            {
                              starValue && (
                                <div
                                  className={`absolute text-xl font-bold pl-2 pt-0.5 pr-2 top-[40px] md:top-[40px] md:left-[55px] md:scale-125 ${starValue && parseInt(starValue) > 9
                                    ? `left-[29px] md:left-[60px]`
                                    : `left-[55px]`
                                    } ${selectedOption && selectedOption.id == gift.id ? 'text-white' : 'text-primary'}`}
                                >
                                  {starValue}
                                </div>
                              )
                            }
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                {
                  selectedOption && (
                    <div className="flex justify-center items-center mb-6">
                      <button
                        className="flex flex-row justify-center items-center
                  py-2 px-1 rounded-2xl bg-primary w-3/4"
                        onClick={handleRedeemGiftClick}
                      >
                        <span className="w-2/4 text-center text-white font-bold text-xl">
                          CANJEAR BENEFICIO
                        </span>
                        <Image
                          src="/arrow.svg"
                          alt="Canjear beneficio"
                          width={110}
                          height={110}
                        />
                      </button>
                    </div>
                  )
                }
              </>
            )
          }
          {
            showRedeemInformation && (
              <div className="flex justify-center items-center flex-col w-1/2">
                <p className="text-white text-center font-medium text-xl mb-4">
                Solicita al mesero el PIN de tu beneficio
                </p>
                <p
                  className="border-white border-[2px] rounded-lg text-white w-full
                  text-center text-xl py-1 px-4"
                >
                  {pinText}
                </p>
                <Button
                  className="text-center text-white mt-4 w-full"
                  onClick={handleRedeemPinClick}
                >
                  Canjear
                </Button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CongratulationsBirthday
