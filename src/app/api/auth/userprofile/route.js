import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://app.gokidogo.com/webapi/api.php/userprofile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_ID: body.customer_ID,
          email: body.email,
          apikey: body.apikey,
          deviceId: body.deviceId,
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}