import {
  BsFileEarmarkDiff,
  BsInboxes,
  BsJournal,
  BsSave,
} from "react-icons/bs";

export const STATUS_CODE_SET = {
  2: {
    type: "refine",
    mainTitle: "크롤 데이터 정제",
    title: "데이터 정제 진행",
    icon: BsFileEarmarkDiff,
  },
  3: {
    type: "refine",
    mainTitle: "크롤 데이터 정제",
    title: "데이터 정제 진행",
    icon: BsFileEarmarkDiff,
  },
  4: {
    type: "register",
    mainTitle: "크롤 데이터 등록",
    title: "데이터 등록 진행",
    icon: BsSave,
  },
  5: {
    type: "register",
    mainTitle: "크롤 데이터 등록",
    title: "데이터 등록 진행",
    icon: BsSave,
  },
  6: {
    type: "archive",
    title: "아카이브 데이터 수정",
    icon: BsInboxes,
  },
  8: {
    type: "curation",
    title: "큐레이션 데이터 수정",
    icon: BsJournal,
  },
};
