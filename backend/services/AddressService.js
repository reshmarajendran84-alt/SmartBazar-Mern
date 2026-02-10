import User from "../models/User.js";

class UserService {

  async getProfile(userId) { 

    return await User.findById(userId).select("-password");
}

  async updateProfile(userId, data) {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }

  async getAddresses(userId) {
    const user = await User.findById(userId).select("addresses");
    return user.addresses;
  }

  async addAddress(userId, addressData) {
    const user = await User.findById(userId);

    if (addressData.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push(addressData);
    await user.save();
    return user.addresses;
  }

  async updateAddress(userId, addressId, data) {
    const user = await User.findById(userId);
    const address = user.addresses.id(addressId);

    if (!address) throw new Error("Address not found");

    if (data.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    Object.assign(address, data);
    await user.save();
    return user.addresses;
  }

  async deleteAddress(userId, addressId) {
    await User.updateOne(
      { _id: userId },
      { $pull: { addresses: { _id: addressId } } }
    );
  }

  async setDefaultAddress(userId, addressId) {
    const user = await User.findById(userId);
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });
    await user.save();
  }
}

export default new UserService();