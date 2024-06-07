import { Business } from "@/app/types/business"
import loyaltyService from "@/app/services/loyaltyService";
import { DocumentData } from "firebase/firestore";
import { BirthdayOption } from "@/app/types/loyalty";

type Benefits = {
  userBirthday?: string
  business: Business | null
}

type VerifyBenefits = {
  userBirthday?: string
  loyaltyConfigurationData?: DocumentData
}

export const userHasBirthdayBenefits = async ({ userBirthday, business }: Benefits) => {
  try {
    const loyaltyConfigurationData = (await loyaltyService.getBirthdayDataFromBusiness(business)).data()
    const response = verifyBirthdayBenefit({userBirthday, loyaltyConfigurationData})
    return response
  } catch (error) {
    console.log(error)
  }
  return false
}

const verifyBirthdayBenefit = ({ userBirthday, loyaltyConfigurationData }: VerifyBenefits) => {
  if (!userBirthday || !loyaltyConfigurationData) return false;

  const currentDate = new Date()
  const { birthdayOption } = loyaltyConfigurationData;
  const userBirthdayDate = new Date(userBirthday);
  userBirthdayDate.setFullYear(currentDate.getFullYear());

  const differenceDays = Math.floor((currentDate.getTime() - userBirthdayDate.getTime()) / (1000 * 60 * 60 * 24));
  return (
    (birthdayOption === BirthdayOption.onlyOnHisBirthday && differenceDays === 0) ||
    (birthdayOption === BirthdayOption.onTheDayAndthirtyDaysAfter && differenceDays >= 0 && differenceDays <= 30) ||
    (birthdayOption === BirthdayOption.upToSixtyDaysAfter && differenceDays >= 0 && differenceDays <= 60)
  );
}
