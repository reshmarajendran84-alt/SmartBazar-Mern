import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.get("search") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    // Preserve all existing filters, just update search + reset page
    const next = new URLSearchParams(params);
    const trimmed = keyword.trim();
    if (trimmed) next.set("search", trimmed);
    else next.delete("search");
    next.set("page", "1");
    navigate(`/products?${next.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-xl">
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1 border border-gray-300 px-4 py-2 rounded-l-lg focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <button className="bg-indigo-600 text-white px-4 rounded-r-lg">Search</button>
    </form>
  );
}

export default SearchBar;