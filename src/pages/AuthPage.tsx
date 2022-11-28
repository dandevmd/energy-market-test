import React, { useState, useEffect } from "react";
import SigninForm from "../components/SigninForm";
import SignupForm from "../components/SignupForm";
import { useUserContext } from "../context/userContext";
import { centerCenter } from "../utilities";

const AuthPage = () => {
  const [loc, setLoc] = useState("");
  const {state} = useUserContext()

  useEffect(() => {
    setLoc(window.location.pathname);
  }, [window.location.href]);

  return (
    <div className={`${centerCenter}  vh-100`}>
      <div className="container-small ">
       
        {loc === "/sign-up" ? <SignupForm /> : <SigninForm />}
      </div>
    </div>
  );
};

export default AuthPage;
