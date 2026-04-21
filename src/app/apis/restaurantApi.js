
import api from "@/app/apis/axiosInstance";

export const fetchRestaurantApi = async (data) => {
  const res = await api.post("/restaurentdetail", data);
  return res.data;
};