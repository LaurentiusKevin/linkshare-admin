import { firebaseAuthentication } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import Cookies from "js-cookie";

export const authRegister = async ({ email, password }) => {
  return createUserWithEmailAndPassword(
    firebaseAuthentication,
    email,
    password
  );
};

export const authSignIn = async ({ email, password }) => {
  return signInWithEmailAndPassword(firebaseAuthentication, email, password);
};

export const authSignOut = async () => {
  return signOut(firebaseAuthentication);
};

export const getCurrentUser = async (context) => {
  let data = await Cookies.get("user");

  if (data === undefined) {
    return null;
  }

  return JSON.parse(data);
};

export const changePassword = ({ email, oldPassword, newPassword }) => {
  return authSignIn({ email: email, password: oldPassword }).then(
    (responseValidatePassword) => {
      return updatePassword(getAuth().currentUser, newPassword);
    }
  );
};

export const resetPassword = ({ email }) => {
  const actionCode = {
    url: window.location.origin,
    handleCodeInApp: true,
  };
  return sendPasswordResetEmail(firebaseAuthentication, email, actionCode);
};
