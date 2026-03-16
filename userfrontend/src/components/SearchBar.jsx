import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    // Preserve all existing query params (category, sort, page)
    const params = new URLSearchParams(location.search);
    params.set("search", keyword);
    params.set("page", 1); // reset to page 1

    // Navigate to current path with updated query
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border px-3 py-1 w-full rounded"
      />
      <button className="bg-blue-500 text-white px-3 rounded">Search</button>
    </form>
  );
}

export default SearchBar;