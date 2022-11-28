import { createContext, useContext, useReducer, useState } from "react";

const defaultState = {
  user: {} as any,
  logged: false || undefined,
};

type State = typeof defaultState;
type Dispatch = (action: any) => void;

type childrenProp = {
  children: React.ReactNode;
};

export const UserCtx = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function userReducer(state: State, action: any) {
  switch (action.type) {
    case "LOGGED":
      return { ...state, logged: action.payload };
    case "USER_DATA":
      return { ...state, user: action.payload };
    case "LOG_OUT":
      return { ...state, user: action.payload, logged: false };

    default:
      return state;
  }
}

export const UserCtxProvider: React.FC<childrenProp> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, defaultState);

  return (
    <UserCtx.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export function useUserContext() {
  const context = useContext(UserCtx);
  if (!context) {
    throw new Error("User context must be used inside provider");
  }
  return context;
}
