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

    const response = await fetch(
      "https://app.gokidogo.com/webapi/api.php/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log("Checkout API response:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed", details: error.message },
      { status: 500 }
    );
  }
}