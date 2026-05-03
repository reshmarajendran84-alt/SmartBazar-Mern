import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllCoupons } from "../services/couponService"; // adjust import path if different

/**
 * AvailableCoupons
 *
 * Props:
 *  - subtotal        {number}  current cart subtotal (used to check eligibility)
 *  - appliedCoupon   {string|null}
 *  - onApply         {(code: string) => void}  called when user clicks "Apply"
 *  - onRemove        {() => void}              called when user clicks "Remove"
 */
const AvailableCoupons = ({ subtotal, appliedCoupon, onApply, onRemove }) => {
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
  const fetchCoupons = async () => {
  setLoading(true);
  try {
    const res = await getAllCoupons();
    console.log("RAW coupons from API:", res.data); 
    setCoupons(res.data?.coupons || []);
  } catch (err) {
    console.error("Failed to fetch coupons:", err);
    toast.error("Could not load coupons");
  } finally {
    setLoading(false);
  }
};
    fetchCoupons();
  }, [open]);

const isEligible = (coupon) => {
  if (coupon.minOrderAmount && Number(subtotal) < Number(coupon.minOrderAmount)) return false;
  return true;
};

const getDiscountLabel = (coupon) => `${coupon.discountPercent}% OFF`;


  return (
    <div className="mt-3 border border-dashed border-indigo-300 rounded-lg overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition text-sm font-medium text-indigo-700"
      >
        <span className="flex items-center gap-2">
          <span className="text-base">🏷️</span>
          View available coupons
        </span>
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* Coupon List */}
      {open && (
        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && coupons.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-5">
              No coupons available right now
            </p>
          )}

          {!loading &&
            coupons.map((coupon) => {
              const eligible = isEligible(coupon);
              const isApplied = appliedCoupon === coupon.code;

              return (
                <div
                  key={coupon._id || coupon.code}
                  className={`flex items-center justify-between px-4 py-3 transition ${
                    eligible ? "bg-white hover:bg-gray-50" : "bg-gray-50 opacity-60"
                  }`}
                >
                  {/* Left: Code + description */}
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded tracking-wide">
                        {coupon.code}
                      </span>
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        {getDiscountLabel(coupon)}
                      </span>
                    </div>

                    {coupon.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {coupon.description}
                      </p>
                    )}

                  {coupon.minOrderAmount > 0 && (
  <p className="text-xs text-gray-400 mt-0.5">
    Min. order: ₹{coupon.minOrderAmount}
    {!eligible && subtotal < coupon.minOrderAmount && (
      <span className="text-amber-500 ml-1">
        (need ₹{coupon.minOrderAmount - subtotal} more)
      </span>
    )}
  </p>
)}
                  </div>

                  {/* Right: Apply / Applied / Remove */}
                  <div className="shrink-0">
                    {isApplied ? (
                      <button
                        onClick={() => {
                          onRemove();
                          setOpen(false);
                        }}
                        className="text-xs text-red-500 border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition"
                      >
                        Remove
                      </button>
                    ) : eligible ? (
                      <button
                        onClick={() => {
                          onApply(coupon.code);
                          setOpen(false);
                        }}
                        className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                      >
                        Apply
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Not eligible
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default AvailableCoupons;