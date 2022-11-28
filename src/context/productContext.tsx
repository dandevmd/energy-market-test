import { createContext, useContext, useReducer, useState } from "react";

export interface Iproduct {
  id: string;
  title: string;
  author: string;
  price: string;
}

const defaultState = {
  products: [] as Iproduct[],
  product: {} as Iproduct,
  productLoading: false,
};

type State = typeof defaultState;
type Dispatch = (action: any) => void;

type childrenProp = {
  children: React.ReactNode;
};

export const ProductCtx = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function productReducer(state: State, action: any) {
  switch (action.type) {
    case "GET_ALL":
      return { ...state, products: action.payload };
    case "GET_ONE":
      return { ...state, product: action.payload };
    case "ADD_ITEM":
      return { ...state, products: action.payload };
    case "DELETE_ITEM":
      return { ...state, products: action.payload };
    case "PRODUCT_LOADING":
      return { ...state, productLoading: action.payload };

    default:
      return state;
  }
}

export const ProductCtxProvider: React.FC<childrenProp> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, defaultState);

  return (
    <ProductCtx.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ProductCtx.Provider>
  );
};

export function useProductContext() {
  const context = useContext(ProductCtx);
  if (!context) {
    throw new Error("PRODUCT context must be used inside provider");
  }
  return context;
}
