const SET_LOGIN = "login/SET_LOGIN";
const SET_LOGOUT = "login/SET_LOGOUT";

/* 
    token - 로그인한 유저의 token 정보
    refreshToken - 로그인한 유저의 refreshToken 정보. 
    여기서 refreshToken은 로그인 연장에 사용함.
    token 만료 시 refreshToken만료 검사
    refreshToken이 만료되지 않았다면 로그인 연장.
    refreshToken이 만료되었다면 로그아웃 후 재로그인 요청
*/
/* 
    로그아웃 에서 일반 로그아웃과 세션만료 로그아웃을 구분함.
    normal_logout - 일반 로그아웃
    expired_logout - 세션 만료 로그아웃
*/

export const setLogin = (tokens) => ({ type: SET_LOGIN, tokens });
export const setLogout = (logout_type) => ({ type: SET_LOGOUT, logout_type });

const initialState = {
  isLogin: !!localStorage.getItem("token"), // 로그인 상태를 담고 있는 state
};

export default function login(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN:
      const _token = action.tokens.token;
      const _refreshToken = action.tokens.refreshToken;
      localStorage.setItem("token", _token);
      localStorage.setItem("refreshToken", _refreshToken);
      return {
        ...state,
        isLogin: true,
      };

    case SET_LOGOUT:
      const _type = action.logout_type;
      if (_type === "NORMAL_LOGOUT") {
        alert("성공적으로 로그아웃 되었습니다.");
      } else if (_type === "EXPIRED_LOGOUT") {
        alert("세션이 만료되어 로그아웃 되었습니다.");
      }
      localStorage.removeItem("token"); // 로컬스토리지에서 데이터 삭제
      localStorage.removeItem("refreshToken"); // 로컬스토리지에서 데이터 삭제
      window.location.href = "/";
      return {
        ...state,
        isLogin: false,
      };
    default:
      return state;
  }
}

/* 
    로그인 처리 관련 함수를 여기서 모두 관리하도록 할 예정.
    로그인 처리 함수가 흩어져 있으면 보기가 어려움 ...
    action 함수가 state 관리를 위해서 있는 거긴 한데    
    여기에서 localStorage 접근을 좀 해야겠음..
*/

/* 
    로그인을 하면 로컬스토리지에 token값과 refreshToken 값을 저장하며 , 
    저장한 token값은 서버와 통신을 할 때 로그인 유효 여부를 판단하기 위해 사용한다.

    저장한 token값은 로그아웃을 하지 않는 이상 localStorage에서 삭제되지 않지만,
    통신 과정에서 token값이 유효하지 않거나 만료되었다면 서버에서 401에러를 반환한다.
    
    이 401 인증실패 에러를 받았다면 로그아웃 처리 하고 재로그인을 하도록 유도한다. 

    그리고 프론트엔드 에서는 토큰 외의 유저 정보를 따로 저장하지 않아도 된다. 

    사용자가 로그인을 했을 때, 백엔드에서 해당 유저에 대한 토큰을 생성하고, 
    그 때 로그인한 유저에 대한 정보를 전역으로 관리하도록 한다. 

    프론트엔드에서 통신할 때 헤더로 보내는 토큰을 백엔드에서 받아 
    1. 토큰의 유효성 검사 => 유효하지 않거나 만료되었을 경우 401 에러 반환
    2. 로그인한 사용자에 대한 정보를 전역에서 가져와서 사용함. (post요청 등... DB에 무언갈르 기록할 일이 있을 때.)
*/

/* 
    로컬스토리지에 token key에 대한 value가 존재한다면 true값을 반환하며,
    로컬스토리지에 token key에 대한 value가 undefined 이거나 null .. 등 falsy한 값을 가지면 false를 반환한다 (!! 연산자)
*/
