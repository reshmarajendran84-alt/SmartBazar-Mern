import { useState } from "react";
import { fetchSalesReport } from "../services/reportService";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
    doc.setFontSize(16);
    doc.text("Sales Report", 14, 20);

    // SUMMARY
    doc.setFontSize(12);
    const { summary } = reportData;
    doc.text(`Total Revenue: ₹${summary?.totalRevenue?.toFixed(2) || 0}`, 14, 30);
    doc.text(`Total Orders: ${summary?.totalOrders || 0}`, 14, 36);
    doc.text(`Avg Order Value: ₹${summary?.averageOrderValue?.toFixed(2) || 0}`, 14, 42);

    // TOP PRODUCTS
    if (reportData.topProducts.length > 0) {
      const tableColumn = ["#", "Product", "Qty Sold", "Revenue"];
      const tableRows = reportData.topProducts.map((p, index) => [
        index + 1,
        p.productName,
        p.totalQuantitySold,
        `₹${p.totalRevenue.toFixed(2)}`
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50
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