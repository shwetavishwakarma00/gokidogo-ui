import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      customer_ID,
      email,
      apikey,
      deviceId,
      firstName,
      lastName,
      mobile,
      dateOfBirth,
      title,
      gender,
    } = body;

    // Build payload exactly as the external API expects
    const payload = {
      deviceId: deviceId || customer_ID,
      apikey: apikey,
      customerId: customer_ID,
      user: customer_ID,
      email: email,
      firstName: firstName || "",
      lastName: lastName || "",
      mobile: mobile || "",
      dateOfBirth: dateOfBirth || "",
      title: title || "",
      gender: gender || "",
    };

    const response = await fetch(
      "https://app.gokidogo.com/webapi/api.php/updateuserprofile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}