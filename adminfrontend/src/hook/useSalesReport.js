import { useState } from "react";
import { fetchSalesReport } from "../services/reportService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function useSalesReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── GENERATE REPORT ─────────────────────────────────────────────
  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchSalesReport(startDate, endDate);
      setReportData(data || { summary: {}, revenueByDate: [], topProducts: [] });
    } catch (err) {
      console.error("Failed to fetch sales report:", err);
      setError(err.message || "Failed to fetch sales report.");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // ── DOWNLOAD PDF ────────────────────────────────────────────────
const downloadPDF = () => {
  if (!reportData) return;

  const doc = new jsPDF();
  const { summary } = reportData;

  // ── HEADER ─────────────────────────────────────────────────
  doc.setFillColor(79, 70, 229); // indigo
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Sales Report", 14, 18);

  // ── DATE RANGE ──────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Period: ${startDate}  to  ${endDate}`, 14, 25);

  // ── SUMMARY BOX ─────────────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(14, 34, 182, 28, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Total Revenue: Rs. ${(summary?.totalRevenue ?? 0).toFixed(2)}`, 20, 44);
  doc.text(`Total Orders: ${summary?.totalOrders ?? 0}`, 20, 52);
  doc.text(`Avg Order Value: Rs. ${(summary?.averageOrderValue ?? 0).toFixed(2)}`, 100, 44);

  // ── TOP PRODUCTS TABLE ───────────────────────────────────────
  if (reportData.topProducts.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text("Top Selling Products", 14, 74);

    autoTable(doc, {
      startY: 78,
      head: [["#", "Product", "Qty Sold", "Revenue (Rs.)"]],
      body: reportData.topProducts.map((p, i) => [
        i + 1,
        p.productName ?? "N/A",
        p.totalQuantitySold ?? 0,
        `Rs. ${(p.totalRevenue ?? 0).toFixed(2)}`,
      ]),
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [238, 242, 255],
      },
    });
  }

  // ── REVENUE BY DATE TABLE ────────────────────────────────────
  if (reportData.revenueByDate.length > 0) {
    const finalY = doc.lastAutoTable?.finalY || 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Revenue by Date", 14, finalY + 12);

    autoTable(doc, {
      startY: finalY + 16,
      head: [["Date", "Revenue (Rs.)"]],
      body: reportData.revenueByDate.map((d) => [
        d._id,
        `Rs. ${(d.revenue ?? 0).toFixed(2)}`,
      ]),
      styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [236, 253, 245] },
    });
  }

  doc.save(`sales-report-${startDate}-to-${endDate}.pdf`);
};
  // ── PRINT REPORT ───────────────────────────────────────────────
  const handlePrint = () => {
    if (!reportData) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Sales Report</title></head><body>");
    printWindow.document.write("<h1>Sales Report</h1>");

    const { summary } = reportData;
    printWindow.document.write(`<p>Total Revenue: ₹${summary?.totalRevenue?.toFixed(2) || 0}</p>`);
    printWindow.document.write(`<p>Total Orders: ${summary?.totalOrders || 0}</p>`);
    printWindow.document.write(`<p>Avg Order Value: ₹${summary?.averageOrderValue?.toFixed(2) || 0}</p>`);

    if (reportData.topProducts.length > 0) {
      printWindow.document.write("<h2>Top Products</h2><table border='1' cellpadding='5' cellspacing='0'>");
      printWindow.document.write("<tr><th>#</th><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr>");
      reportData.topProducts.forEach((p, i) => {
        printWindow.document.write(`<tr>
          <td>${i + 1}</td>
          <td>${p.productName}</td>
          <td>${p.totalQuantitySold}</td>
          <td>₹${p.totalRevenue.toFixed(2)}</td>
        </tr>`);
      });
      printWindow.document.write("</table>");
    }

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
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