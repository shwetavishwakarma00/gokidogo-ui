import api from "@/app/apis/axiosInstance";

export const fetchRestaurantApi = async () => {
  const res = await api.post("/restaurant");  
  return res.data;
};