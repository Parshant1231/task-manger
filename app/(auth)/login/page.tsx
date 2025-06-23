"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/Components/Inputs/Input";
import { validateEmail } from "@/utils/helper";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // const router = useRouter();

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
  };

  return (
    <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold text-black">Welcome Back</h1>
      <p className="text-md text-slate-700 mt-[px] mb-6">
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
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          LOGIN
        </button>

        <p>
          Don &#39;t have an account?{" "}
          <Link href="./signup" className="font-medium text-primary underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
