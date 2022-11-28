import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase.config";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [agree, setAgree] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      emailError ||
      nameError ||
      passwordError ||
      confirmPasswordError ||
      phoneError ||
      !agree ||
      email === "" ||
      name === "" ||
      password === "" ||
      confirmPassword === "" ||
      phone === ""
    ) {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
  }, [
    name,
    passwordError,
    confirmPassword,
    password,
    confirmPasswordError,
    phoneError,
    agree,
    email,
    name,
    password,
    confirmPassword,
    phone,
  ]);

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

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    if (!e.target.value.length) {
      setNameError(true);
    } else {
      setNameError(false);
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

  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (e.target.value.length >= 6 || password === confirmPassword) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (e.target.value.length >= 9) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };

  const handleSubmit = useAsyncHandler(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const u = await createUserWithEmailAndPassword(auth, email, password);
      if (u) {
        await setDoc(doc(db, "users", u?.user.uid), {
          email,
          name,
          phone,
        });

        navigate("/");
      }
    }
  );
  const { isLoading, execute } = handleSubmit;

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <h1 className="mb-3 d-flex justify-content-center align-items-center">
        Sign up
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
          className="form-control"
          id="email"
        />
      </div>{" "}
      <div className="mb-3">
        {!nameError ? (
          <label htmlFor="email" className="form-label">
            Name
          </label>
        ) : (
          <label htmlFor="email" className="form-label text-danger">
            Name is required
          </label>
        )}
        <input
          type="text"
          value={name}
          onChange={(e) => handleChangeName(e)}
          className="form-control"
          id="name"
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
          id="password"
        />
      </div>
      <div className="mb-3">
        {!confirmPasswordError ? (
          <label htmlFor="email" className="form-label">
            Confirm password
          </label>
        ) : (
          <label htmlFor="email" className="form-label text-danger">
            Confirm password does not match.
          </label>
        )}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => handleChangeConfirmPassword(e)}
          className="form-control"
          id="confirmPassword"
        />
      </div>
      <div className="mb-3">
        {!phoneError ? (
          <label htmlFor="email" className="form-label">
            Enter you phone number
          </label>
        ) : (
          <label htmlFor="email" className="form-label text-danger">
            Phone number must be at least 9 character.
          </label>
        )}
        <input
          type="text"
          value={phone}
          onChange={(e) => handleChangePhone(e)}
          className="form-control"
          id="phone"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="agreeCheck" className="form-label">
          Check if you agree out policy.
        </label>
        <input
          onChange={() => setAgree(!agree)}
          type="checkbox"
          className="form-check-input m-1"
          id="agreeCheck"
        />
      </div>
      <div className="mt-2 mb-3">
        Have an account already?! <Link to="/sign-in">Go to login...</Link>
      </div>
      <button type="submit" disabled={!canSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
    </>
  );
};

export default SignupForm;
