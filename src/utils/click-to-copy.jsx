import { toast } from "react-toastify";

export default async function ClickToCopy({ text }) {
  await navigator.clipboard.writeText(text);
  toast.success("Text copied to your clipboard");
}
