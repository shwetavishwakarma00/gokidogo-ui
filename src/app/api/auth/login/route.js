import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // backend API call
    const res = await fetch(
      "https://app.gokidogo.com/webapi/api.php/authcustomer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usrid: body.usrid,
          passwd: body.passwd,
          deviceid: body.deviceid,
        }),
      }
    );

    const data = await res.json(); // JSON parse

    console.log("Login API response:", data);

    return NextResponse.json(
      { status: res.status, data },
      { status: res.status }
    );
  } catch (error) {
    console.error("Login API Error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}