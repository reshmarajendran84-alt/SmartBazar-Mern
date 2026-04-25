import { useCategory } from "../context/CategoryContext";

export default function CategoryFilter({ selected, onChange }) {
  const { categories } = useCategory();

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => onChange("")}
        className={`text-left px-3 py-2 rounded-xl text-sm transition
          ${selected === "" ? "bg-gray-900 text-white font-semibold" : "hover:bg-gray-50 text-gray-600"}`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          onClick={() => onChange(c._id)}
          className={`text-left px-3 py-2 rounded-xl text-sm transition
            ${selected === c._id ? "bg-gray-900 text-white font-semibold" : "hover:bg-gray-50 text-gray-600"}`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}