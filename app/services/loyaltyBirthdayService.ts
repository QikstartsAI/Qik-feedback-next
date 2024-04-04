import {collection, doc, getDoc, getDocs, setDoc} from 'firebase/firestore';
import {getFirebase} from '@/app/lib/firebase'
import {
	DASHBOARD_COLLECTION_NAME,
	LOYALTY_SUBCOLLECTION_NAME,
	QIK_CUMPLE_SUBCOLLECTION_NAME
} from "@/app/constants/general";
import {Business} from "@/app/types/business";

const getDataFromBusiness = async (businessData: Business | undefined | null) => {
	return await getDoc( doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, businessData?.BusinessId || '-', LOYALTY_SUBCOLLECTION_NAME, QIK_CUMPLE_SUBCOLLECTION_NAME) );
}

const qikBirthdayService = {
	getDataFromBusiness
}

export default qikBirthdayService;