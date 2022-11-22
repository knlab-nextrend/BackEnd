import { BsFileEarmarkDiff, BsSave } from "react-icons/bs";

export const STATUS_CODE_SET = {
  2: {
    type: "refine",
    mainTitle: "크롤 데이터 정제",
    title: "크롤 데이터 정제",
    icon: BsFileEarmarkDiff,
  },
  3: {
    type: "refine",
    mainTitle: "크롤 데이터 정제",
    title: BsFileEarmarkDiff,
  },
  4: {
    type: "register",
    mainTitle: "크롤 데이터 등록",
    title: "크롤 데이터 등록",
    icon: BsSave,
  },
  5: {
    type: "register",
    mainTitle: "크롤 데이터 등록",
    title: "크롤 데이터 등록",
    icon: BsSave,
  },
};
