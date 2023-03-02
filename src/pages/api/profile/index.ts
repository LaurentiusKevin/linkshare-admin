import type { NextApiRequest, NextApiResponse } from "next";
import {collection, endAt, getDocs, limit, orderBy, query, startAfter, startAt} from "firebase/firestore";
import {firebaseFirestore} from "../../../config/Firebase";
import {FirebaseTimestamp} from "../../../utils/firebase-timestamp";
import {ProfileParams} from "../../../api/profile";

type Data = {
  status: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const reqParams: ProfileParams = req.query
    let params = []
    if (reqParams.orderColumn) params.push(orderBy(reqParams.orderColumn, reqParams.orderDirection))
    if (reqParams.startData && reqParams.limit) params.push(startAt(reqParams.startData))
    if (reqParams.startData && reqParams.limit) params.push(endAt(10))

    const q = query(collection(firebaseFirestore, "profile"), orderBy('email','asc'), startAt(1), endAt(10));
    const data = await getDocs(q);

    const finalData: any[] = []
    data.forEach(item => {
      finalData.push({
        ...item.data(),
        id: item.id,
        createdAt: FirebaseTimestamp(item)
      })
    })

    params = []
    if (reqParams.orderColumn) params.push(orderBy(reqParams.orderColumn, reqParams.orderDirection))
    if (reqParams.startData && reqParams.limit) params.push(startAt(11))
    if (reqParams.startData && reqParams.limit) params.push(endAt(20))
    const qNextPage = query(collection(firebaseFirestore, "profile"), ...params);
    const nextPage = await getDocs(qNextPage)

    res.status(200)
      .json({
        status: "Success",
        data: {
          metadata: {
            limit: reqParams.limit,
            startPage: reqParams.startData,
            nextPage: nextPage.docs.length > 0
          },
          profile: finalData,
        }
      });
  }
  res.status(200).json({ status: "Success" });
}
