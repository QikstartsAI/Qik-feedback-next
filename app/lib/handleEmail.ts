import { Customer } from "../types/customer";
import { CUSTOMERS_COLLECTION_NAME, COLLECTION_NAME } from '@/app/constants/general'
import { getFirebase } from '@/app/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export const findCustomerDataByEmail = async (email: string): Promise<Customer | null> => {
  const db = getFirebase().db;
  const customerDocRef = doc(db, CUSTOMERS_COLLECTION_NAME || '', email);

  try {
    const customerDocSnapshot = await getDoc(customerDocRef);

    if (customerDocSnapshot.exists()) {
      const customerData = customerDocSnapshot.data() as Customer;
      return customerData;
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


export const getCustomerDataInBusiness = async (email: string, businessId: string | null, branchId: string | null, waiterId: string | null) => {
  const db = getFirebase().db;
  let basePath = `/${businessId}/customers/${email}`;

  if (branchId) {
    basePath = `/${businessId}/sucursales/${branchId}/customers/${email}`;
    if (waiterId) {
      basePath = `/${businessId}/sucursales/${branchId}/meseros/${waiterId}/customers/${email}`;
    }
  } else if (waiterId) {
    basePath = `/${businessId}/meseros/${waiterId}/customers/${email}`;
  }

  const customerDocRef = doc(db, COLLECTION_NAME + basePath);
  const customerDocSnapshot = await getDoc(customerDocRef);
  if (customerDocSnapshot.exists()) {
    return customerDocSnapshot.data() as Customer;
  } else {
    return null;
  }
}
