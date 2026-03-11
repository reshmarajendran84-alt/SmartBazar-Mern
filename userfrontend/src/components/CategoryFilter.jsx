// import { useCategory } from "../context/CategoryContext";
// import { useProduct } from "../context/ProductContext";

// export default function CategoryFilter() {
//   const { categories } = useCategory();
//   const { setCategory, setPage } = useProduct();

//   return (
//     <select
//       className="border p-2 mb-4"
//       onChange={(e) => {
//         setCategory(e.target.value);
//         setPage(1);
//       }}
//     >
//       <option value="">All</option>

//       {categories.map((c) => (
//         <option key={c._id} value={c._id}>
//           {c.name}
//         </option>
//       ))}
//     </select>
//   );
// }



import { useCategory } from "../context/CategoryContext";
import { useSearchParams } from "react-router-dom";

export default function CategoryFilter() {

  const { categories } = useCategory();
  const [params, setParams] = useSearchParams();

  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "";

  const handleCategory = (value) => {
    setParams({
      page: 1,
      category: value,
      search,
      sort
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