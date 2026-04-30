import Banner from "../models/Banner.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";


const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "banners", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const { title, link, order } = req.body;
    // if (!title) {
    //   return res.status(400).json({ message: "Banner title is required" });
    // }

    // multer-storage-cloudinary already uploaded the file.
    // req.file.path    = secure Cloudinary URL
    // req.file.filename = public_id
    const banner = await Banner.create({
      title,
      imageUrl: req.file.path,
      publicId: req.file.filename,
      link: link || "",
      order: order ? parseInt(order) : 0,
    });

    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error("createBanner error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/banners  (admin — all banners)
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/banners/active  (public — homepage carousel)
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/banners/:id
const updateBanner = async (req, res) => {
  try {
    const { title, link, order, isActive } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // If a new image was uploaded, delete old one from Cloudinary first
    if (req.file) {
      await cloudinary.uploader.destroy(banner.publicId);
      banner.imageUrl = req.file.path;
      banner.publicId = req.file.filename;
    }

    if (title !== undefined) banner.title = title;
    if (link !== undefined) banner.link = link;
    if (order !== undefined) banner.order = parseInt(order);
    if (isActive !== undefined)
      banner.isActive = isActive === "true" || isActive === true;

    await banner.save();
    res.json({ message: "Banner updated successfully", banner });
  } catch (error) {
    console.error("updateBanner error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/banners/:id
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(banner.publicId);
    await banner.deleteOne();

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("deleteBanner error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  createBanner,
  getAllBanners,
  getActiveBanners,
  updateBanner,
  deleteBanner,
};