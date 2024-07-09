import {collection, doc, getDoc, setDoc } from 'firebase/firestore';
import {getFirebase} from '@/app/lib/firebase'
import {
	DASHBOARD_COLLECTION_NAME,
	LOYALTY_SUBCOLLECTION_NAME,
	QIK_CUMPLE_SUBCOLLECTION_NAME,
	QIK_REWARDS_SUBCOLLECTION_NAME,
	QIK_STARS_SUBCOLLECTION_NAME,
  CUSTOMERS_REDEEMS_SUBCOLLECTION_NAME,
  REDEEMS_SUBCOLLECTION_NAME
} from "@/app/constants/general";
import {Business} from "@/app/types/business";
import { Customer } from '../types/customer';
import { GiftData } from '../types/loyalty';

type BenefitDataRedeem = {
  businessId: string | null
  customerData: Customer | null
  qikLoyaltySubcollection: string
}

const getBirthdayDataFromBusiness = async (businessData: Business | undefined | null) => {
	return await getDoc(doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, businessData?.BusinessId || '-', LOYALTY_SUBCOLLECTION_NAME, QIK_CUMPLE_SUBCOLLECTION_NAME) );
}

const getRewardsDataFromBusiness = async (businessData: Business | undefined | null) => {
	return await getDoc(doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, businessData?.BusinessId || '-', LOYALTY_SUBCOLLECTION_NAME, QIK_REWARDS_SUBCOLLECTION_NAME) );
}

const getStarsDataFromBusiness = async (businessData: Business | undefined | null) => {
	return await getDoc(doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, businessData?.BusinessId || '-', LOYALTY_SUBCOLLECTION_NAME, QIK_STARS_SUBCOLLECTION_NAME) );
}

const sendCustomerDataToCustomersRedeem = async ({businessId, customerData, qikLoyaltySubcollection}: BenefitDataRedeem) => {
  const customersRedeemsRef = collection(
    getFirebase().db,
    DASHBOARD_COLLECTION_NAME,
    businessId || '-',
    LOYALTY_SUBCOLLECTION_NAME,
    qikLoyaltySubcollection,
    CUSTOMERS_REDEEMS_SUBCOLLECTION_NAME,
  )
  const customerRef = doc(customersRedeemsRef, customerData?.email)
  await setDoc(customerRef, customerData)

}

const sendBenefitDataRedeem = async ({
  businessId,
  customerData,
  qikLoyaltySubcollection
}: BenefitDataRedeem,
selectedBenefit: GiftData | null,
pin: string
) => {
  const redeemedBenefitData = {
    "pin": pin,
    "benefit": selectedBenefit
  }
  await sendCustomerDataToCustomersRedeem({
    businessId,
    customerData,
    qikLoyaltySubcollection
  })

  const customerRedeemsRef = collection(
    getFirebase().db,
    DASHBOARD_COLLECTION_NAME,
    businessId || '-',
    LOYALTY_SUBCOLLECTION_NAME,
    qikLoyaltySubcollection,
    CUSTOMERS_REDEEMS_SUBCOLLECTION_NAME,
    customerData?.email || '',
    REDEEMS_SUBCOLLECTION_NAME
  )
  await setDoc(doc(customerRedeemsRef), redeemedBenefitData)
}

const loyaltyService = {
	getBirthdayDataFromBusiness: getBirthdayDataFromBusiness,
	getRewardsDataFromBusiness: getRewardsDataFromBusiness,
	getStarsDataFromBusiness: getStarsDataFromBusiness,
  sendBenefitDataRedeem: sendBenefitDataRedeem
}

export default loyaltyService;