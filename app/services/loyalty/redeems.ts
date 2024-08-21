import { collection, doc, onSnapshot } from 'firebase/firestore';
import { getFirebase } from '@/app/lib/firebase';
import { DASHBOARD_COLLECTION_NAME } from '@/app/constants/general';

export function subscribeToCustomerRedeems(
  businessId: string,
  customerEmail: string,
  redeemId: string,
  onRedeemChange: (isRedeemed: boolean) => void
) {
  const redeemDocRef = doc(
    getFirebase()?.db,
    DASHBOARD_COLLECTION_NAME,
    businessId,
    'loyalty',
    'qik-cumple',
    'customers-redeems',
    customerEmail,
    'redeems',
    redeemId
  );

  const unsubscribeCustomersRedeems = onSnapshot(
    redeemDocRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const isRedeemed = data.redeemed as boolean;
        onRedeemChange(isRedeemed);
      }
    },
    (error) => {
      console.error("Error fetching document:", error);
    }
  );

  return unsubscribeCustomersRedeems;
}
