import { useCategory } from "../context/CategoryContext";
import { useSearchParams } from "react-router-dom";

export default function CategoryFilter() {

  const { categories } = useCategory();
  const [params, setParams] = useSearchParams();

  const category = params.get("category") || "";
  // const search = params.get("search") || "";
  // const sort = params.get("sort") || "";

  const handleCategory = (value) => {
  //   setParams({
  //     page: 1,
  //     category: value,
  //     search,
  //     sort
  //   });
  // };
setParams((prev) => {
      const next = new URLSearchParams(prev); // ← preserve ALL existing params
      next.set("page", "1");                  // ← reset to page 1 as string
      if (value) {
        next.set("category", value);
      } else {
        next.delete("category");              // ← clean URL when "All" selected
      }
      return next;
    });
  };
  return (
    <select
      className="border p-2 mb-4"
      value={category}
      onChange={(e) => handleCategory(e.target.value)}
    >
      <option value="">All</option>

      {categories.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}

    </select>
  );
}