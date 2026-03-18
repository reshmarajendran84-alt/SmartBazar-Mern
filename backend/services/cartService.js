import Cart from "../models/Cart.js";

class cartService{
async addToCart(userId, { productId, quantity, price }) {
  let cart = await Cart.findOne({ userId });

  if (!cart) cart = new Cart({ userId, items: [] });

  const index = cart.items.findIndex(
    item => item.productId.toString() === productId
  );

  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price });
  }

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  await cart.save();

  return cart;

}
 async updateCart  (userId,{ productId ,quantity}){
    const cart =await Cart.findOne({userId});
    if(!cart) throw new Error("Cart not found");
    const item=cart.items.find(item=>item.productId.toString()=== productId);
    if(item) item.quantity =quantity;
    cart.totalAmount =cart.items.reduce((total,item)=>total +item.quantity * item.price,0);
    await cart.save();
    return cart;

 }
  
 async removeFromCart(userId,productId){
    const cart =await Cart.findOne({userId});
    if(!cart) throw new Error("Cart not found");
    cart.items =cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalAmount=cart.items.reduce((total,item)=> total + item.quantity * item.price,0);
    await cart.save();
    return cart;

 }

  async getCart(userId){
    const cart =await Cart.findOne({userId}).populate("items.productId");
    return cart;

 }

}

export default new cartService();