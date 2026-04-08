export async function POST() {
  const res = await fetch(
    "https://app.gokidogo.com/webapi/api.php/restaurentdetail",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: "8C6A17DC-3D07-43B1-884F-1E0209EAA2F7",
        ipadd: "122.122.122.122",
        latitude: "",
        longitude: "",
        restid: "20",
        restname: "Yauatcha",
        user: ""
      }),
    }
  );
  const data = await res.json();
  return Response.json(data);
}