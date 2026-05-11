import api from "../utils/api";

export const fetchSalesReport = async (startDate, endDate) => {
  const response = await api.get(
    `/reports/sales?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data.data;
};