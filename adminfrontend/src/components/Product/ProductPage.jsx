import { useEffect, useState } from "react";
import api from "../../utils/api";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadProducts = async () => {
    const res = await api.get("/admin/product");
    setProducts(res.data.products);
    console.log(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>

      <ProductForm
        editing={editing}
        onSuccess={() => {
          setEditing(null);
          loadProducts();
        }}
      />

      <ProductTable
        products={products}
        onEdit={setEditing}
        onDelete={loadProducts}
      />

    </div>
  );
};

export default ProductPage;