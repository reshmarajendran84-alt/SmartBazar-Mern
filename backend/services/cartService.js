import Cart from "../models/cart";

export const addToCartService =async(userId,{productId,quantity,price})=>{
    let cart =await Cart.findOne({userId});
    if(!cart)cart =new Cart({userId,items:[]});
    const index = cart.items.findIndex(item=>item.productId.toSrting() === productId);
    if(index > -1 ){
        cart.items[index].quantity +=quantity;

    }else{
        cart.items.push({ productId,quantity,price});

    }
    cart.totalAmount =cart.items.reduce((total,item)=>total +item.quantity * item.price,0);
    await Cart.save();
    return cart;

};
 export const updateCartService =async (userId,{ productId ,quantity})=>{
    const cart =await Cart.findOne({userId});
    if(!cart) throw new Error("Cart not found");
    const item=cart.items.find(item=>item.productId.toString()=== productId);
    if(item) item.quantity =quantity;
    cart.totalAmount =cart.items.reduce((total,item)=>total +item.quantity * item.price,0);
    await cart.save();
    return cart;

 };
  
 export const removeFromCartService =async (userId,productId)=>{
    const cart =await Cart.findOne({userId});
    if(!cart) throw new Error("Cart not found");
    cart.items =cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalAmount=cart.items.reduce((total,item)=> total + item.quantity * item.price,0);
    await cart.save();
    return cart;

 };

 export const getCartService =async (userId)=>{
    const cart =await Cart.findOne({userId}).populate("items.productId");
    return cart;

 };
