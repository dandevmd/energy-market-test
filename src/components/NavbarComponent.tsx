import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../context/userContext";
import { auth } from "../firebase.config";
import { capitalizeFirstLetter, centerBetween } from "../utilities";
import Spinner from "./Spinner";

const NavbarComponent = () => {
  const { state, dispatch } = useUserContext();
  const [loc, setLoc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoc(window.location.pathname);
  }, [window.location.href]);

  const handleLogout = useAsyncHandler(async () => {
    await signOut(auth);
    dispatch({ type: "LOG_OUT", payload: {} });
    navigate("/");
  });

  const { isLoading, execute } = handleLogout;

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <nav className="navbar navbar-dark bg-dark px-5">
        <div className={`${centerBetween} w-100`}>
          <Link className="navbar-brand h5" to="/">
            Energy-Market-Test
          </Link>

          {state.logged && (
            <div className="d-flex flex-row">
              <p className="text-light mx-3 h5">
                {state.user?.name && state.user.name.toUpperCase()}
                <img
                  src="/user.png"
                  alt="user"
                  style={{
                    margin: "0 10px",
                    marginBottom: "5px",
                    width: "30px",
                    height: "30px",
                  }}
                />
              </p>
              <p
                className="text-light h5"
                onClick={execute}
                style={{
                  cursor: "pointer",
                }}
              >
                {" "}
                Logout{" "}
              </p>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarComponent;
