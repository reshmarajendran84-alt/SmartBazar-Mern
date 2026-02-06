import userService from "../services/AddressService.js";

class UserController {

  async getProfile(req, res) {
    const data = await userService.getProfile(req.user.id);
    res.json(data);
  }

  async updateProfile(req, res) {
    const data = await userService.updateProfile(req.user.id, req.body);
    res.json(data);
  }

  async getAddresses(req, res) {
    const data = await userService.getAddresses(req.user.id);
    res.json(data);
  }

  async addAddress(req, res) {
    const data = await userService.addAddress(req.user.id, req.body);
    res.json(data);
  }

  async updateAddress(req, res) {
    const data = await userService.updateAddress(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json(data);
  }

  async deleteAddress(req, res) {
    await userService.deleteAddress(req.user.id, req.params.id);
    res.json({ message: "Address deleted" });
  }

  async setDefaultAddress(req, res) {
    await userService.setDefaultAddress(req.user.id, req.params.id);
    res.json({ message: "Default address updated" });
  }
}

export default new UserController();