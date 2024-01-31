import {
  DASHBOARD_COLLECTION_NAME,
  ASSETS_FOLDER,
  BUCKET_NAME,
  USERS_COLLECTION_NAME,
  COLLECTION_NAME,
} from "@/app/constants/general";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { getFirebase } from "@/app/lib/firebase";

export const getStorageFromBucket = () => {
  const storageBucket = `gs://${BUCKET_NAME}`;
  const storage = getStorage(getFirebase().firebaseApp, storageBucket);
  return storage;
};

export const parseBusinessIconAndCover = async (business: BusinessI) => {
  const storage = getStorageFromBucket();
  business["IconoWhite"] = await getDownloadURL(
    ref(storage, `${ASSETS_FOLDER.icons}/${business.IconoWhite}`)
  );
  business["Icono"] = business["IconoWhite"];
  business["Cover"] = await getDownloadURL(
    ref(storage, `${ASSETS_FOLDER.background}/${business.Cover}`)
  );
  return business;
};
