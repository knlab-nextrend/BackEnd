const SET_USER = "user/SET_USER";

export const setUser = (user) => ({ type: SET_USER, user });

const initialState = {
  user: null, // 로그인한 유저의 정보를 담고 있는 state`
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
}

/* 
    그리고 프론트엔드 에서는 토큰 외의 유저 정보를 따로 저장하지 않아도 된다. 

    사용자가 로그인을 했을 때, 백엔드에서 해당 유저에 대한 토큰을 생성하고, 
    그 때 로그인한 유저에 대한 정보를 전역으로 관리하도록 한다. 

    프론트엔드에서 통신할 때 헤더로 보내는 토큰을 백엔드에서 받아 
    1. 토큰의 유효성 검사 => 유효하지 않거나 만료되었을 경우 401 에러 반환
    2. 로그인한 사용자에 대한 정보를 전역에서 가져와서 사용함. (post요청 등... DB에 무언갈르 기록할 일이 있을 때.)
*/
