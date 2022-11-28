import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import Spinner from "../components/Spinner";
import { useProductContext } from "../context/productContext";
import { db } from "../firebase.config";
import { centerBetween } from "../utilities";

const ProductDetailsPage = () => {
  const { state, dispatch } = useProductContext();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getSingle();
  }, [id]);

  const getSingleDoc = useAsyncHandler(async () => {
    if (id) {
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);

      docSnap.exists() &&
        dispatch({ type: "GET_ONE", payload: docSnap.data() });
    } else {
      navigate("*");
    }
  });
  const { isLoading, execute: getSingle } = getSingleDoc;

  return (
    <>
      <NavbarComponent />

      <div className="row mt-5 mx-5 d-flex justify-content-between">
        <div className="col-6">
          <div className=" d-flex justify-content-start align-items-center ">
            <img
              src="/book.png"
              alt="book"
              style={{
                objectFit: "cover",
                width: "50%",
                height: "50%",
              }}
            />
          </div>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="col-6 ">
            <div className=" card border rounded p-5">
              <div className={` ${centerBetween} mt-2`}>
                {" "}
                <p className="h4 fw-bold ">Title:</p>{" "}
                <p className="h4 fw-light  ">{state.product.title}</p>{" "}
              </div>
              <div className={` ${centerBetween} my-3`}>
                {" "}
                <p className="h4 fw-bold">Author:</p>{" "}
                <p className="h4 fw-lighter fst-italic ">
                  {state.product.author}
                </p>{" "}
              </div>
              <div className={`${centerBetween}`}>
                {" "}
                <p className="h4 fw-bold">Price:</p>{" "}
                <p className="h4 fw-lighter fst-italic ">
                  {state.product.price} $
                </p>{" "}
              </div>

              <div className="mt-5">
                <button className="form-control btn btn-outline-success">Buy now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailsPage;
