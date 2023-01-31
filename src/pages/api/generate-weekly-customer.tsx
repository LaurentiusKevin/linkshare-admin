// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getTotalCustomerWeekly } from "../../config/FirebaseFirestore";

type Data = {
  status: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let generate = await getTotalCustomerWeekly();
  res.status(200).json({ status: "Success", data: generate });
}
