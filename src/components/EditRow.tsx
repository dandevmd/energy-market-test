import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { toast } from "react-toastify";
import { Iproduct, useProductContext } from "../context/productContext";
import { db } from "../firebase.config";

interface IcomponentProps {
  p: Iproduct;
  setEditContactId: React.Dispatch<React.SetStateAction<string>>;
}

const errorInputColor = "#f7d4d8";

const EditRow: React.FC<IcomponentProps> = ({ p, setEditContactId }) => {
  const { dispatch } = useProductContext();
  const [title, setTitle] = useState(p.title || "");
  const [author, setAuthor] = useState(p.author || "");
  const [price, setPrice] = useState(p.price || "");
  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    titleError ||
    authorError ||
    priceError ||
    title === "" ||
    author === "" ||
    price === ""
      ? setCanSubmit(false)
      : setCanSubmit(true);
  }, [titleError, authorError, priceError]);

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
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const updated = doc(db, "books", p.id);

      await updateDoc(updated, {
        title,
        author,
        price,
      });

      //same thing. Let useEffect update the list
      dispatch({ type: "PRODUCT_LOADING", payload: true });
      setEditContactId("");
      toast.success(`${p.title} updated successfully`);
    }
  );
  const { execute: editProduct } = handleSubmit;

  return (
    <>
      <td>
        <input
          type="text"
          value={title}
          onChange={(e) => handleChangeTitle(e)}
          className="form-control"
          style={{
            backgroundColor: `${titleError ? errorInputColor : "white"}`,
          }}
          placeholder="Enter title..."
          id="title"
        />
      </td>
      <td>
        <input
          type="text"
          value={author}
          onChange={(e) => handleChangeAuthor(e)}
          className="form-control"
          style={{
            backgroundColor: `${authorError ? errorInputColor : "white"}`,
          }}
          placeholder="Enter author..."
          id="author"
        />
      </td>
      <td>
        <input
          type="text"
          value={price}
          onChange={(e) => handleChangePrice(e)}
          className="form-control"
          style={{
            backgroundColor: `${priceError ? errorInputColor : "white"}`,
          }}
          placeholder="Enter price..."
          id="price"
        />
      </td>
      <td>
        <button
          className="btn btn-danger"
          disabled={!canSubmit}
          onClick={(e) => editProduct(e)}
        >
          {" "}
          Save{" "}
        </button>
        <button
          className="btn btn-warning mx-3"
          onClick={() => setEditContactId("")}
        >
          Cancel
        </button>
      </td>
    </>
  );
};

export default EditRow;
