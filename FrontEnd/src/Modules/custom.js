const SET_AXIS= "custom/SET_AXIS";

export const setAxis = (axisObj) => ({ type: SET_AXIS, axisObj });

const initialState = {
    axisObj: { X: null, Y: null }, // 사용자의 커스텀 메뉴 정보를 담고있는 객체
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_AXIS:
      return {
        ...state,
        axisObj: action.axisObj,
      };

    default:
      return state;
  }
}
