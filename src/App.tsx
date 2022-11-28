import { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { privateRoutes, publicRoutes } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase.config";
import { doc, getDoc } from "firebase/firestore";
import Spinner from "./components/Spinner";
import { centerCenter } from "./utilities";
import { UserCtx, useUserContext } from "./context/userContext";
import { UserCtxProvider } from "./context/userContext";
import { useAsyncHandler } from "react-hooks-async-handlers";

function App() {
  const { state, dispatch } = useUserContext();

  useEffect(() => {
    const controller = new AbortController();

    authUser();
    return () => controller.abort();
  }, [state.logged]);

  const getAuthUser = useAsyncHandler(async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch({ type: "LOGGED", payload: true });
        const docRef = doc(db, "users", user?.uid.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          dispatch({ type: "USER_DATA", payload: data });
        }
      }
    });
  });

  const { isLoading, execute: authUser } = getAuthUser;




  return (
    <>
      {isLoading ? (
        <div className={`d-flex vh-100 ${centerCenter}`}>
          <Spinner />
        </div>
      ) : (
        <Routes>
          {state.logged
            ? privateRoutes.map((r: { path: string; element: JSX.Element }) => (
                <Route path={r.path} element={r.element} key={r.path + 1} />
              ))
            : publicRoutes.map((r: { path: string; element: JSX.Element }) => (
                <Route path={r.path} element={r.element} key={r.path + 1} />
              ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}

      <ToastContainer />
    </>
  );
}

export default App;
