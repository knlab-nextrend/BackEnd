import dayjs from "dayjs";
export const toYYMMDD_DOT = (date) => {
  return dayjs(date).format("YY.MM.DD");
};
