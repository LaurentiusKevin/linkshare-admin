import "@styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
// Next.js allows you to import CSS directly in .js files.
// It handles optimization and all the necessary Webpack configuration to make this work.
import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { SSRProvider } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  fab,
  faFacebook,
  faInstagram,
  faLinkedin,
  faShopify,
  faTiktok,
  faTwitter,
  faWordpress,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBurger,
  faCartShopping,
  faFontAwesome,
  faLocationDot,
  faPhone,
  fas,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { toast, ToastContainer } from "react-toastify";

// You change this configuration value to false so that the Font Awesome core SVG library
// will not try and insert <style> elements into the <head> of the page.
// Next.js blocks this from happening anyway so you might as well not even try.
// See https://fontawesome.com/v6/docs/web/use-with/react/use-with#next-js
config.autoAddCss = false;

library.add(
  faFontAwesome,
  fas,
  fab,
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
  faTiktok,
  faWordpress,
  faBurger,
  faCartShopping,
  faShopify,
  faPhone,
  faLocationDot,
  faYoutube,
  faShop,
  faEnvelope
);

function MyApp({ Component, pageProps }: AppProps) {
  const iconList = [
    "fa-solid fa-phone",
    "fab fa-facebook",
    "fab fa-twitter",
    "fab fa-linkedin",
    "fab fa-instagram",
    "fab fa-tiktok",
    "fab fa-wordpress",
    "fa-solid fa-burger",
    "fab fa-shopify",
    "fa-solid fa-location-dot",
    "fab fa-youtube",
    "fa-solid fa-shop",
    "fa-solid fa-envelope",
    "fa-solid fa-globe",
    "fa-solid fa-message",
  ];

  const Toast = withReactContent(Swal).mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  pageProps = {
    ...pageProps,
    Swal: withReactContent(Swal),
    toast: toast,
    iconList,
  };
  // In server-side rendered applications, a SSRProvider must wrap the application in order
  // to ensure that the auto-generated ids are consistent between the server and client.
  // https://react-bootstrap.github.io/getting-started/server-side-rendering/
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <SSRProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </SSRProvider>
  );
}

export default MyApp;
