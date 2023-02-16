import {collection, getDocs, limit, orderBy, query, startAt} from "firebase/firestore";
import {firebaseFirestore} from "./Firebase";

export const paginate = async (collectionName, columnOrder, pageLimit = 10, page = 1) => {
  const qCollection = collection(firebaseFirestore, collectionName)
  const qLimit = limit(pageLimit)
  const qOrder = orderBy(columnOrder)
  const qStartAt = startAt(pageLimit * page)

  const q = query(qCollection, qOrder, qStartAt, qLimit)
  const data = await getDocs(q)

  return {
    data: data,
    metadata: await metadata(collectionName, columnOrder, pageLimit, page)
  }
}

export const metadata = async (collectionName, columnOrder, pageLimit = 10, page = 1) => {
  const qCollection = collection(firebaseFirestore, collectionName)
  const allData = await getDocs(query(qCollection))

  const totalData = allData.size
  const from = (page * pageLimit) + 1
  const to = from + pageLimit
  const last_page = (totalData - (totalData % pageLimit)) + 1

  return {
    from,
    to,
    total: totalData,
    per_page: pageLimit,
    last_page,
    current_page: page,
  }
}
