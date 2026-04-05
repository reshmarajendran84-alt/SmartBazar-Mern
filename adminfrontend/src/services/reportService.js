
import api from "../utils/api";

// Helper: build the Authorization header using the stored JWT token
// Every admin API call needs this header. We centralise it here.
const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ── MAIN SERVICE FUNCTION ──────────────────────────────────────────
// Fetches the sales report from the backend for the given date range.
//
// Parameters:
//   startDate  string  "YYYY-MM-DD"
//   endDate    string  "YYYY-MM-DD"
//
// Returns:
//   { summary, revenueByDate, topProducts }
//   (the shape comes from what the backend sends)
//
// Throws:
//   Error with a message string if the request fails.
//   The caller (hook) is responsible for catching it.

export const fetchSalesReport = async (startDate, endDate) => {
  // Build URL with query parameters
  // e.g. /api/admin/reports/sales?startDate=2024-01-01&endDate=2024-01-31
  const url = `http://localhost:5000/api/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  // fetch() does NOT throw on 4xx/5xx — we must check response.ok manually
  // response.ok = true only for 200-299 status codes
  if (!response.ok) {
    const errorData = await response.json();
    // Throw so the hook's catch() block receives a proper Error object
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  const result = await response.json();
  // result = { success: true, data: { summary, revenueByDate, topProducts } }

  // Return only the data — callers don't need the wrapper
  return result.data;
};

// You would add more service functions here as the feature grows:
// export const fetchProductReport = async (...) => { ... }
// export const exportReportToPDFServer = async (...) => { ... }