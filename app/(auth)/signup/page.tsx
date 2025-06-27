"use client";

import { Input } from "@/Components/Inputs/Input";
import { ProfilePhotoSelector } from "@/Components/Inputs/ProfilePhotoSelector";
import { userContext } from "@/context/userContext";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { validateEmail } from "@/utils/helper";
import { uploadImage } from "@/utils/uploadImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";


export default function SignupPage() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useContext(userContext);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    let profileImageUrl = '';

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(null);

    // Sign up API call
    try {

      // Upload image if present
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
     const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      name: fullName,
      email,
      password,
      profileImageUrl,
      adminInviteToken: adminInviteToken || null,
     });

     const { token, role} = response.data;

     if(token){
      localStorage.setItem("token", token);
      updateUser(response.data);

      // Redirect base on role
      if(role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard")
      }
     }
    } catch (e) {
      console.error("Login failed", e);
    }
  };
  return (
    <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center mt-30 md:mt-0">
      <h1 className="text-2xl font-semibold text-black">Create an Account</h1>
      <p className="text-md text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below
      </p>

      <form onSubmit={handleSignup}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFullName(e.target.value)
            }
            label="First Name"
            placeholder="John"
            type="text"
          />
          <Input
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            label="Email Address"
            placeholder="john13@gmail.com"
            type="email"
          />

          <Input
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            label="Password"
            placeholder="Min 8 Chararacters"
            type="password"
          />
          <Input
            value={adminInviteToken}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAdminInviteToken(e.target.value)
            }
            label="Admin Invite Token"
            placeholder="6 digit code"
            type="text"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          SIGNUP
        </button>

        <p>
          Already an account?{" "}
          <Link href="./login" className="font-medium text-primary underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
