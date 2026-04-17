import api from "@/app/apis/axiosInstance";
import { data } from "autoprefixer";

export const fetchRestaurantApi = async (data) => {
  const res = await api.post("/restaurentdetail", data);  
  return res.data;
};