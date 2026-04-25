import api from "../utils/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchSalesReport = async (startDate, endDate) => {
 
  const url = `http://localhost:5000/api/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  const result = await response.json();

  return result.data;
};

