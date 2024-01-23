interface Props {
  customerFullName: string
  isUsCountry: boolean
  isCaCountry: boolean
  isFrCountry: boolean
}

const getCustomerFirstName = (customerFullName: string) => {
  return customerFullName.split(' ')[0]
}

const GoogleReviewMessage = ({ customerFullName, isUsCountry, isCaCountry, isFrCountry }: Props) => {
  const firstName = getCustomerFirstName(customerFullName)
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <p className="text-center font-normal text-base">
        {
          isUsCountry
            ? 'A last favor '
            : isCaCountry || isFrCountry
              ? 'Une dernière faveur '
              : '¡Ún ultimo favor '
        }
        <span className="text-primary font-semibold">
          {firstName}
        </span>
        !
      </p>
      <div className="h-0.5 rounded-full border-2 border-black w-12" />
      <p className="text-center font-normal text-base">
        {
          isUsCountry
          ? 'By clicking '
          : isCaCountry || isFrCountry
            ? 'En cliquant '
            : 'Al hacer clic en '
        }
        <span className="font-semibold">
        {
          isUsCountry
          ? 'Send'
          : isCaCountry || isFrCountry
            ? 'Envoyer'
            : 'Enviar'
        }
        </span>
        {
          isUsCountry
          ? ', we will take you to '
          : isCaCountry || isFrCountry
            ? ', nous vous emmènerons à '
            : ', te llevaremos a '
        }
        <span className="font-semibold text-red-500">
          Google
        </span>
        {
          isUsCountry
          ? ' so you can share your stars. We appreciate your support!'
          : isCaCountry || isFrCountry
            ? ' pour que vous puissiez partager vos étoiles. Nous apprécions votre soutien!'
            : ' para que compartas tus estrellas. ¡Apreciamos tu apoyo!'
        }
      </p>
    </div>
  )
}

export default GoogleReviewMessage
