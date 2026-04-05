// backend/controllers/adminReportController.js
import ReportService from "../services/adminReportService.js";

class ReportController {
  // GET /api/admin/reports/sales?startDate=2024-01-01&endDate=2024-12-31
  static async getSalesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          message: "startDate and endDate are required query parameters.",
        });
      }

      const reportData = await ReportService.getSalesReport(startDate, endDate);

      res.status(200).json({
        success: true,
        data: reportData,
      });

    } catch (error) {
      console.error("ReportController Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to generate report. Please try again.",
      });
    }
  }
}

export default ReportController;