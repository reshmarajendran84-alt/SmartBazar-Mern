import { useEffect, useState } from "react";
import { getCoupons, deleteCoupon } from "../services/counponService";
import CouponForm from "../components/CouponForm";
import CouponTable from "../components/CouponTable";
import { toast } from "react-toastify";

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await getCoupons();
      setCoupons(res.data);
    } catch {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleApplyCoupon=async()=>{
    try{
        const res = await validateCoupon({code:couponCode,subtotal});
        setDiscount(res.data.discount);
        toast.success("Coupon applied successfully");

    }catch(err){
        toast.error (err.response?.data?.message || "Invalid Coupon");
    }
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Coupons</h2>

        <button
          onClick={() => {
            setShowForm(true);
            setEditData(null);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Coupon
        </button>
      </div>

      {/* Table */}
      <CouponTable
        coupons={coupons}
        onEdit={(coupon) => {
          setEditData(coupon);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {/* Form Modal */}
      {showForm && (
        <CouponForm
          editData={editData}
          onClose={() => setShowForm(false)}
          onSuccess={fetchCoupons}
        />
      )}
    </div>
  );
};

export default CouponPage;