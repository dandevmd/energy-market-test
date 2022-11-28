import React, { SetStateAction } from "react";

interface IcomponentProps {
  onChangeQuery: (e:React.ChangeEvent<HTMLInputElement>)=>  void
}

const SearchComponent: React.FC<IcomponentProps> = ({
  onChangeQuery,
}) => {
  return (
    <div className="container d-flex justify-content-center mb-5 ">
      <div className="w-50 input-group mb-3  ">
        <input
          type="text"
          className="form-control remove_focus"
          placeholder="Search text..."
          onChange={(e) => onChangeQuery(e)}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
