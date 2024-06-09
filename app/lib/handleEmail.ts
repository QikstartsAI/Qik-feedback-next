import { Customer } from "../types/customer";
import { CUSTOMERS_COLLECTION_NAME, COLLECTION_NAME } from '@/app/constants/general'
import { getFirebase } from '@/app/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { CUSTOM_KFC_ID } from "@/app/constants/general";

export const findCustomerDataByEmail = async (email: string, businessId: string, brandId?: string | null): Promise<Customer | null> => {
  const db = getFirebase().db;
  const customerDocRef = doc(
    db,
    CUSTOMERS_COLLECTION_NAME || '',
    email
  );
  const customerBusinessDocRef = businessId !== CUSTOM_KFC_ID
  ? doc(
    db,
    CUSTOMERS_COLLECTION_NAME || '',
    email,
    'business',
    businessId
  ): doc(
    db,
    CUSTOMERS_COLLECTION_NAME || '',
    email,
    'business',
    businessId,
    'brand',
    brandId || ''
  )

  try {
    const customerDocSnapshot = await getDoc(customerDocRef);
    const customerBusinessDocSnapshot = await getDoc(customerBusinessDocRef);

    if (customerDocSnapshot.exists() || customerBusinessDocSnapshot.exists()) {
      const customerData = customerDocSnapshot.data() as Customer;
      const customerBusinessData = customerBusinessDocSnapshot.data() as Customer
      return {...customerData, ...customerBusinessData};
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar cliente por email:", error);
    return null;
  }
};

export const findIsCustomerInBusiness = async (email: string, businessId: string) => {
  const db = getFirebase().db
  const customerDocRef = doc(db, CUSTOMERS_COLLECTION_NAME || '', email, 'business', businessId)
  return (await getDoc(customerDocRef)).exists()
}

export const findCustomerFeedbackDataInBusiness = async (email: string, businessId: string) => {
  const db = getFirebase().db
  const customerDocRef = doc(db, CUSTOMERS_COLLECTION_NAME || '', email, 'business', businessId)
  const data = (await getDoc(customerDocRef)).data() as {customerNumberOfVisits: number, userApprovesLoyalty: boolean}
  return data
}
