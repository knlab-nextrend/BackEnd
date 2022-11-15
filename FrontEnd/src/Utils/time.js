import dayjs from "dayjs";

export const toYYMMDD_DOT = (date) => {
  if (!date) return "";
  return dayjs(date).format("YY.MM.DD");
};

export const toYYYYMMDD_DOT = (date) => {
  if (!date) return "";
  return dayjs(date).format("YYYY.MM.DD");
};
