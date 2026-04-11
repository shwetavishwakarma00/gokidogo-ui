import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const { Order, details } = body;

    if (!Order || !details) {
      return NextResponse.json(
        { error: "Order aur details dono zaroori hain" },
        { status: 400 }
      );
    }

    const payload = { Order, details };

    console.log("Sending to external API:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      "https://app.gokidogo.com/webapi/api.php/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    // ✅ Pehle raw text lo
    const rawText = await response.text();
    console.log("External API raw response:", rawText);

    // ✅ Phir JSON parse karne ki koshish karo
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          error: "External API ne invalid response diya",
          raw: rawText.substring(0, 300),
        },
        { status: 502 }
      );
    }

    console.log("Checkout API parsed response:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed", details: error.message },
      { status: 500 }
    );
  }
}