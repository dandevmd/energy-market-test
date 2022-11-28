import { OrderByDirection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AddProduct from "../components/AddProduct";
import NavbarComponent from "../components/NavbarComponent";
import ProductList from "../components/ProductList";
import SearchComponent from "../components/SearchComponent";
import { useProductContext } from "../context/productContext";

const HomePage = () => {
  const {state} = useProductContext()
  const [filterOrder, setFilterOrder] = useState<OrderByDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const onChangeQuery = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setSearchQuery(e.target.value.toLowerCase())
  setPage(1)
  }
  
  
  return (
    <>
      <NavbarComponent />
      <div className={" container-fluid mt-5"}>
        <div className="d-flex flex-row justify-content-center align-items-center my-2">
          <i>
            {" "}
            The search is automatic and implemented only for the title! Type at
            least one word.
          </i>
        </div>

        <SearchComponent onChangeQuery={onChangeQuery} />

        <div className="d-flex flex-row justify-content-around align-items-center">
          <AddProduct setPage={setPage} />

          <div className="me-5">
            <label htmlFor="price_order" className="mb-1">
              Sort by Price
            </label>
            <select
              className="form-select"
              onChange={(e) => (
                setFilterOrder(e.target.value as OrderByDirection), setPage(1)
              )}
              id="price_order"
            >
              <option value="desc">Descending</option>
              <option value="asc" selected>Ascending</option>
            </select>
          </div>
        </div>

        <ProductList
          filterOrder={filterOrder}
          searchQuery={searchQuery}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
};

export default HomePage;
