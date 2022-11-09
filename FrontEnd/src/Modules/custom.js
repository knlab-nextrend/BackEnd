const SET_AXIS = "custom/SET_AXIS";

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

const SET_EDITING_AXIS = "custom/SET_EDITING_AXIS";
const SET_EDITING_AXIS_DATA = "custom/SET_EDITING_AXIS_DATA";

const initialEdittingAxis = {
  X: null,
  Y: null,
  selected: null,
}; // 사용자의 커스텀 메뉴 정보를 담고있는 객체
export const setEditingAxisData = (axis, axisType) => ({
  type: SET_EDITING_AXIS_DATA,
  axis,
  axisType,
});

export const setEditingAxis = (axis) => ({
  type: SET_EDITING_AXIS,
  axis,
});
export const editingAxis = (state = initialEdittingAxis, action) => {
  switch (action.type) {
    case SET_EDITING_AXIS:
      return {
        ...state,
        selected: action.axis,
      };
    case SET_EDITING_AXIS_DATA:
      return {
        ...state,
        [action.axis]: action.axisType,
      };
    default:
      return state;
  }
};
