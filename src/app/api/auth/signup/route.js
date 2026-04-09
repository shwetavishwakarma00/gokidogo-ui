export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://app.gokidogo.com/webapi/api.php/customersignup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: body.gender === "1" ? "Ms" : "Mr",
          firstname: body.firstname,
          lastname: body.lastname,
          email: body.email,
          mobile: body.mobile,
          passwd: body.passwd,
          gender: body.gender,
          terms: "1",
          newsl: "0",
          smssub: "0",
          emailOTPVerified: "1",
          ipadd: "122.122.122.122"
        })
      }
    );

    const text = await res.text();   // 👈 important

    console.log("Signup API raw response:", text);

    return Response.json({
      status: res.status,
      data: text
    });

  } catch (error) {
    console.log("Signup API Error:", error);

    return Response.json({
      error: error.message
    }, { status: 500 });
  }
}