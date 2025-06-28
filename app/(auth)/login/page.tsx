"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { Input } from "@/Components/Inputs/Input";
import { validateEmail } from "@/utils/helper";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useRouter } from "next/navigation";
import { userContext } from "@/context/userContext";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useContext(userContext);

  const router = useRouter();

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(null);

    // Sign in API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        // Redirect based on role
        if (role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard");
        }
      }
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  return (
    <div className="w-full lg:w-[65%] h-3/4 md:h-full flex flex-col justify-center mt-20 md:mt-0">
      <h1 className="text-2xl font-semibold text-black">Welcome Back</h1>
      <p className="text-md text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          label="Email Address"
          placeholder="john123@gmail.com"
          type="text"
        />
        <Input
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          label="Password"
          placeholder="Min 8 Charaters"
          type="password"
        />
        {error && (
          <p className="text-red-500 text-sm font-medium pb-2.5">{error}</p>
        )}

        <button type="submit" className="btn-primary">
          LOGIN
        </button>

        <p>
          Don &#39;t have an account?{" "}
          <Link href="./signup" className="font-medium text-primary underline">
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
}
