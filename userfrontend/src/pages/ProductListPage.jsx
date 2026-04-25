import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import CategoryFilter from "../components/CategoryFilter";
import { getProducts } from "../services/productService";
import { toast } from "react-toastify";

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

// ── Star rating filter ───────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const options = [
    { value: 0,  label: "Any rating" },
    { value: 2,  stars: 2 },
    { value: 3,  stars: 3 },
    { value: 4,  stars: 4 },
    { value: 5,  stars: 5 },
  ];

  return (
    <div className="flex flex-col gap-1">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`
            flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl text-sm
            border transition-all duration-150
            ${value === opt.value
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "border-transparent hover:bg-gray-50 text-gray-600"
            }
          `}
        >
          <input
            type="radio"
            name="rating"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="hidden"
          />
          {opt.value === 0 ? (
            <span>Any rating</span>
          ) : (
            <>
              <span className="text-amber-400 tracking-wider">
                {"★".repeat(opt.stars)}
                <span className="text-gray-200">{"★".repeat(5 - opt.stars)}</span>
              </span>
              <span className="text-xs text-gray-400">
                {opt.value === 5 ? "5 only" : `${opt.value}+`}
              </span>
            </>
          )}
        </label>
      ))}
    </div>
  );
}

// ── Active filter badge ──────────────────────────────────────────────────────
function FilterBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full
                     bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
      {label}
      <button onClick={onRemove} className="ml-1 hover:text-indigo-900 text-indigo-400">✕</button>
    </span>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // All filters live in URL so they survive page refresh & share links
  const page     = Number(searchParams.get("page"))   || 1;
  const category = searchParams.get("category")       || "";
  const search   = searchParams.get("search")         || "";
  const sort     = searchParams.get("sort")           || "";
  const price    = Number(searchParams.get("price"))  || 200000;
  const rating   = Number(searchParams.get("rating")) || 0;  

  const [searchInput, setSearchInput]   = useState(search);
  const [loading, setLoading]           = useState(false);
  const [products, setProducts]         = useState([]);
  const [totalPages, setTotalPages]     = useState(1);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
const [priceInput, setPriceInput] = useState(price);
useEffect(() => {
  setPriceInput(price);
}, [price]);
  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts([]);
      const { data } = await getProducts({ page, category, search, sort, price:price < 200000 ?price :"", rating :rating >0 ?rating :"" });
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, category, search, sort, price, rating]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // ── Param helpers ──────────────────────────────────────────────────────────
  const setParam = (key, value) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
    if (value !== "" && value !== null && value !== undefined) {
        p.set(key, value);
      } else {
        p.delete(key);
      }
      p.set("page", 1); // reset page on any filter change
      return p;
    });
  };

  const handleSearch = () => setParam("search", searchInput.trim());
  const handleSort     = (val) => setParam("sort",     val);
  const handleCategory = (val) => setParam("category", val);
// const handlePrice = (val) => setParam("price", val < 200000 ? val : "");
  const handleRating   = (val) => setParam("rating",   val ); 
   const handlePrice = (val) => {
  if (val < 200000) {
    setParam("price", String(val)); // ← String("0") is truthy, won't get deleted
  } else {
    setParam("price", "");          // ← remove filter at max value
  }
};

  const handlePage = (newPage) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", newPage);
      return p;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchParams({});
    setSidebarOpen(false);
  };

  const hasFilters = search || category || sort || price < 200000 || rating > 0;
  const isEmpty    = !loading && products.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Mobile topbar ──────────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between
                      bg-white border-b px-4 py-3 shadow-sm">
        <h1 className="font-bold text-gray-800 text-base">Products</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium
                     border border-indigo-200 px-3 py-1.5 rounded-full
                     hover:bg-indigo-50 transition"
        >
          ☰ Filters
          {hasFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 ml-1" />
          )}
        </button>
      </div>

      <div className="flex">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed lg:static top-0 left-0 z-50
          w-72 lg:w-64 xl:w-72
          h-full lg:h-auto lg:min-h-screen
          bg-white border-r border-gray-200
          flex flex-col gap-6
          p-6 overflow-y-auto
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          {/* Mobile close */}
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="font-bold text-gray-800 text-base">Filters</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {/* Search */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Search</p>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={handleSearch}
                className="bg-gray-900 text-white text-sm px-3 py-2 rounded-xl hover:bg-gray-700 transition"
              >
                Go
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Category</p>
            {/* Pass selectedCategory and onChange into your existing CategoryFilter */}
            <CategoryFilter selected={category} onChange={handleCategory} />
          </div>

          {/* Price */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Max Price</p>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>₹0</span>
              <span className="font-semibold text-gray-800">₹{price.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={100}
              value={priceInput}
                  onChange={(e) => setPriceInput(Number(e.target.value))}  // ← only update display
              onChange={(e) => handlePrice(Number(e.target.value))}
                  onTouchEnd={(e) => handlePrice(Number(e.target.value))}  // ← mobile support

              className="w-full accent-gray-900 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>₹0</span><span>₹200,000</span>
            </div>
          </div>

          {/* Rating ✅ */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Min Rating</p>
            <StarRating value={rating} onChange={handleRating} />
          </div>

          {/* Sort (desktop only in sidebar) */}
          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Sort By</p>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                         text-gray-700 bg-white focus:outline-none focus:ring-2
                         focus:ring-indigo-300 cursor-pointer"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 border border-red-200 py-2 rounded-xl
                         hover:bg-red-50 transition font-medium"
            >
              Clear All Filters
            </button>
          )}
        </aside>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">

          {/* Topbar (desktop: sort + count) */}
          <div className="hidden lg:flex items-center justify-between mb-5">
            <p className="text-sm text-gray-400">
              {loading ? "Loading..." : (
                <>
                  <span className="text-gray-700 font-semibold">{products.length}</span>
                  {" product"}{products.length !== 1 ? "s" : ""}
                  {search && <> for "<span className="text-indigo-600">{search}</span>"</>}
                </>
              )}
            </p>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
            >
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          {/* Active filter badges */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search   && <FilterBadge label={`"${search}"`}          onRemove={() => { setSearchInput(""); setParam("search", ""); }} />}
              {category && <FilterBadge label={`Category`}             onRemove={() => handleCategory("")} />}
              {price < 200000 && <FilterBadge label={`≤ ₹${price.toLocaleString()}`} onRemove={() => handlePrice(200000)} />}
              {rating > 0 && <FilterBadge label={`${rating}★ & up`}   onRemove={() => handleRating(0)} />}
              {sort     && <FilterBadge label={sort === "price_asc" ? "Price ↑" : "Price ↓"} onRemove={() => handleSort("")} />}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3">
              <div className="text-5xl">🔍</div>
              <p className="text-gray-600 font-semibold text-lg">No products found</p>
              <p className="text-gray-400 text-sm">Try adjusting or clearing your filters</p>
              {hasFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-sm font-medium text-indigo-600 border border-indigo-200
                             px-5 py-2 rounded-full hover:bg-indigo-50 transition"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination page={page} setPage={handlePage} pages={totalPages} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;