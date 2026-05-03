import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      // Cloudinary public_id — needed to delete from cloud
      // When switching to AWS S3, store the S3 key here instead
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);