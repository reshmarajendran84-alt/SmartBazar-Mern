import React from "react";

const CartItem = React.memo(({ item, onUpdate, onRemove }) => {
  // Works for both DB items (productId = object) and guest items (productId = string)
  const name  = item.productId?.name  ?? item.name  ?? "Product";
  const id    = item.productId?._id   ?? item.productId;  // string ID for guest

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdate(id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          −
        </button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdate(id, item.quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
        <button
          onClick={() => onRemove(id)}
          className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

export default CartItem;