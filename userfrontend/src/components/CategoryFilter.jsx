import { useCategory } from "../context/CategoryContext";
import { useProduct } from "../context/ProductContext";

export default function CategoryFilter() {
  const { categories } = useCategory();
  const { setCategory, setPage } = useProduct();

  return (
    <select
      className="border p-2 mb-4"
      onChange={(e) => {
        setCategory(e.target.value);
        setPage(1);
      }}
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