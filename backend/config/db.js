// import mongoose from "mongoose";
// const connectDB =async()=>{
//     try {
//                 console.log(process.env.MONGO_URI);

//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected");
//     } catch(error){
//         console.log("MongoDB connection failed");
//     console.error(" MongoDB connection failed:", error);
//     process.exit(1);
//     }
// };
// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURL = "mongodb+srv://admin:admin123@cluster0.0osrwfv.mongodb.net/SmartBazar?retryWrites=true&w=majority";

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected directly");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
