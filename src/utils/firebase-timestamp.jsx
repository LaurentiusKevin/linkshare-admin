import moment from "moment/moment";

export const FirebaseTimestamp = (item) => {
  const timestamp = item._document.createTime.toTimestamp().toMillis();

  return moment(timestamp).format("lll");
};
