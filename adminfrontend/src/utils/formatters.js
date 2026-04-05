// FILE: src/utils/formatters.js
//
// WHY THIS FILE EXISTS:
//   Pure helper functions that have NO side effects and NO imports.
//   They take a value in → return a formatted value out. That's it.
//
//   This is the "util" layer in service-based architecture.
//   Any file in the project can import these without coupling anything.
//
// PURE FUNCTION = same input always gives same output, no external state.

// Format a number as Indian Rupee currency
// Input:  50000
// Output: "₹50,000"
export const formatCurrency = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
};

// Format an ISO date string to a readable format
// Input:  "2024-01-15"
// Output: "Jan 15, 2024"
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Get the first and last day of the current month as "YYYY-MM-DD" strings
// Used to pre-fill the date filter on page load
export const getCurrentMonthRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last  = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: first.toISOString().split("T")[0], // "2024-01-01"
    endDate:   last.toISOString().split("T")[0],  // "2024-01-31"
  };
};