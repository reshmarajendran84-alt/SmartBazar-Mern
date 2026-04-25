import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

/* ─── helpers ──────────────────────────────────────────────────── */
const fmt = (amount) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(amount);

const statusColors = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  Shipped:   "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  Returned:  "bg-orange-50 text-orange-700 border-orange-200",
};

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PrintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

/* ─── Invoice rendered view ─────────────────────────────────────── */
const InvoiceView = ({ order, onDownload, downloading }) => {
  const address   = order.address || {};
  const items     = order.cartItems || [];
  const statusCls = statusColors[order.status] || "bg-stone-100 text-stone-600 border-stone-200";
  const orderId   = order._id?.slice(-8).toUpperCase();
  const date      = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="bg-stone-50 border-b border-stone-200 px-7 py-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-stone-400">
              <FileIcon />
              <span className="text-[11px] font-semibold tracking-widest uppercase">Invoice</span>
            </div>
            <p className="text-[22px] font-semibold text-stone-900 leading-tight">#{orderId}</p>
            <p className="text-[13px] text-stone-400 mt-0.5">Issued {date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full border ${statusCls}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {order.status}
            </span>
            <span className="text-[12px] text-stone-400">{order.paymentMethod} payment</span>
          </div>
        </div>

        {/* Address + Stats */}
        <div className="px-7 py-6 grid grid-cols-2 gap-6 border-b border-stone-100">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Ship to</p>
            <p className="text-[14px] font-semibold text-stone-800 mb-0.5">{address.fullName}</p>
            <p className="text-[13px] text-stone-500 leading-relaxed">
              {address.addressLine}<br />
              {address.city}, {address.state} – {address.pincode}
            </p>
            <p className="text-[13px] text-stone-500 mt-1.5">+91 {address.phone}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 content-start">
            <div className="bg-stone-50 rounded-xl px-4 py-3">
              <p className="text-[11px] text-stone-400 mb-1">Items</p>
              <p className="text-[18px] font-semibold text-stone-800">{items.length}</p>
            </div>
            <div className="bg-stone-50 rounded-xl px-4 py-3">
              <p className="text-[11px] text-stone-400 mb-1">Payment</p>
              <p className="text-[13px] font-semibold text-stone-800 truncate">{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="px-7">
          <table className="w-full text-[13px] border-collapse" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "45%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-stone-100">
                {["Item", "Qty", "Price", "Total"].map((h, i) => (
                  <th key={h} className={`py-3 text-[11px] font-semibold uppercase tracking-widest text-stone-400
                    ${i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-stone-50 last:border-0">
                  <td className="py-4 pr-2">
                    <p className="font-semibold text-stone-800 truncate">{item.name}</p>
                  </td>
                  <td className="py-4 text-center text-stone-500">{item.quantity}</td>
                  <td className="py-4 text-right text-stone-500">₹{fmt(item.price)}</td>
                  <td className="py-4 text-right font-semibold text-stone-800">
                    ₹{fmt(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-7 py-5 border-t border-stone-100 flex justify-end">
          <div className="w-56 space-y-2">
            {[
              { label: "Subtotal", value: order.subtotal },
              { label: "Shipping", value: order.shipping },
              { label: "Tax",      value: order.tax },
              ...(order.discount > 0 ? [{ label: "Discount", value: -order.discount }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-[13px]">
                <span className={label === "Discount" ? "text-emerald-600" : "text-stone-400"}>{label}</span>
                <span className={label === "Discount" ? "text-emerald-600" : "text-stone-700"}>
                  {label === "Discount" ? "-" : ""}₹{fmt(Math.abs(value))}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-stone-200 text-[15px] font-semibold">
              <span className="text-stone-800">Grand total</span>
              <span className="text-stone-900">₹{fmt(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-7 py-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[12px] text-stone-400">Thank you for your order.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <PrintIcon /> Print
            </button>
            <button
              onClick={onDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-stone-800 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors"
            >
              {downloading ? (
                <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <DownloadIcon />
              )}
              {downloading ? "Downloading…" : "Download PDF"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─── Page ──────────────────────────────────────────────────────── */
const InvoicePage = () => {
  const { orderId } = useParams();
  const [order, setOrder]         = useState(null);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Fetch order JSON to render the UI
  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/order/${orderId}`);          
      setOrder(data.order || data);
    } catch (err) {
      console.error("Error loading invoice:", err);
      setError("We couldn't load this invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // Download PDF blob from backend
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/order/invoice/${orderId}`, { responseType: "blob" });
      const url  = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `invoice_${orderId.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-stone-50">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-stone-200" />
        <div className="absolute inset-0 rounded-full border-2 border-t-stone-800 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-stone-400">
          <FileIcon />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-700">Preparing invoice…</p>
        <p className="text-xs text-stone-400 mt-1">Order #{orderId?.slice(-8).toUpperCase()}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-stone-50 px-4">
      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-center max-w-xs">
        <p className="text-sm font-semibold text-stone-800">Failed to load invoice</p>
        <p className="text-xs text-stone-400 mt-1 leading-relaxed">{error}</p>
      </div>
      <button onClick={fetchOrder}
        className="px-5 py-2 text-xs font-semibold text-stone-700 border border-stone-300 rounded-lg bg-white hover:bg-stone-50 transition-colors">
        Try again
      </button>
    </div>
  );

  return <InvoiceView order={order} onDownload={handleDownload} downloading={downloading} />;
};

export default InvoicePage;