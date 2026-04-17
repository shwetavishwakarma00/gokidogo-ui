import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://webapit.gokidogo.de/api",  
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;