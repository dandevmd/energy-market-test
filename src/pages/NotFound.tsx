import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { centerCenter } from "../utilities";

const NotFound = () => {
  const { pathname } = useLocation();
  const [count, setCount] = useState(9);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount((currentCount: number) => --currentCount);
    }, 1000);

    count === 0 && navigate("/");

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className={`${centerCenter} flex-column vh-100`}>
      <div className="flex-row">
        <b className="h2">404:</b>{" "}
        <span className="h2 p-3"> {` "${pathname}"`} page is not found!</span>
      </div>
      <div className="d-flex flex-column mt-3">
        <span className="h2">You will be redirected to Home Page in...</span>{" "}
        <span className={`${centerCenter} text-danger h1`}>{count} seconds</span>
      </div>
    </div>
  );
};

export default NotFound;
