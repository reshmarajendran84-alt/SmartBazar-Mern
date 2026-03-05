// import { useEffect, useState } from "react";
// import { getProducts } from "../services/productService";
// import ProductCard from "../components/ProductCard";

// const ProductListPage = () => {
//   const [products, setProducts] = useState([]);
// const[page,setPage]=useState(1);
// const [category,setCategory] =useState("");
//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const loadProducts = async () => {
//     try {
//       const { data } = await getProducts(page,category);
//       setProducts(data.products);
//       setTotalPages(data.totalPages); 
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="p-6 grid grid-cols-4 gap-4">
//       {products.map((product) => (
//         <ProductCard key={product._id} product={product} />
//       ))}
//     </div>
//   );
// };

// export default ProductListPage;

// import React from "react";

// const ProductListPage = () => {
//   const products = Array.from({ length: 6 }, (_, i) => ({
//     id: i,
//     name: `Product ${i + 1}`,
//     price: 999,
//     image: "https://via.placeholder.com/300",
//   }));

//   const categories = ["Electronics", "Fashion", "Shoes"];

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">

//       {/* Navbar */}
//       <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">LOGO</h1>

//         <div className="flex items-center gap-6">
//           <span>Categories</span>
//           <input
//             type="text"
//             placeholder="Search"
//             className="border rounded px-3 py-1"
//           />
//           <span>Cart</span>
//           <span>Profile</span>
//         </div>
//       </header>

//       {/* Main Section */}
//       <div className="flex flex-1 p-6 gap-6">

//         {/* Filters Sidebar */}
//         <aside className="w-64 bg-white rounded-lg shadow p-4">

//           <h2 className="font-semibold mb-3">Category</h2>

//           <div className="space-y-2">
//             {categories.map((cat, i) => (
//               <label key={i} className="flex items-center gap-2">
//                 <input type="checkbox" />
//                 {cat}
//               </label>
//             ))}
//           </div>

//           <h2 className="font-semibold mt-6 mb-3">Price Range</h2>

//           <div>
//             <input
//               type="range"
//               min="0"
//               max="5000"
//               className="w-full"
//             />
//             <p className="text-sm mt-1">₹0 — ₹5000</p>
//           </div>

//         </aside>

//         {/* Product Grid */}
//         <main className="flex-1">

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
//               >
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="h-48 w-full object-cover rounded"
//                 />

//                 <h3 className="mt-2 font-semibold">{product.name}</h3>

//                 <p className="text-blue-600 font-bold">
//                   ₹{product.price}
//                 </p>
//               </div>
//             ))}

//           </div>

//           {/* Pagination */}
//           <div className="flex justify-center gap-3 mt-8">

//             <button className="px-3 py-1 border rounded">1</button>
//             <button className="px-3 py-1 border rounded">2</button>
//             <button className="px-3 py-1 border rounded">3</button>
//             <button className="px-3 py-1 border rounded">4</button>

//           </div>

//         </main>

//       </div>

//       {/* Footer */}
//       <footer className="bg-white shadow-inner text-center py-4">
//         Footer
//       </footer>

//     </div>
//   );
// };

// export default ProductListPage;


import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await getProducts();
    setProducts(data.products);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow">

        <h2 className="font-bold mb-4">Categories</h2>

        <div className="space-y-2">
          <label className="flex gap-2">
            <input type="checkbox" />
            Electronics
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Fashion
          </label>

          <label className="flex gap-2">
            <input type="checkbox" />
            Shoes
          </label>
        </div>

        <h2 className="font-bold mt-6 mb-2">Price</h2>

        <input type="range" min="0" max="5000" className="w-full" />

      </aside>

      {/* Products */}
      <main className="flex-1 p-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

        </div>

      </main>

    </div>
  );
};

export default ProductListPage;