import { COLLECTION_NAME } from '@/app/constants/general'
import { getFirebase, getTimesTampFromDate } from '@/app/lib/firebase'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { SimpleFeedbackProps } from '../validators/simpleFeedbackSchema'
import { v4 as uuidv4 } from 'uuid';

const handleSimpleFeedbackSubmit = async (
  {
    FullName,
    Email,
    Rating,
    ProvideMoreFeedback,
    ExperienceText,
    StartTime
  }: SimpleFeedbackProps,
  businessId: string,
  branchId: string,
  waiterId: string,
  isQr: boolean
) => {
  const feedbackData = {
    CreationDate: getTimesTampFromDate(new Date()),
    FullName,
    Email,
    Rating: parseInt(Rating),
    ProvideMoreFeedback,
    ExperienceText,
    StartTime: getTimesTampFromDate(StartTime),
    FromQr: isQr
  }

  try {
    let customerDocRef;
    if (Email) {
      customerDocRef = doc(collection(getFirebase().db, COLLECTION_NAME || '', businessId || '', 'sucursales', branchId || '', 'meseros', waiterId || '', 'customers'), Email);
      await setDoc(customerDocRef, { FullName, Email });
    } else {
      const customerId = uuidv4();
      customerDocRef = doc(collection(getFirebase().db, COLLECTION_NAME || '', businessId || '', 'sucursales', branchId || '', 'meseros', waiterId || '', 'customers'), customerId);
      await setDoc(customerDocRef, { FullName, Email });
    }

    const feedbacksCollectionRef = collection(customerDocRef, 'feedbacks');
    await addDoc(feedbacksCollectionRef, feedbackData);
  } catch (error) {
    console.log(error)
  }
}

export default handleSimpleFeedbackSubmit
