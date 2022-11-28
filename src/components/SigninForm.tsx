import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import Spinner from "./Spinner";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    if (emailError || passwordError || email === "" || password === "") {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
  }, [email, emailError, password, passwordError]);

  function validEmail(e: string) {
    var filter =
      /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search(filter) != -1;
  }

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (validEmail(e.target.value)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (e.target.value.length >= 6) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSubmit = useAsyncHandler(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const userIn = await signInWithEmailAndPassword(auth, email, password);
      //useEffect from app will grab the logged user
      navigate('/')
    }
  );

  const { isLoading, execute } = handleSubmit;

  

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <h1 className="mb-3 d-flex justify-content-center align-items-center">
        Sign in
      </h1>
      <form className="form-control p-5" onSubmit={(e) => execute(e)}>
        <div className="mb-3">
          {!emailError ? (
            <label htmlFor="email" className="form-label">
              Email address
            </label>
          ) : (
            <label htmlFor="email" className="form-label text-danger">
              You entered a wrong email.
            </label>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => handleChangeEmail(e)}
            placeholder="Enter email here..."
            className="form-control"
            id="email"
          />
        </div>
        <div className="mb-3">
          {!passwordError ? (
            <label htmlFor="email" className="form-label">
              Password
            </label>
          ) : (
            <label htmlFor="email" className="form-label text-danger">
              Password must be at least 6 character.
            </label>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => handleChangePassword(e)}
            className="form-control"
            placeholder="Enter password here..."
            id="password"
          />
        </div>
        <div className="mt-2 mb-3">
          You don't have an account?!{" "}
          <Link to="/sign-up">Go to register...</Link>
        </div>
        <button type="submit" disabled={!canSubmit} className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default SigninForm;
