import useSalesReport from "../hook/useSalesReport";
import { formatDate, formatCurrency } from "../utils/formatters";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function SalesReportPage() {
  const [chartType, setChartType] = useState("line");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
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
  } = useSalesReport();

  const getChartData = () => {
    if (!reportData?.revenueByDate) return [];
    return reportData.revenueByDate.map(item => ({
      date: formatDate(item._id),
      revenue: item.revenue || 0,
      orders: item.orders || 0,
      delivered: item.delivered || 0,
      cancelled: item.cancelled || 0,
    }));
  };

  // Export to Excel
  const exportExcel = () => {
    if (!reportData) return;

    const summaryData = [{
      "Total Revenue": reportData.summary?.totalRevenue || 0,
      "Net Revenue": reportData.summary?.netRevenue || 0,
      "Total Orders": reportData.summary?.totalOrders || 0,
      "Delivered": reportData.summary?.totalDelivered || 0,
      "Cancelled": reportData.summary?.totalCancelled || 0,
      "Returned": reportData.summary?.totalReturned || 0,
      "Products Sold": reportData.summary?.totalProductsSold || 0,
      "Avg Order Value": reportData.summary?.averageOrderValue || 0,
      "Delivery Rate": `${reportData.summary?.deliverySuccessRate || 0}%`,
      "Return Rate": `${reportData.summary?.returnRate || 0}%`,
    }];

    const dailyData = (reportData.revenueByDate || []).map(item => ({
      Date: formatDate(item._id),
      Orders: item.orders || 0,
      Revenue: item.revenue || 0,
      Delivered: item.delivered || 0,
      Cancelled: item.cancelled || 0,
      "Units Sold": item.unitsSold || 0,
      "Avg Order Value": item.averageOrderValue || 0,
    }));

    const productsData = (reportData.topProducts || []).map(p => ({
      "Product Name": p.productName,
      Category: p.category,
      Price: p.currentPrice,
      Stock: p.currentStock,
      "Quantity Sold": p.totalQuantitySold,
      Delivered: p.deliveredCount || 0,
      Cancelled: p.cancelledCount || 0,
      Returned: p.returnCount || 0,
      Revenue: p.totalRevenue,
    }));

    const ordersData = (reportData.orderDetails || []).slice(0, 500).map(o => ({
      "Order ID": o.orderNumber,
      Date: formatDate(o.createdAt),
      Customer: o.customer.name,
      Email: o.customer.email,
      Phone: o.customer.phone,
      Items: o.itemCount,
      "Total Quantity": o.totalQuantity,
      Coupon: o.pricing.couponCode || "",
  "Coupon Code": o.coupon || "",           
  "Coupon Discount": o.discount || 0, 
  "Total": o.pricing.total,
      "Payment Method": o.paymentMethod,
      Status: o.status,
      "Status Date": o.deliveredAt ? formatDate(o.deliveredAt) : (o.cancelledAt ? formatDate(o.cancelledAt) : ""),
      City: o.address.city,
      State: o.address.state,
      Pincode: o.address.pincode,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), "Summary");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dailyData), "Daily Sales");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(productsData), "Top Products");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ordersData), "Orders");
    XLSX.writeFile(workbook, `sales_report_${startDate}_to_${endDate}.xlsx`);
  };

  const chartData = getChartData();
  const COLORS = ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Responsive Padding */}
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        
        {/* Header - Responsive */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 mb-1 sm:mb-2">
            Sales Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Complete order analytics with delivery & cancellation tracking
          </p>
        </div>

        {/* Date Range Selector - Responsive Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={generateReport}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-indigo-600"></div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500">Generating report...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Report Results */}
        {reportData && !loading && (
          <div>
            {/* Action Buttons - Responsive Wrap */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button
                onClick={downloadPDF}
                className="flex-1 sm:flex-none bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm"
              >
                <span>📄</span> PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none bg-gray-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm"
              >
                <span>🖨️</span> Print
              </button>
              <button
                onClick={exportExcel}
                className="flex-1 sm:flex-none bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm"
              >
                <span>📊</span> Excel
              </button>
            </div>

            {/* Summary Cards - Responsive Grid (2 cols mobile, 4 cols tablet, 5 cols desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Total Revenue</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-indigo-600 truncate">
                  {formatCurrency(reportData.summary?.totalRevenue)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Net Revenue</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-green-600 truncate">
                  {formatCurrency(reportData.summary?.netRevenue)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Orders</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-blue-600">
                  {reportData.summary?.totalOrders}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Delivered</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-emerald-600">
                  {reportData.summary?.totalDelivered}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Cancelled</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-red-600">
                  {reportData.summary?.totalCancelled}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Returned</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-orange-600">
                  {reportData.summary?.totalReturned}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Products Sold</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-purple-600">
                  {reportData.summary?.totalProductsSold}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Avg Order</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-cyan-600 truncate">
                  {formatCurrency(reportData.summary?.averageOrderValue)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Delivery Rate</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-emerald-600">
                  {reportData.summary?.deliverySuccessRate}%
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-2 sm:p-3">
                <div className="text-[10px] sm:text-xs text-gray-500">Return Rate</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-red-600">
                  {reportData.summary?.returnRate}%
                </div>
              </div>
            </div>

            {/* Chart Section - Responsive */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">📈 Revenue Trend</h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setChartType("line")}
                      className={`flex-1 sm:flex-none px-3 py-1 text-xs sm:text-sm rounded ${chartType === "line" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                      Line Chart
                    </button>
                    <button
                      onClick={() => setChartType("bar")}
                      className={`flex-1 sm:flex-none px-3 py-1 text-xs sm:text-sm rounded ${chartType === "bar" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                      Bar Chart
                    </button>
                  </div>
                </div>
                <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} name="Revenue" />
                        <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
                        <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
                        <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Status Breakdown - Responsive */}
            {reportData.operationalMetrics?.statusBreakdown && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6 overflow-hidden">
                <div className="px-4 sm:px-6 py-2 sm:py-3 border-b bg-gray-50">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">📊 Order Status Breakdown</h2>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="w-full h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(reportData.operationalMetrics.statusBreakdown).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.entries(reportData.operationalMetrics.statusBreakdown).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mt-3 sm:mt-4">
                    {Object.entries(reportData.operationalMetrics.statusBreakdown).map(([status, count]) => (
                      <div key={status} className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg sm:text-2xl font-bold" style={{
                          color: status === 'Delivered' ? '#10b981' :
                                 status === 'Cancelled' ? '#ef4444' :
                                 status === 'Returned' ? '#f59e0b' : '#3b82f6'
                        }}>{count}</div>
                        <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">{status}</div>
                        <div className="text-[9px] sm:text-xs text-gray-400">{((count / reportData.summary?.totalOrders) * 100).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Financial Breakdown - Responsive Grid */}
            {reportData.financialBreakdown && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6 overflow-hidden">
                <div className="px-4 sm:px-6 py-2 sm:py-3 border-b bg-gray-50">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">💰 Financial Breakdown</h2>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="text-[10px] sm:text-xs text-gray-500">Gross Revenue</div>
                      <div className="text-sm sm:text-base font-semibold">{formatCurrency(reportData.financialBreakdown.grossRevenue)}</div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="text-[10px] sm:text-xs text-gray-500">Discounts</div>
                      <div className="text-sm sm:text-base font-semibold text-red-600">-{formatCurrency(reportData.financialBreakdown.totalDiscount)}</div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="text-[10px] sm:text-xs text-gray-500">Shipping</div>
                      <div className="text-sm sm:text-base font-semibold">{formatCurrency(reportData.financialBreakdown.totalShippingCollected)}</div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="text-[10px] sm:text-xs text-gray-500">Tax</div>
                      <div className="text-sm sm:text-base font-semibold">{formatCurrency(reportData.financialBreakdown.totalTax)}</div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="text-[10px] sm:text-xs text-gray-500">Gateway Fees</div>
                      <div className="text-sm sm:text-base font-semibold text-orange-600">{formatCurrency(reportData.financialBreakdown.estimatedPaymentGatewayFees)}</div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="text-[10px] sm:text-xs text-gray-500">Net Revenue</div>
                      <div className="text-sm sm:text-base font-semibold text-green-600">{formatCurrency(reportData.financialBreakdown.netRevenue)}</div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="text-[10px] sm:text-xs text-gray-500">Profit Margin</div>
                      <div className="text-sm sm:text-base font-semibold text-emerald-600">{reportData.financialBreakdown.profitMargin}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Products Table - Horizontal Scroll on Mobile */}
            {reportData.topProducts?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6 overflow-hidden">
                <div className="px-4 sm:px-6 py-2 sm:py-3 border-b bg-gray-50">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">🏆 Top Selling Products</h2>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Sales, delivery, cancellation & return breakdown</p>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] sm:min-w-full">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-indigo-600 text-white">
                        <tr>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">#</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Product</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Price</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Stock</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Sold</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Delivered</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Cancelled</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Returned</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.topProducts.map((p, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs">{i+1}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                              <div className="font-medium text-xs sm:text-sm">{p.productName}</div>
                              <div className="text-[10px] sm:text-xs text-gray-500">{p.category}</div>
                            </td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs">{formatCurrency(p.currentPrice)}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-xs">{p.currentStock}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right font-semibold text-xs">{p.totalQuantitySold}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-green-600 text-xs">{p.deliveredCount || 0}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-red-600 text-xs">{p.cancelledCount || 0}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right text-orange-600 text-xs">{p.returnCount || 0}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right font-bold text-green-600 text-xs">{formatCurrency(p.totalRevenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Order Details Table - Horizontal Scroll on Mobile */}
            {reportData.orderDetails?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 py-2 sm:py-3 border-b bg-gray-50">
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">📋 Order Details</h2>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Complete order information with delivery/cancellation dates & addresses</p>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px] lg:min-w-full">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-teal-600 text-white">
                        <tr>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Order ID</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Date</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Customer</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Items</th>
                          {/* <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Coupon</th> */}
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">Total</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Status</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Status Date</th>
                          <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left">Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.orderDetails.slice(0, 30).map((o, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs">{o.orderNumber}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs">{formatDate(o.createdAt)}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                              <div className="font-medium text-xs">{o.customer.name}</div>
                              <div className="text-[9px] sm:text-xs text-gray-500">{o.customer.email}</div>
                              <div className="text-[9px] sm:text-xs text-gray-400">📞 {o.customer.phone}</div>
                            </td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right">
                              <div className="text-xs">{o.itemCount} items</div>
                              <div className="text-[9px] sm:text-xs text-gray-500">{o.totalQuantity} qty</div>
                            </td>
   <td className="px-2 sm:px-3 py-1.5 sm:py-2">
  {(() => {
    const couponCode = o.coupon || o.pricing?.couponCode || "";
    // discount is top-level in your order model, not inside pricing
    const couponDiscount = o.discount || 0;

    return couponCode ? (
      <div className="space-y-0.5">
        <span className="px-1.5 sm:px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] sm:text-xs font-mono">
          {couponCode}
        </span>
       <div className="text-[9px] sm:text-xs text-red-600 font-medium">
          -{formatCurrency(couponDiscount)}
        </div>
{/*          ({o.discountPercent || ""}% off)
        </div> */}
      </div>
    ) : couponDiscount > 0 ? (
      <div className="text-[9px] sm:text-xs text-red-600">
        -{formatCurrency(couponDiscount)}
      </div>
    ) : "—";
  })()}
</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-right font-bold text-xs">{formatCurrency(o.pricing.total)}</td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2">
                              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium capitalize ${
                                o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                o.status === 'Returned' ? 'bg-orange-100 text-orange-800' :
                                o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>{o.status}</span>
                            </td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs">
                              {o.deliveredAt && <div className="text-green-600">✅ {formatDate(o.deliveredAt)}</div>}
                              {o.cancelledAt && <div className="text-red-600">❌ {formatDate(o.cancelledAt)}</div>}
                              {o.returnedAt && <div className="text-orange-600">↩️ {formatDate(o.returnedAt)}</div>}
                              {!o.deliveredAt && !o.cancelledAt && !o.returnedAt && <div className="text-gray-400">⏳ {o.status}</div>}
                            </td>
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs">
                              <div>{o.address.city}, {o.address.state}</div>
                              <div className="text-gray-500">{o.address.pincode}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}