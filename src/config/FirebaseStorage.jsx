import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "./Firebase";

export const uploadImage = async (filename, file) => {
  const storageRef = ref(firebaseStorage, filename);

  return uploadBytes(storageRef, file);
};

export const getImage = async (filename) => {
  const storageRef = ref(firebaseStorage, filename);

  return getDownloadURL(storageRef);
};
