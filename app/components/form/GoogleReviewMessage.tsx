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
          ? 'By clicking '
          : isCaCountry || isFrCountry
            ? 'En cliquant '
            : 'Al presionar '
        }
        <span className="font-semibold text-primary">
        {
          isUsCountry
          ? 'SEND'
          : isCaCountry || isFrCountry
            ? 'ENVOYER'
            : 'ENVIAR'
        }
        </span>
        {
          isUsCountry
          ? ', we are going to redirect you to '
          : isCaCountry || isFrCountry
            ? ', nous allons vous rediriger vers '
            : ', te vamos a dirigir a '
        }
        <span className="font-semibold text-red-500">
          Google
        </span>
        {
          isUsCountry
          ? ', last step to complete your survey.'
          : isCaCountry || isFrCountry
            ? ', dernière étape pour compléter votre sondage.'
            : ', último paso para completar tu encuesta.'
        }
        <span className="font-medium">
        {
          isUsCountry
          ? ' We appreciate your support!'
          : isCaCountry || isFrCountry
            ? ' Nous apprécions votre soutien!'
            : ' ¡Agradecemos tu apoyo!'
        }
        </span>
      </p>
    </div>
  )
}

export default GoogleReviewMessage