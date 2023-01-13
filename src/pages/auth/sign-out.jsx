import { authSignOut } from "../../config/FirebaseAuthentication";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function AuthLogout() {
  const signOut = async () => {
    await Cookies.remove("user", {
      path: "/",
    });

    await authSignOut();

    window.location.href = "/";
  };

  useEffect(() => {
    signOut();
  }, []);

  return <></>;
}
