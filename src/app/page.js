"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfileThunk } from "@/app/redux/features/authSlice";
import HomePage from "./home/page";

export default function Page() {

const dispatch = useDispatch();

useEffect(() => {

  const userData = localStorage.getItem("user");

  if (!userData) return;

  const user = JSON.parse(userData);

  if (!user || !user.apikey) return;

  dispatch(
    fetchProfileThunk({
      customer_ID: user.customer_ID,
      email: user.email,
      apikey: user.apikey,
      deviceid: "web123",
    })
  );

}, []);

return <div>
  <HomePage/>
</div>;

}