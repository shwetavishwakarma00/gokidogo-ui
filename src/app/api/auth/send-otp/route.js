// export async function POST(req) {
//   try {

//     const body = await req.json();

//     const res = await fetch(
//       "https://app.gokidogo.com/webapi/api.php/sendotpemail",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           deviceId: body.deviceId,
//           email: body.email
//         })
//       }
//     );

//     const text = await res.text();

//     console.log("API RESPONSE:", text);

//     // clean response if extra text comes
//     const clean = text.substring(0, text.lastIndexOf("}") + 1);

//     const data = JSON.parse(clean);

//     return Response.json(data);

//   } catch (error) {

//     console.log("SEND OTP ERROR:", error);

//     return Response.json(
//       { error: error.message },
//       { status: 500 }
//     );

//   }
// }


export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://app.gokidogo.com/webapi/api.php/sendotpemail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: body.deviceId,
          email: body.email,
        }),
      }
    );

    const text = await res.text();

    console.log("RAW RESPONSE:", text);

    // direct return as text
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.log("SEND OTP ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}