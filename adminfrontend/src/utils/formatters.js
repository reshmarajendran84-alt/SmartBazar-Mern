export const formatCurrency = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last  = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: first.toISOString().split("T")[0], // "2024-01-01"
    endDate:   last.toISOString().split("T")[0],  // "2024-01-31"
  };
};