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

    // const q = query(pageRef, orderBy("email"), startAt(1), limit(10));
    const q = query(pageRef, orderBy("email"));

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
  let savedAllView = 0,
    overallView = 0;

  const pages = await getAllPages();
  const allView = await getAllView(0);

  pages.forEach((item) => {
    overallView += item.data().totalView ?? 0;
  });

  allView.forEach((item) => {
    savedAllView += item.data().totalView ?? 0;
  });

  let hourlyView = overallView - savedAllView;
  hourlyView = hourlyView <= 0 ? 0 : hourlyView;

  await setDoc(doc(firebaseFirestore, "pages-view", crypto.randomUUID()), {
    totalView: hourlyView,
    timestamp: new Date(),
  });

  await setDoc(doc(firebaseFirestore, "pages-view", "total-view"), {
    view: overallView,
  });

  return {
    hourlyView: {
      timestamp: new Date(),
      totalView: hourlyView,
    },
    allPageView: savedAllView,
  };
};

export const storeCustomerStatistics = async () => {
  let savedTotalCustomer = 0,
    overallCustomer = 0;

  const pageRef = collection(firebaseFirestore, "customer-monthly");
  const q = query(pageRef, orderBy("timestamp", "desc"));
  let savedStatistics = await getDocs(q);
  savedStatistics.forEach((item) => {
    savedTotalCustomer += item.data().totalCustomer ?? 0;
  });

  overallCustomer = (await getAllProfile()).size;

  let monthlyCustomer = overallCustomer - savedTotalCustomer;
  monthlyCustomer = monthlyCustomer <= 0 ? 0 : monthlyCustomer;

  await setDoc(
    doc(firebaseFirestore, "customer-monthly", crypto.randomUUID()),
    {
      totalCustomer: monthlyCustomer,
      timestamp: new Date(),
    }
  );
  // await setDoc(doc(firebaseFirestore, "customer-monthly", "total-customer"), {
  //   view: overallCustomer,
  // });

  return {
    statistics: {
      timestamp: new Date(),
      totalCustomer: monthlyCustomer,
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
    `customer-statistics`,
    "total-customer-daily"
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
  const totalCustomer = await getTotalCustomer();

  const storedDataQuery = doc(
    firebaseFirestore,
    `customer-statistics`,
    "total-customer-daily"
  );
  const storedData = (await getDoc(storedDataQuery)).data();

  const results = {
    current: totalCustomer.current - (storedData.overall ?? 0),
    previous: storedData.current,
    overall: totalCustomer.current,
    "last-update": new Date(),
  };

  await setDoc(
    doc(firebaseFirestore, "customer-statistics", "total-customer-daily"),
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
