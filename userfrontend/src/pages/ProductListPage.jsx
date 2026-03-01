import { useProduct } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

const ProductListPage = () => {
  const { products, page, setPage, totalPages } = useProduct();

  return (
    <div className="p-4">

      <CategoryFilter />

      <div className="grid grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default ProductListPage;