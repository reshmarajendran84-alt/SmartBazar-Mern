import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Read directly from URL every render 
  const currentSearch = params.get("search") || "";
  const [keyword, setKeyword] = useState(currentSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    const p = new URLSearchParams();
    if (trimmed) p.set("search", trimmed);
    p.set("page", "1");
    navigate(`/products?${p.toString()}`);
  };

  const handleClear = () => {
    setKeyword("");
    navigate("/products");
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border px-3 py-1 w-full rounded pr-8"
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="bg-blue-500 text-white px-3 rounded">
        Search
      </button>
    </form>
  );
}

export default SearchBar;