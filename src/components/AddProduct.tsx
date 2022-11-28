import {
  addDoc,
  collection,
  doc,
  getDoc,
  OrderByDirection,
  setDoc,
} from "firebase/firestore";
import React, { SetStateAction, useEffect, useState } from "react";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { toast } from "react-toastify";
import { Iproduct, useProductContext } from "../context/productContext";
import { db } from "../firebase.config";
import Spinner from "./Spinner";

const AddProduct = ({
  setPage,
}: {
  setPage: React.Dispatch<SetStateAction<number>>;
}) => {
  const { state, dispatch } = useProductContext();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const resetFields = () => {
    setTitle("");
    setAuthor("");
    setPrice("");
  };

  useEffect(() => {
    titleError ||
    authorError ||
    priceError ||
    title === "" ||
    author === "" ||
    price === ""
      ? setCanSubmit(false)
      : setCanSubmit(true);
  }, [titleError, authorError, priceError, resetFields]);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    e.target.value.length >= 3 ? setTitleError(false) : setTitleError(true);
  };

  const handleChangeAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);

    e.target.value.length >= 3 ? setAuthorError(false) : setAuthorError(true);
  };

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);

    e.target.value.length >= 1 ? setPriceError(false) : setPriceError(true);
  };

  const handleSubmit = useAsyncHandler(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      //check if exists
      const docRef = doc(db, "books", title.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return toast.error(`This book already exist.`);
      }

      const id = title.toLocaleLowerCase().replace(/\s+/g, "-");

      await setDoc(doc(db, "books", id), {
        title,
        author,
        price: Number(price),
      });

      //same thing. Let useEffect update the list
      dispatch({ type: "PRODUCT_LOADING", payload: true });

      setPage(1);
      toast.success(`${title} added to the list.`);
      resetFields();
    }
  );
  const { execute } = handleSubmit;

  return (
    <div className="mx-5">
      <form
        className="d-flex flex-row justify-content-start"
        onSubmit={(e) => execute(e)}
      >
        <div className="flex-column">
          {!titleError ? (
            <label htmlFor="title" className="form-label">
              Title
            </label>
          ) : (
            <label htmlFor="email" className="form-label text-danger">
              Title field is required.
            </label>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => handleChangeTitle(e)}
            className="form-control"
            placeholder="Enter title..."
            id="title"
          />
        </div>
        <div className="flex-column mx-5">
          {!authorError ? (
            <label htmlFor="author" className="form-label">
              Author
            </label>
          ) : (
            <label htmlFor="author" className="form-label text-danger">
              Author field is required.
            </label>
          )}
          <input
            type="text"
            value={author}
            onChange={(e) => handleChangeAuthor(e)}
            className="form-control"
            placeholder="Enter author..."
            id="author"
          />
        </div>
        <div className="flex-column ">
          {!priceError ? (
            <label htmlFor="price" className="form-label">
              Price
            </label>
          ) : (
            <label htmlFor="price" className="form-label text-danger">
              Price field is required.
            </label>
          )}
          <input
            type="text"
            value={price}
            onChange={(e) => handleChangePrice(e)}
            className="form-control"
            placeholder="Enter price..."
            id="price"
          />
        </div>
        <div className="flex-column align-self-end mx-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className=" btn btn-primary"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
