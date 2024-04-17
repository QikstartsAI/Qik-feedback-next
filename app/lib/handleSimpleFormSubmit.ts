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
    ImproveText,
    StartTime
  }: SimpleFeedbackProps,
  businessId: string,
  branchId: string,
  waiterId: string,
  isQr: boolean
) => {
  const feedbaackData = {
    CreationDate: getTimesTampFromDate(new Date()),
    FullName,
    Email,
    Rating: parseInt(Rating),
    ProvideMoreFeedback,
    ImproveText,
    StartTime: getTimesTampFromDate(StartTime),
    FromQr: isQr
  }

  try {
    const waiterFeedbackRef = collection(
      getFirebase().db,
      COLLECTION_NAME || '',
      businessId || '',
      'sucursales',
      branchId || '',
      'meseros',
      waiterId || '',
      'customers',
      Email ? Email : uuidv4(),
      'feedbacks'
    )
    await addDoc(waiterFeedbackRef, feedbaackData)
  } catch (error) {
    console.log(error)
  }
}

export default handleSimpleFeedbackSubmit
