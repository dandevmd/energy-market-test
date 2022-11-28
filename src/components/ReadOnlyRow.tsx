import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Iproduct, useProductContext } from "../context/productContext";
import { db } from "../firebase.config";

interface IcomponentProps {
  p: Iproduct;
  handleEditMode: (
    e: React.MouseEvent<HTMLButtonElement>,
    elementId: string
  ) => void;
}

const ReadOnlyRow: React.FC<IcomponentProps> = ({ p, handleEditMode }) => {
  const { state, dispatch } = useProductContext();
  const navigate = useNavigate();

  const removeHandler = useAsyncHandler(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await deleteDoc(doc(db, "books", p.id));
      const newProductState =
        state.products && state.products.filter((i: Iproduct) => i.id !== p.id);
      dispatch({ type: "DELETE_ITEM", payload: newProductState });
      toast.success("Book deleted from list");
    }
  );
  const { execute: removeBook } = removeHandler;
  return (
    <>
      <td>{p.title}</td>
      <td>{p.author}</td>
      <td>{p.price} $</td>
      <td>
        <button
          className="btn btn-outline-warning"
          onClick={(e) => handleEditMode(e, p.id)}
        >
          Edit
        </button>

        <button
          className="btn btn-primary mx-3"
          onClick={() => navigate(`/product/${p.id.replace(/\s+/g, "-")}`)}
        >
          View
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={(e) => removeBook(e)}
        >
          Delete
        </button>
      </td>
    </>
  );
};

export default ReadOnlyRow;
