// import { useSearchParams } from "react-router-dom";
// import { useState } from "react";

// function SearchBar() {

//   const [params, setParams] = useSearchParams();
//   const [keyword, setKeyword] = useState("");

//   const handleSearch = (e) => {
//     e.preventDefault();

//     setParams({
//       page: 1,
//       category: params.get("category") || "",
//       sort: params.get("sort") || "",
//       search: keyword
//     });
//   };

//   return (
//     <form onSubmit={handleSearch} className="flex gap-2">
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         className="border px-3 py-1"
//       />

//       <button className="bg-blue-500 text-white px-3">
//         Search
//       </button>
//     </form>
//   );
// }

// export default SearchBar;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    // Always navigate to /products with search query
    navigate(`/products?search=${keyword}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border px-3 py-1"
      />
      <button className="bg-blue-500 text-white px-3">Search</button>
    </form>
  );
}

export default SearchBar;