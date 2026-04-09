"use client";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { sendOtpThunk, verifyOtpThunk, signupThunk } from "@/app/redux/features/authSlice";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AuthPage() {

const dispatch = useDispatch();

const [screen,setScreen] = useState("signup");
const [loading,setLoading] = useState(false);
const [showPassword,setShowPassword] = useState(false);
const [showConfirm,setShowConfirm] = useState(false);

const router = useRouter();

const [otp,setOtp] = useState(["","","","","",""]);
const otpRefs = [
useRef(),
useRef(),
useRef(),
useRef()
];

const [form,setForm] = useState({
firstName:"",
lastName:"",
email:"",
phone:"",
password:"",
confirmPassword:""
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

/* ---------------- SEND OTP ---------------- */

const sendOtp = async ()=>{

if(!form.email) return toast.error("Email required");

try{

setLoading(true);

await dispatch(
sendOtpThunk({
deviceId:"web123",
email:form.email
})
).unwrap();

toast.success("OTP sent to email");

setScreen("otp");

}
catch(err){

toast.error("OTP send failed");

}
finally{

setLoading(false);

}

};

/* ---------------- OTP INPUT ---------------- */

const handleOtpChange=(value,index)=>{

if(!/^[0-9]?$/.test(value)) return;

const newOtp=[...otp];
newOtp[index]=value;
setOtp(newOtp);

if(value && index<3){
otpRefs[index+1].current.focus();
}

};

/* ---------------- OTP PASTE ---------------- */

const handlePaste=(e)=>{

const paste=e.clipboardData.getData("text").slice(0,4);

if(!/^[0-9]+$/.test(paste)) return;

const arr=paste.split("");

setOtp(arr);

arr.forEach((num,i)=>{
otpRefs[i].current.value=num;
});

};
/* ---------------- VERIFY OTP ---------------- */

const verifyOtp=async()=>{

const code=otp.join("");

if(code.length<4) return toast.error("Enter full OTP");

try{

setLoading(true);

await dispatch(
verifyOtpThunk({
deviceId:"web123",
email:form.email,
otp:code
})
).unwrap();

toast.success("OTP verified");

await dispatch(
signupThunk({
firstname:form.firstName,
lastname:form.lastName,
email:form.email,
mobile:form.phone,
passwd:form.password,
gender:"1"
})
).unwrap();

// user save karo
localStorage.setItem(
  "user",
  JSON.stringify({
    name: form.firstName,
    email: form.email
  })
);

setScreen("success");

// 2 sec baad redirect
setTimeout(() => {
  router.push("/");
}, 2000);

}
catch(err){

toast.error("OTP verification failed");

}
finally{

setLoading(false);

}

};
return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<Toaster/>

<motion.div
initial={{opacity:0,scale:0.9}}
animate={{opacity:1,scale:1}}
className="bg-white p-8 rounded-xl shadow-xl w-[380px]"
>

{/* ---------------- SIGNUP ---------------- */}

{screen==="signup" && (

<div className="flex flex-col gap-4">

<h2 className="text-2xl font-bold text-center">
Create Account
</h2>

<div className="mb-4">
  <label className="block text-sm font-medium mb-1">
    Title
  </label>

  <select
    value={form.title}
    onChange={(e) =>
      setForm({ ...form, title: e.target.value })
    }
    className="w-full border rounded-lg p-2"
  >
    <option value="">Select Title</option>
    <option value="Mr">Mr</option>
    <option value="Ms">Ms</option>
    <option value="Mrs">Mrs</option>
  </select>
</div>

<input
name="firstName"
placeholder="First Name"
value={form.firstName}
onChange={handleChange}
className="border p-3 rounded"
/>

<input
name="lastName"
placeholder="Last Name"
value={form.lastName}
onChange={handleChange}
className="border p-3 rounded"
/>

<input
type="email"
name="email"
placeholder="Email"
value={form.email}
onChange={handleChange}
className="border p-3 rounded"
/>

<input
type="tel"
name="phone"
placeholder="Phone"
value={form.phone}
onChange={handleChange}
className="border p-3 rounded"
/>


{/* PASSWORD */}

<div className="relative">

<input
type={showPassword?"text":"password"}
name="password"
placeholder="Password"
value={form.password}
onChange={handleChange}
className="border p-3 rounded w-full"
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-3 text-sm"
>
{showPassword?"Hide":"Show"}
</button>

</div>



{/* CONFIRM PASSWORD */}

<div className="relative">

<input
type={showConfirm?"text":"password"}
name="confirmPassword"
placeholder="Confirm Password"
value={form.confirmPassword}
onChange={handleChange}
className="border p-3 rounded w-full"
/>

<button
type="button"
onClick={()=>setShowConfirm(!showConfirm)}
className="absolute right-3 top-3 text-sm"
>
{showConfirm?"Hide":"Show"}
</button>

</div>



<motion.button
whileHover={{scale:1.03}}
whileTap={{scale:0.95}}
onClick={sendOtp}
disabled={loading}
className="bg-green-500 text-white p-3 rounded font-bold"
>

{loading?"Sending OTP...":"Signup"}

</motion.button>

</div>

)}





{/* ---------------- OTP SCREEN ---------------- */}

{screen==="otp" && (

<div className="flex flex-col gap-6">

<h2 className="text-xl font-bold text-center">
Enter OTP
</h2>

<div
onPaste={handlePaste}
className="flex justify-center gap-3"
>

{otp.map((digit,i)=>(
<input
key={i}
ref={otpRefs[i]}
maxLength="1"
onChange={(e)=>handleOtpChange(e.target.value,i)}
className="border w-12 h-12 text-center text-xl rounded"
/>
))}

</div>


<motion.button
whileHover={{scale:1.03}}
whileTap={{scale:0.95}}
onClick={verifyOtp}
disabled={loading}
className="bg-blue-500 text-white p-3 rounded font-bold"
>

{loading?"Verifying...":"Verify OTP"}

</motion.button>

</div>

)}

{/* ---------------- SUCCESS ---------------- */}

{screen==="success" && (

<div className="text-center flex flex-col gap-4">

<h2 className="text-2xl font-bold text-green-600">
Signup Successful 🎉
</h2>
</div>

)}
</motion.div>
</div>
);

}