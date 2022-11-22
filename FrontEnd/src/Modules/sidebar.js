const OPEN_SIDEBAR = "sidebar/OPEN_SIDEBAR";
const CLOSE_SIDEBAR = "sidebar/CLOSE_SIDEBAR";

export const openSidebar = () => ({ type: OPEN_SIDEBAR, width: "280px" });
export const closeSidebar = () => ({ type: CLOSE_SIDEBAR, width: 0 });

const initialState = {
  width: "280px", // 사용자의 커스텀 메뉴 정보를 담고있는 객체
  opened: true,
};

export const sidebar = (state = initialState, action) => {
  const { type, width } = action;
  switch (type) {
    case OPEN_SIDEBAR:
      return {
        ...state,
        width,
        opened: true,
      };

    case CLOSE_SIDEBAR:
      return {
        ...state,
        width,
        opened: false,
      };

    default:
      return state;
  }
};
