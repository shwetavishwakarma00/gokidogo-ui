import api from "@/app/apis/axiosInstance";

// CHECKOUT
export const placeCheckout = async (data) => {
  const res = await api.post("/checkout", data);
  return res.data;
};