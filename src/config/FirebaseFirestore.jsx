import { firebaseFirestore } from "./Firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  orderBy,
  startAt,
  limit,
} from "firebase/firestore";

export const storePage = async (uid, page) => {
  return setDoc(doc(firebaseFirestore, "pages", page.url), {
    url: page.url,
    uid: uid,
    name: page.name,
    description: page.description,
    link: page.link,
    logoImage: page.logoImage,
    backgroundImage: page.backgroundImage,
    status: page.status,
  });
};

export const getPage = async (page) => {
  try {
    const pageRef = doc(firebaseFirestore, "pages", page);
    return (await getDoc(pageRef)).data();
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};

export const getPagesByUid = async (uid) => {
  try {
    const pageRef = collection(firebaseFirestore, "pages");

    const q = query(pageRef, where("uid", "==", uid));

    return await getDocs(q);
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};

export const getAllPages = async () => {
  try {
    const pageRef = collection(firebaseFirestore, "pages");

    const q = query(pageRef);

    return await getDocs(q);
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};

export const getAllProfile = async () => {
  try {
    const pageRef = collection(firebaseFirestore, "profile");

    const q = query(pageRef, orderBy("email"), startAt(1), limit(10));

    return await getDocs(q);
  } catch (e) {
    console.log("failed to get all profile: ", e);
  }
};

export const getProfile = async (uid) => {
  try {
    const profileRef = doc(firebaseFirestore, "profile", uid);
    return (await getDoc(profileRef)).data();
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};

export const storeProfile = async (profile) => {
  return setDoc(doc(firebaseFirestore, "profile", profile.uid), {
    username: profile.username,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    address: profile.address,
  });
};

export const getProfileByUid = async (uid) => {
  try {
    const pageRef = doc(firebaseFirestore, `profile`, uid);

    // const q = query(pageRef);

    return await getDoc(pageRef);
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};
