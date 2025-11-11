import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  //local state to hold user search input
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputValue.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchParams({ q: query });
    } else {
      navigate("/");
      setSearchParams({});
    }
  };

  return (
    <div
      className={`flex width-1/2 bg-gray-700/60 px-8 py-2 sm:w-40 md:w-104 lg:w-[40%] rounded-full transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:bg-gray-700 focus-within:sm:w-72 focus-within:md:w-[40rem]`}
    >
      <Search className={"text-purple-500"} />
      <div className={`px-4 w-full`}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Videos, Channels..."
            className={`w-full outline-none`}
            onChange={handleSearchChange}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
