import Category  from "../models/Category.js";

class CategoryService{

async addCategory(data){ 
const category  =await Category.create(data);
return category;
}

async getCategory(){
    return (await Category.find({isActive:true})).sort({createAt:-1});
}
async updateCategory(id,data){
    return await Category.findByIdAndUpdate(id,data,{new:true});
}
async deleteCategory(id){
    return await Category.findByIdAndUpdate(
        id,
        {isActive:false},
        {new:true}

    );
}
}
export default new CategoryService();