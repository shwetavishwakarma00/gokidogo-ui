export const getDeviceId = () => {
  if (typeof window === "undefined") return "web-ssr";
  
  let deviceId = localStorage.getItem("deviceId");
  
  if (!deviceId) {
    deviceId = "web-" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("deviceId", deviceId);
  }
  
  return deviceId;
};