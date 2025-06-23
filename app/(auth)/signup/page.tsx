"use client";
import { Input } from "@/Components/Inputs/Input";
import { validateEmail } from "@/utils/helper";
import Link from "next/link";
import React, { useState } from "react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    // setError(null);
  };
  return (
    <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold text-black">Welcome Back</h1>
      <p className="text-md text-slate-700 mt-[px] mb-6">
        Please enter your details to Sign Up
      </p>

      <form onSubmit={handleSignup}>
        <Input
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFirstName(e.target.value)
          }
          label="First Name"
          placeholder="John"
          type="text"
        />
        <Input
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLastName(e.target.value)
          }
          label="Last Name"
          placeholder="Kay"
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

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          SIGNUP
        </button>

        <p>
          Have an account?{" "}
          <Link href="./login" className="font-medium text-primary underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
