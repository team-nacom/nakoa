
const SET_USER = 'SET_USER' as const;
const CLEAR_USER = 'CLEAR_USER' as const;

export const setUser = (email: string, username: string) => {
  return {
    type: SET_USER,
    email, username,
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
  username: string;
};

const initialState : UserState = {
  loggedIn: false,
  email: '',
  username: '',
};

export default function user(state = initialState, action : UserAction) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        email: action.email,
        username: action.username,
        loggedIn: true,
      };
    case CLEAR_USER:
      return {
        ...state,
        email: '',
        username: '',
        loggedIn: false,
      }
    default:
      return state;
  }
}
