"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfileThunk } from "@/app/redux/features/authSlice";
import HomePage from "./home/page";

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    // ✅ SAFE CHECK
    if (!userData || userData === "undefined") return;

    let user = null;

    try {
      user = JSON.parse(userData);
    } catch (err) {
      console.log("Invalid user JSON:", err);
      return;
    }

    if (!user?.apikey) return;

    dispatch(
      fetchProfileThunk({
        customer_ID: user.customer_ID,
        email: user.email,
        apikey: user.apikey,
        deviceid: "web123",
      })
    );
  }, [dispatch]);

  return (
    <div>
      <HomePage />
    </div>
  );
}