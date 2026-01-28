import User from "../models/User.js";

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Info
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Address
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    Object.assign(address, req.body);
    await user.save();
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    user.addresses.id(addressId).remove();
    await user.save();
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
