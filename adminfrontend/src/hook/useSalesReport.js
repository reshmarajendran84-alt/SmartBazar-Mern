import { useState } from "react";
import { fetchSalesReport } from "../services/reportService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "../utils/formatters";

export default function useSalesReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchSalesReport(startDate, endDate);
      setReportData(data);
    } catch (err) {
      console.error("Report generation error:", err);
      setError(err.message || "Failed to fetch sales report.");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!reportData) return;
    const doc = new jsPDF({ orientation: "landscape" });
    const {
      summary,
      financialBreakdown,
      topProducts,
      orderDetails,
      revenueByDate,
      operationalMetrics,
    } = reportData;
    const pageW = doc.internal.pageSize.getWidth();

    const pdfCurrency = (val) =>
      `Rs. ${Number(val ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    // ── Header ──────────────────────────────────────────────────────────
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageW, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Sales Report", 14, 18);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 25);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - 50, 25);

    // ── Summary Box ──────────────────────────────────────────────────────
    doc.setTextColor(30, 30, 30);
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(14, 34, pageW - 28, 65, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text(`Total Revenue: ${pdfCurrency(summary?.totalRevenue)}`, 20, 44);
    doc.text(`Net Revenue: ${pdfCurrency(summary?.netRevenue)}`, 20, 52);
    doc.text(`Total Orders: ${summary?.totalOrders ?? 0}`, 20, 60);
    doc.text(`Products Sold: ${summary?.totalProductsSold ?? 0}`, 20, 68);
    doc.text(`Unique Customers: ${summary?.totalCustomers ?? 0}`, 20, 76);
    doc.text(`Avg Order Value: ${pdfCurrency(summary?.averageOrderValue)}`, 105, 44);
    doc.text(`Total Discount: ${pdfCurrency(summary?.totalDiscount)}`, 105, 52);
    doc.text(`Coupons Used: ${summary?.couponsUsed ?? 0}`, 105, 60);
    doc.text(`Delivery Rate: ${summary?.deliverySuccessRate ?? 0}%`, 105, 68);
    doc.text(`Return Rate: ${summary?.returnRate ?? 0}%`, 105, 76);
    doc.text(`Cancellation Rate: ${summary?.cancellationRate ?? 0}%`, 190, 44);
    doc.text(`Delivered: ${summary?.totalDelivered ?? 0}`, 190, 52);
    doc.text(`Cancelled: ${summary?.totalCancelled ?? 0}`, 190, 60);
    doc.text(`Returned: ${summary?.totalReturned ?? 0}`, 190, 68);
    doc.text(`Pending: ${summary?.totalPending ?? 0}`, 190, 76);

    let currentY = 108;

    // ── Status Breakdown ─────────────────────────────────────────────────
    if (operationalMetrics?.statusBreakdown) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Order Status Breakdown", 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Status", "Count", "Percentage"]],
        body: Object.entries(operationalMetrics.statusBreakdown).map(
          ([status, count]) => [
            status,
            count,
            `${((count / summary?.totalOrders) * 100).toFixed(1)}%`,
          ]
        ),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      });
      currentY = doc.lastAutoTable?.finalY + 10;
    }

    // ── Financial Breakdown ──────────────────────────────────────────────
    if (financialBreakdown) {
      if (currentY > 180) { doc.addPage(); currentY = 20; }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Financial Breakdown", 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Gross Revenue", "Discounts", "Shipping", "Tax", "Gateway Fees", "Net Revenue", "Margin"]],
        body: [[
          pdfCurrency(financialBreakdown.grossRevenue),
          pdfCurrency(financialBreakdown.totalDiscount),
          pdfCurrency(financialBreakdown.totalShippingCollected),
          pdfCurrency(financialBreakdown.totalTax),
          pdfCurrency(financialBreakdown.estimatedPaymentGatewayFees),
          pdfCurrency(financialBreakdown.netRevenue),
          `${financialBreakdown.profitMargin}%`,
        ]],
        styles: { fontSize: 8, cellPadding: 2.5 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      });
      currentY = doc.lastAutoTable?.finalY + 10;
    }

    // ── Top Products ─────────────────────────────────────────────────────
    if (topProducts?.length > 0) {
      if (currentY > 180) { doc.addPage(); currentY = 20; }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Top Selling Products", 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [["#", "Product", "Category", "Price", "Stock", "Sold", "Delivered", "Cancelled", "Returned", "Revenue"]],
        body: topProducts.map((p, i) => [
          i + 1,
          p.productName,
          p.category,
          pdfCurrency(p.currentPrice),
          p.currentStock,
          p.totalQuantitySold,
          p.deliveredCount || 0,
          p.cancelledCount || 0,
          p.returnCount || 0,
          pdfCurrency(p.totalRevenue),
        ]),
        styles: { fontSize: 7.5, cellPadding: 2 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        alternateRowStyles: { fillColor: [238, 242, 255] },
      });
      currentY = doc.lastAutoTable?.finalY + 10;
    }

    // ── Order Details ────────────────────────────────────────────────────
    if (orderDetails?.length > 0) {
      if (currentY > 180) { doc.addPage(); currentY = 20; }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Recent Orders", 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Order ID", "Date", "Customer", "Items", "Coupon & Discount", "Total", "Status", "Status Date"]],
        body: orderDetails.slice(0, 30).map((o) => {
          // ✅ o.coupon = coupon code (top-level), o.discount = rupee amount (top-level)
          const couponCode = o.coupon || o.pricing?.couponCode || "";
          const couponDiscount = o.discount || 0;

          const couponText = couponCode
            ? `${couponCode} (-${pdfCurrency(couponDiscount)})`
            : couponDiscount > 0
            ? `-${pdfCurrency(couponDiscount)}`
            : "-";

          return [
            o.orderNumber,
            formatDate(o.createdAt),
            `${o.customer.name}\n${o.customer.email}`,
            o.itemCount,
            couponText,
            pdfCurrency(o.pricing.total),
            o.status,
            o.deliveredAt
              ? formatDate(o.deliveredAt)
              : o.cancelledAt
              ? formatDate(o.cancelledAt)
              : o.returnedAt
              ? formatDate(o.returnedAt)
              : "-",
          ];
        }),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [15, 118, 110], textColor: 255 },
        alternateRowStyles: { fillColor: [236, 253, 245] },
      });
    }

    // ── Daily Revenue ────────────────────────────────────────────────────
    if (revenueByDate?.length > 0) {
      const yd = doc.lastAutoTable?.finalY ?? 200;
      if (yd > 250) { doc.addPage(); currentY = 20; }
      else { currentY = yd + 10; }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Daily Performance", 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [["Date", "Orders", "Delivered", "Cancelled", "Units Sold", "Revenue", "Avg Order"]],
        body: revenueByDate.map((d) => [
          formatDate(d._id),
          d.orders,
          d.delivered || 0,
          d.cancelled || 0,
          d.unitsSold,
          pdfCurrency(d.revenue),
          pdfCurrency(d.averageOrderValue),
        ]),
        styles: { fontSize: 7.5, cellPadding: 2 },
        headStyles: { fillColor: [5, 150, 105], textColor: 255 },
        alternateRowStyles: { fillColor: [236, 253, 245] },
      });
    }

    doc.save(`sales-report-${startDate}-to-${endDate}.pdf`);
  };

  // ── Print ────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!reportData) return;
    const {
      summary,
      financialBreakdown,
      topProducts,
      orderDetails,
      operationalMetrics,
    } = reportData;

    const productRows = (topProducts || [])
      .map(
        (p, i) => `
          <tr>
            <td class="print-td">${i + 1}</td>
            <td class="print-td"><strong>${p.productName}</strong><br><small>${p.category}</small></td>
            <td class="print-td">₹${p.currentPrice.toFixed(2)}</td>
            <td class="print-td">${p.currentStock}</td>
            <td class="print-td">${p.totalQuantitySold}</td>
            <td class="print-td">${p.deliveredCount || 0}</td>
            <td class="print-td">${p.cancelledCount || 0}</td>
            <td class="print-td">${p.returnCount || 0}</td>
            <td class="print-td">₹${p.totalRevenue.toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const orderRows = (orderDetails || [])
      .slice(0, 50)
      .map((o) => {
        // ✅ o.coupon = coupon code (top-level), o.discount = rupee amount (top-level)
        const couponCode = o.coupon || o.pricing?.couponCode || "";
        const couponDiscount = o.discount || 0;

        const couponCell = couponCode
          ? `<span class="coupon-badge">${couponCode}</span><br>
             <span style="color:#dc2626;font-weight:600;">-₹${Number(couponDiscount).toFixed(2)} off</span>`
          : couponDiscount > 0
          ? `<span style="color:#dc2626;font-weight:600;">-₹${Number(couponDiscount).toFixed(2)}</span>`
          : "—";

        return `
          <tr>
            <td class="print-td">${o.orderNumber}</td>
            <td class="print-td">${formatDate(o.createdAt)}</td>
            <td class="print-td">
              <strong>${o.customer.name}</strong><br>
              <small>${o.customer.email}</small><br>
              <small>📞 ${o.customer.phone}</small>
            </td>
            <td class="print-td">${o.itemCount} items<br><small>${o.totalQuantity} qty</small></td>
            <td class="print-td">${couponCell}</td>
            <td class="print-td">₹${o.pricing.total.toFixed(2)}</td>
            <td class="print-td">${o.paymentMethod}</td>
            <td class="print-td">
              <span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span>
            </td>
            <td class="print-td">
              ${
                o.deliveredAt
                  ? `✅ Delivered: ${formatDate(o.deliveredAt)}`
                  : o.cancelledAt
                  ? `❌ Cancelled: ${formatDate(o.cancelledAt)}`
                  : o.returnedAt
                  ? `↩️ Returned: ${formatDate(o.returnedAt)}`
                  : `⏳ ${o.status}`
              }
            </td>
            <td class="print-td">
              <small>${o.address.city}, ${o.address.state}<br>${o.address.pincode}</small>
            </td>
          </tr>
        `;
      })
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Report — ${startDate} to ${endDate}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            padding: 1.5rem;
            color: #1a1a2e;
            background: white;
          }
          .print-header {
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .print-title { font-size: 1.5rem; font-weight: bold; color: #4f46e5; margin-bottom: 0.25rem; }
          .print-period { color: #64748b; font-size: 0.8rem; }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 0.75rem;
            background: #eef2ff;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .stat-card { font-size: 0.75rem; }
          .stat-card strong { display: block; font-size: 1rem; color: #4f46e5; margin-bottom: 0.2rem; }
          .section-title {
            font-size: 1rem;
            font-weight: 600;
            color: #1e293b;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.4rem;
            border-bottom: 2px solid #e2e8f0;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
            font-size: 0.7rem;
          }
          .print-table th {
            background: #4f46e5;
            color: white;
            padding: 0.5rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.65rem;
            text-transform: uppercase;
          }
          .print-td {
            padding: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
          }
          .print-table tr:nth-child(even) .print-td { background: #f8fafc; }
          .status-badge {
            display: inline-block;
            padding: 0.2rem 0.4rem;
            border-radius: 9999px;
            font-size: 0.65rem;
            font-weight: 600;
          }
          .status-delivered  { background: #d1fae5; color: #065f46; }
          .status-cancelled  { background: #fee2e2; color: #991b1b; }
          .status-returned   { background: #fed7aa; color: #92400e; }
          .status-pending    { background: #fef3c7; color: #92400e; }
          .status-confirmed  { background: #bfdbfe; color: #1e40af; }
          .status-shipped    { background: #e0e7ff; color: #3730a3; }
          .coupon-badge {
            display: inline-block;
            background: #fef3c7;
            color: #d97706;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.65rem;
            font-weight: 600;
          }
          .print-footer {
            margin-top: 1.5rem;
            text-align: center;
            color: #64748b;
            font-size: 0.7rem;
            padding-top: 0.75rem;
            border-top: 1px solid #e2e8f0;
          }
          @media print {
            body { padding: 0.3in; }
            .print-table th {
              background: #4f46e5 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .stats-grid, .status-badge, .coupon-badge {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1 class="print-title">📊 Sales Report</h1>
            <p class="print-period">Period: <strong>${startDate}</strong> to <strong>${endDate}</strong></p>
          </div>
          <div class="print-period">Generated: ${new Date().toLocaleString()}</div>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><strong>₹${(summary?.totalRevenue || 0).toFixed(2)}</strong>Total Revenue</div>
          <div class="stat-card"><strong>₹${(summary?.netRevenue || 0).toFixed(2)}</strong>Net Revenue</div>
          <div class="stat-card"><strong>${summary?.totalOrders || 0}</strong>Total Orders</div>
          <div class="stat-card"><strong>${summary?.totalDelivered || 0}</strong>Delivered</div>
          <div class="stat-card"><strong>${summary?.totalCancelled || 0}</strong>Cancelled</div>
          <div class="stat-card"><strong>${summary?.totalReturned || 0}</strong>Returned</div>
          <div class="stat-card"><strong>${summary?.totalProductsSold || 0}</strong>Products Sold</div>
          <div class="stat-card"><strong>₹${(summary?.averageOrderValue || 0).toFixed(2)}</strong>Avg Order</div>
          <div class="stat-card"><strong>${summary?.deliverySuccessRate || 0}%</strong>Delivery Rate</div>
          <div class="stat-card"><strong>${summary?.returnRate || 0}%</strong>Return Rate</div>
        </div>

        <h2 class="section-title">💰 Financial Summary</h2>
        <div class="stats-grid" style="background:#f0fdf4;">
          <div class="stat-card"><strong>₹${(financialBreakdown?.grossRevenue || 0).toFixed(2)}</strong>Gross Revenue</div>
          <div class="stat-card"><strong>₹${(financialBreakdown?.totalDiscount || 0).toFixed(2)}</strong>Discounts</div>
          <div class="stat-card"><strong>₹${(financialBreakdown?.totalShippingCollected || 0).toFixed(2)}</strong>Shipping</div>
          <div class="stat-card"><strong>₹${(financialBreakdown?.totalTax || 0).toFixed(2)}</strong>Tax</div>
          <div class="stat-card"><strong>₹${(financialBreakdown?.estimatedPaymentGatewayFees || 0).toFixed(2)}</strong>Gateway Fees</div>
          <div class="stat-card"><strong>₹${(financialBreakdown?.netRevenue || 0).toFixed(2)}</strong>Net Revenue</div>
          <div class="stat-card"><strong>${financialBreakdown?.profitMargin || 0}%</strong>Profit Margin</div>
        </div>

        ${topProducts?.length > 0 ? `
          <h2 class="section-title">🏆 Top Selling Products</h2>
          <table class="print-table">
            <thead>
              <tr>
                <th>#</th><th>Product</th><th>Price</th><th>Stock</th>
                <th>Sold</th><th>Delivered</th><th>Cancelled</th><th>Returned</th><th>Revenue</th>
              </tr>
            </thead>
            <tbody>${productRows}</tbody>
          </table>
        ` : ""}

        ${orderDetails?.length > 0 ? `
          <h2 class="section-title">📋 Order Details (with Delivery/Cancellation Dates)</h2>
          <table class="print-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Date</th><th>Customer</th><th>Items</th>
                <th>Coupon &amp; Discount</th><th>Total</th><th>Payment</th>
                <th>Status</th><th>Status Date</th><th>Address</th>
              </tr>
            </thead>
            <tbody>${orderRows}</tbody>
          </table>
        ` : ""}

        <div class="print-footer">
          <p>This report includes all orders from ${startDate} to ${endDate}</p>
          <p style="margin-top: 0.3rem;">© ${new Date().getFullYear()} SmartBazar Store - All Rights Reserved</p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reportData,
    loading,
    error,
    generateReport,
    downloadPDF,
    handlePrint,
  };
}