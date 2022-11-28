import {
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  limit,
  OrderByDirection,
  startAt,
  startAfter,
  endAt,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import React, { SetStateAction, useEffect, useState } from "react";
import { useAsyncHandler } from "react-hooks-async-handlers";
import { toast } from "react-toastify";
import { Iproduct, useProductContext } from "../context/productContext";
import { db } from "../firebase.config";
import { centerCenter } from "../utilities";
import EditRow from "./EditRow";
import ReadOnlyRow from "./ReadOnlyRow";
import Spinner from "./Spinner";

interface IcomponentProps {
  filterOrder: OrderByDirection;
  searchQuery: string;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
}

const ProductList: React.FC<IcomponentProps> = ({
  filterOrder,
  searchQuery,
  page,
  setPage,
}) => {
  const { state, dispatch } = useProductContext();
  const [editContactId, setEditContactId] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    dispatch({ type: "PRODUCT_LOADING", payload: false });

    if (searchQuery) {
      const timer = setTimeout(() => {
        getProductsbyQuery();
        setPage(1);
      }, 600);
      return () => clearTimeout(timer);
    }

    getAllProducts();
    getTotalCount();
  }, [state.productLoading, filterOrder, searchQuery]);

  useEffect(() => {
  
  }, []);

  const gettotalcount = useAsyncHandler(async () => {
    const coll = collection(db, "books");
    const query_ = query(coll);
    const snapshot = await getCountFromServer(query_);
    const count = snapshot.data().count;
    const totPg = Math.ceil(count / 5);
    setTotalPages(totPg)
  });

  const { execute: getTotalCount } = gettotalcount;

  const getproductsbyquery = useAsyncHandler(async () => {
    const coll = collection(db, "books");

    if (searchQuery) {
      const q = query(coll);
      const querySnapshot = await getDocs(q);
      const d: any = [];
      const matchQueryItem: Iproduct[] = [];
      querySnapshot.forEach((doc) => {
        let x = doc.data();
        x.id = doc.id;
        d.push(x);
      });

      d &&
        d.map((i: Iproduct) => {
          const tit = i.title.toLocaleLowerCase();
          const splitTitle = tit.split(" ");
          splitTitle.map((str: string) => {
            searchQuery === str && matchQueryItem.push(i);
          });
        });
      dispatch({ type: "GET_ALL", payload: matchQueryItem });
      return;
    }
  });
  const { isLoading: loadingProductsByQuery, execute: getProductsbyQuery } =
    getproductsbyquery;

  const getallproducts = useAsyncHandler(async () => {
    const q = query(
      collection(db, "books"),
      orderBy("price", filterOrder),
      limit(5)
    );
    const querySnapshot = await getDocs(q);

    const d: any = [];
    querySnapshot.forEach((doc) => {
      let x = doc.data();
      x.id = doc.id;
      d.push(x);
    });
    dispatch({ type: "GET_ALL", payload: d });
  });
  const { execute: getAllProducts, isLoading: loadingAllProducts } =
    getallproducts;

  const shownextpage = useAsyncHandler(async (item: Iproduct) => {
    const fetchNextData = async () => {
      const q = query(
        collection(db, "books"),
        orderBy("price", filterOrder),
        startAfter(item.price),
        limit(5)
      );
      const querySnapshot = await getDocs(q);

      const d: any = [];
      querySnapshot.forEach((doc) => {
        let x = doc.data();
        x.id = doc.id;
        d.push(x);
      });
      setPage(page + 1);
      dispatch({ type: "GET_ALL", payload: d.length > 0 && d });
    };
    fetchNextData();
  });
  const { isLoading: loadingPageChangeNext, execute: showNextPage } =
    shownextpage;

  const showprevtpage = useAsyncHandler(async (item: Iproduct) => {
    const fetchPrevData = async () => {
      const q = query(
        collection(db, "books"),
        orderBy("price", filterOrder),
        endBefore(item.price),
        limitToLast(5)
      );
      const querySnapshot = await getDocs(q);
      const d: any = [];
      querySnapshot.forEach((doc) => {
        let x = doc.data();
        x.id = doc.id;
        d.push(x);
      });
      setPage(page - 1);
      dispatch({ type: "GET_ALL", payload: d.length > 0 && d });
    };
    fetchPrevData();
  });
  const { isLoading: loadingPageChangePrev, execute: showPrevPage } =
    showprevtpage;

  const handleEditMode = (
    e: React.MouseEvent<HTMLButtonElement>,
    elementId: string
  ) => {
    e.preventDefault();
    setEditContactId(elementId);
  };

  return loadingProductsByQuery ||
    loadingPageChangeNext ||
    loadingPageChangePrev ||
    loadingAllProducts ? (
    <div className={`mt-5 ${centerCenter}`}>
      <Spinner />
    </div>
  ) : (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-center mx-5 mt-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Price</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <>
              {state && state.products ? (
                state.products.map((p: Iproduct, index) => (
                  <tr key={p.id}>
                    <>
                      {editContactId === p.id ? (
                        <EditRow p={p} setEditContactId={setEditContactId} />
                      ) : (
                        <ReadOnlyRow p={p} handleEditMode={handleEditMode} />
                      )}
                    </>
                  </tr>
                ))
              ) : (
                <div className="h5">No products at this moment.</div>
              )}
            </>
          </tbody>
        </table>
      </div>

      <div className={`${centerCenter} mt-3`}>
        {!searchQuery && !editContactId && (
          <ul className="pagination ">
            <li>
              <button
                className={!page ? "btn btn-dark" : "btn btn-outline-primary"}
                disabled={page === 1}
                onClick={() => showPrevPage(state.products[0])}
              >
                Previous
              </button>
            </li>
            <li className="mx-3">
              <button
                className={
                  state.products.length < 5
                    ? "btn btn-primary-dark"
                    : "btn btn-outline-primary"
                }
                onClick={() =>
                  showNextPage(state.products[state.products.length - 1])
                }
                disabled={page === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductList;
