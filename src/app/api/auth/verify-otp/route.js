export async function POST(req) {

  const body = await req.json();

  const res = await fetch(
    "https://app.gokidogo.com/webapi/api.php/verifyotpemail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deviceId: body.deviceId,
        email: body.email,
        otp: body.otp
      })
    }
  );

  const data = await res.json();

  return Response.json(data);
}