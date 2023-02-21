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
import moment, { now } from "moment";
import * as crypto from "crypto";
import {bool} from "yup";
import {FirebaseTimestamp} from "../utils/firebase-timestamp";

export const storePage = async (uid, page) => {
  return setDoc(doc(firebaseFirestore, "pages", page.url), {
    url: page.url,
    uid: uid,
    name: page.name,
    description: page.description,
    link: page.link,
    logoImage: page.logoImage,
    backgroundImage: page.backgroundImage,
    status: page.status ?? "active",
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

export const getAllPages = async (withProfile = false) => {
  try {
    const pageRef = collection(firebaseFirestore, "pages");

    const q = query(pageRef);

    let result = await getDocs(q);

    let pages = []
    result.forEach(item => {
      pages.push({
        ...item.data(),
        createdAt: FirebaseTimestamp(item),
        profile: null
      })
    })

    if (withProfile === true) {
      pages.forEach((item, key) => {
        getProfile(item.uid)
          .then(profile => {
            pages[key] = {
              ...item,
              profile: profile
            }
          })
      })
    }

    return pages
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};

export const getAllProfile = async () => {
  try {
    const pageRef = collection(firebaseFirestore, "profile");

    // const q = query(pageRef, orderBy("email"), startAt(1), limit(10));
    const q = query(pageRef, orderBy("email"));

    return await getDocs(q);
  } catch (e) {
    console.log("failed to get all profile: ", e);
  }
};

export const getAllAdminUser = async () => {
  try {
    const pageRef = collection(firebaseFirestore, "profile");

    // const q = query(pageRef, orderBy("email"), startAt(1), limit(10));
    const q = query(pageRef, where('role','==','admin'));

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
    status: profile.status ?? "active",
    role: profile.role ?? "customer",
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

export const getAllView = async (pageLimit = 14) => {
  try {
    const pageRef = collection(firebaseFirestore, "pages-view");

    let q;
    if (pageLimit === 0) {
      q = query(pageRef, orderBy("timestamp", "desc"));
    } else {
      q = query(pageRef, orderBy("timestamp", "desc"), limit(pageLimit));
    }

    return await getDocs(q);
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};

export const getAllCustomerStatistics = async (pageLimit = 12) => {
  try {
    const pageRef = collection(firebaseFirestore, "customer-monthly");

    let q;
    if (pageLimit === 0) {
      q = query(pageRef, orderBy("timestamp", "desc"));
    } else {
      q = query(pageRef, orderBy("timestamp", "desc"), limit(pageLimit));
    }

    return await getDocs(q);
  } catch (e) {
    console.log("failed to get data: ", e);
  }
};

export const storeViewStatistics = async () => {
  const now = new Date(),
    docsID = moment().format("YYYY-MM");
  let overallView = 0;

  const pages = await getAllPages();

  pages.forEach((item) => {
    overallView += item.data().totalView ?? 0;
  });

  await setDoc(doc(firebaseFirestore, "pages-view", docsID), {
    totalView: overallView,
    timestamp: now,
  });

  return {
    statistics: {
      id: docsID,
      data: {
        timestamp: now,
        totalView: overallView,
      }
    },
  };
};

export const storeCustomerStatistics = async () => {
  const now = new Date(),
    docsID = moment().format("YYYY-MM");

  const overallCustomer = (await getAllProfile()).size;

  await setDoc(
    doc(firebaseFirestore, "customer-monthly", docsID),
    {
      totalCustomer: overallCustomer,
      timestamp: now,
    }
  );

  return {
    statistics: {
      id: docsID,
      data: {
        timestamp: now,
        totalCustomer: overallCustomer,
      }
    },
  };
};

export const getTotalPage = async () => {
  const allPage = await getAllPages();

  return allPage.size;
};

export const getCustomerStatistics = async () => {
  await getTotalCustomer();
  const totalCustomerQuery = doc(
    firebaseFirestore,
    `customer-statistics`,
    "total-customer"
  );
  const totalCustomer = (await getDoc(totalCustomerQuery)).data();

  const totalCustomerDailyQuery = doc(
    firebaseFirestore,
    `customer-daily`,
    moment().format('YYYY-MM-DD')
  );
  const totalCustomerDaily = (await getDoc(totalCustomerDailyQuery)).data();

  const totalCustomerWeeklyQuery = doc(
    firebaseFirestore,
    `customer-statistics`,
    "total-customer-weekly"
  );
  const totalCustomerWeekly = (await getDoc(totalCustomerWeeklyQuery)).data();

  const totalCustomerMonthlyQuery = doc(
    firebaseFirestore,
    `customer-statistics`,
    "total-customer-monthly"
  );
  const totalCustomerMonthly = (await getDoc(totalCustomerMonthlyQuery)).data();

  return {
    totalCustomer: totalCustomer,
    daily: totalCustomerDaily,
    weekly: totalCustomerWeekly,
    monthly: totalCustomerMonthly,
  };
};

export const getTotalCustomer = async () => {
  const allProfile = (await getAllProfile()).size;

  const storedDataQuery = doc(
    firebaseFirestore,
    `customer-statistics`,
    "total-customer"
  );
  const storedData = (await getDoc(storedDataQuery)).data();

  const results = {
    current: allProfile,
    previous: storedData.current ?? 0,
  };

  await setDoc(
    doc(firebaseFirestore, "customer-statistics", "total-customer"),
    results
  );

  return results;
};

export const getTotalCustomerDaily = async () => {
  const datetime = moment()
  const now = datetime.format('YYYY-MM-DD')
  const yesterday = datetime.subtract(1, 'day').format('YYYY-MM-DD')

  const totalCustomer = await getTotalCustomer();

  const storedDataQuery = collection(firebaseFirestore, `customer-daily`);
  const storedData = await getDocs(query(storedDataQuery));

  let totalStored = 0, totalYesterday = 0
  storedData.forEach(item => {
    if (item.id !== now) {
      totalStored += item.data().total
    }
    if (item.id === yesterday) {
      totalYesterday += item.data().total
    }
  })

  let results = {
    total: totalCustomer.current - totalStored,
    previous: totalYesterday,
    timestamp: new Date()
  }

  await setDoc(
    doc(firebaseFirestore, "customer-daily", now),
    results
  );

  return results;
};

export const getTotalCustomerWeekly = async () => {
  const totalCustomer = await getTotalCustomer();

  const storedDataQuery = doc(
    firebaseFirestore,
    `customer-statistics`,
    "total-customer-weekly"
  );
  const storedData = (await getDoc(storedDataQuery)).data();

  const results = {
    current: totalCustomer.current - (storedData.overall ?? 0),
    previous: storedData.current,
    overall: totalCustomer.current,
    "last-update": new Date(),
  };

  await setDoc(
    doc(firebaseFirestore, "customer-statistics", "total-customer-weekly"),
    results
  );

  return results;
};

export const getTotalCustomerMonthly = async () => {
  const totalCustomer = await getTotalCustomer();

  const storedDataQuery = doc(
    firebaseFirestore,
    `customer-statistics`,
    "total-customer-monthly"
  );
  const storedData = (await getDoc(storedDataQuery)).data();

  const results = {
    current: totalCustomer.current - (storedData.overall ?? 0),
    previous: storedData.current,
    overall: totalCustomer.current,
    "last-update": new Date(),
  };

  await setDoc(
    doc(firebaseFirestore, "customer-statistics", "total-customer-monthly"),
    results
  );

  return results;
};
