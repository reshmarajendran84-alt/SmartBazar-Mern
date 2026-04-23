import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const InvoicePage = () => { 
  const { orderId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(`/order/invoice/${orderId}`, {
          responseType: 'blob'
        });
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error loading invoice:', error);
      }
    };

    fetchInvoice();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [orderId]);

  if (!pdfUrl) return <div>Loading invoice...</div>;

  return (
    <div className="w-full h-screen">
      <iframe src={pdfUrl} className="w-full h-full" title="Invoice" />
    </div>
  );
};

export default InvoicePage;  