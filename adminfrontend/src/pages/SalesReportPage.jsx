import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import useSalesReport from "../hook/useSalesReport";
import StatCard       from "../components/StartCard";
import { formatCurrency } from "../utils/formatters";

export default function SalesReport() {
  const {
    startDate, setStartDate,
    endDate,   setEndDate,
    reportData,
    loading,
    error,
    generateReport,
    downloadPDF,
    handlePrint,
  } = useSalesReport();

  const summary = reportData?.summary || {};
  const revenueByDate = reportData?.revenueByDate || [];
  const topProducts = reportData?.topProducts || [];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f4f6f8", minHeight: "100vh", padding: 24, color: "#1a1a2e" }}>

      {/* PAGE HEADER */}
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Sales Report</h1>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
        Filter by date range to view revenue, orders, and top products.
      </p>

      {/* FILTER BAR */}
      <div className="no-print" style={{
        background: "white", border: "1px solid #e2e8f0",
        borderRadius: 12, padding: "16px 20px",
        display: "flex", alignItems: "center",
        gap: 12, flexWrap: "wrap", marginBottom: 24,
      }}>
        <label style={{ fontSize: 13, color: "#64748b" }}>From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ border: "1px solid #cbd5e1", borderRadius: 6, padding: "6px 10px", fontSize: 13 }}
        />

        <label style={{ fontSize: 13, color: "#64748b" }}>To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ border: "1px solid #cbd5e1", borderRadius: 6, padding: "6px 10px", fontSize: 13 }}
        />

        <button onClick={generateReport} disabled={loading}
          style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Loading..." : "Generate Report"}
        </button>

        <button onClick={downloadPDF}
          style={{ background: "#ef4444", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Download PDF
        </button>

        <button onClick={handlePrint}
          style={{ background: "#0f766e", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Print
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
          {error}
        </p>
      )}

      {/* LOADING */}
      {loading && (
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
          Fetching report data...
        </p>
      )}

      {/* SUMMARY CARDS */}
      {reportData && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Revenue"    value={formatCurrency(summary.totalRevenue ?? 0)}    color="#059669" />
            <StatCard label="Total Orders"     value={summary.totalOrders ?? 0}                     color="#2563eb" />
            <StatCard label="Avg. Order Value" value={formatCurrency(summary.averageOrderValue ?? 0)} color="#7c3aed" />
          </div>

          {/* BAR CHART */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Revenue by Date</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="_id" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), "Revenue"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TOP PRODUCTS TABLE */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Top Selling Products</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  {["#", "Product", "Qty Sold", "Revenue"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, background: "#f8fafc" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product._id || index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: "#eef2ff", color: "#4f46e5", fontWeight: 700, borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                        {index + 1}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 500 }}>{product.productName ?? "N/A"}</td>
                    <td style={{ padding: "10px 12px", color: "#64748b" }}>{product.totalQuantitySold ?? 0} units</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#059669" }}>
                      {formatCurrency(product.totalRevenue ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {!reportData && !loading && !error && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>📋</p>
          <p style={{ fontSize: 15 }}>
            Select a date range and click <strong>Generate Report</strong>.
          </p>
        </div>
      )}

    </div>
  );
}