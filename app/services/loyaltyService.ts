import {doc, getDoc } from 'firebase/firestore';
import {getFirebase} from '@/app/lib/firebase'
import {
	DASHBOARD_COLLECTION_NAME,
	LOYALTY_SUBCOLLECTION_NAME,
	QIK_CUMPLE_SUBCOLLECTION_NAME,
	QIK_REWARDS_SUBCOLLECTION_NAME,
	QIK_STARS_SUBCOLLECTION_NAME,
} from "@/app/constants/general";
import {Business} from "@/app/types/business";

const getBirthdayDataFromBusiness = async (businessData: Business | undefined | null) => {
	return await getDoc(doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, businessData?.BusinessId || '-', LOYALTY_SUBCOLLECTION_NAME, QIK_CUMPLE_SUBCOLLECTION_NAME) );
}

const getRewardsDataFromBusiness = async (businessData: Business | undefined | null) => {
	return await getDoc(doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, businessData?.BusinessId || '-', LOYALTY_SUBCOLLECTION_NAME, QIK_REWARDS_SUBCOLLECTION_NAME) );
}

const getStarsDataFromBusiness = async (businessData: Business | undefined | null) => {
	return await getDoc(doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, businessData?.BusinessId || '-', LOYALTY_SUBCOLLECTION_NAME, QIK_STARS_SUBCOLLECTION_NAME) );
}

const loyaltyService = {
	getBirthdayDataFromBusiness: getBirthdayDataFromBusiness,
	getRewardsDataFromBusiness: getRewardsDataFromBusiness,
	getStarsDataFromBusiness: getStarsDataFromBusiness
}

export default loyaltyService;