import { useState, useEffect } from "react";
import { createCoupon, updateCoupon } from "../services/counponService";
import { toast } from "react-toastify";

const CouponForm = ({ editData, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    expiryDate: "",
    minOrderAmount: "",
    isActive: true,
  });

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        await updateCoupon(editData._id, form);
        toast.success("Coupon updated");
      } else {
        await createCoupon(form);
        toast.success("Coupon created");
      }

      onSuccess();
      onClose();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h3 className="text-xl font-semibold">
          {editData ? "Edit Coupon" : "Add Coupon"}
        </h3>

        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Coupon Code"
          className="w-full border p-2 rounded"
        />

        <input
          name="discountPercent"
          type="number"
          value={form.discountPercent}
          onChange={handleChange}
          placeholder="Discount %"
          className="w-full border p-2 rounded"
        />

        <input
          name="minOrderAmount"
          type="number"
          value={form.minOrderAmount}
          onChange={handleChange}
          placeholder="Min Order Amount"
          className="w-full border p-2 rounded"
        />

        <input
          name="expiryDate"
          type="date"
          value={form.expiryDate?.slice(0, 10)}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;