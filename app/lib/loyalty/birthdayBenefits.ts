import { Business } from "@/app/types/business"
import loyaltyService from "@/app/services/loyalty/general";
import { DocumentData } from "firebase/firestore";
import { BirthdayConfiguration, BirthdayOption } from "@/app/types/loyalty";

type Benefits = {
  userBirthday?: string
  business: Business | null
}

type VerifyBenefits = {
  userBirthday?: string
  loyaltyConfigurationData?: BirthdayConfiguration
}

export const userHasBirthdayBenefits = async ({ userBirthday, business }: Benefits): Promise<[boolean, string[]]> => {
  try {
    const loyaltyConfigurationData = (await loyaltyService.getBirthdayDataFromBusiness(business)).data() as BirthdayConfiguration;
    if (!loyaltyConfigurationData) {
      throw new Error('Loyalty configuration data not found');
    }
    const selectedGifts = loyaltyConfigurationData.selectedGifts || [];
    const userHasBenefits = verifyBirthdayBenefit({ userBirthday, loyaltyConfigurationData });
    return [userHasBenefits, selectedGifts];
  } catch (error) {
    console.error('Error fetching birthday benefits:', error);
    return [false, []];
  }
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
