import React from "react";

const CartItem = React.memo(({ item, onUpdate, onRemove }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <p>{item.productId.name}</p>
        <p>₹{item.price} x {item.quantity}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onUpdate(item.productId._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdate(item.productId._id, item.quantity + 1)}>+</button>
        <button onClick={() => onRemove(item.productId._id)}>Remove</button>
      </div>
    </div>
  );
});

export default CartItem;