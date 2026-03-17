import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
console.log("apikey,apisecret",process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET,)
cloudinary.config({
//   cloudinary.config(process.env.CLOUDINARY_URL);
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;