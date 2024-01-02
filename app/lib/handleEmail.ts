import { Customer } from "../types/customer";
import { CUSTOMERS_COLLECTION_NAME } from '@/app/constants/general'
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
