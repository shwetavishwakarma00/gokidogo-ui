import api from "@/app/apis/axiosInstance";

// INVOICE
export const sendInvoiceEmail = async (data) => {
  const res = await api.post("/invoice_email", data);
  return res.data;
};