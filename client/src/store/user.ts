
const SET_USER = 'SET_USER' as const;
const CLEAR_USER = 'CLEAR_USER' as const;

export const setUser = (email: string, nickname: string) => {
  return {
    type: SET_USER,
    email, nickname,
  };
};

export const clearUser = () => {
  return {
    type: CLEAR_USER,
  };
};

export type UserAction = 
  | ReturnType<typeof setUser>
  | ReturnType<typeof clearUser>
;

interface UserState {
  loggedIn: boolean;
  email: string;
  nickname: string;
};

const initialState : UserState = {
  loggedIn: false,
  email: '',
  nickname: '',
};

export default function user(state = initialState, action : UserAction) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        email: action.email,
        nickname: action.nickname,
        loggedIn: true,
      };
    case CLEAR_USER:
      return {
        ...state,
        email: '',
        nickname: '',
        loggedIn: false,
      }
    default:
      return state;
  }
}
