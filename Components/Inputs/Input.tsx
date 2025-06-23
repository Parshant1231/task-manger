'use client';
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const Input = ({ value, onChange, label, placeholder, type }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label className="block text-sm  font-medium text-gray-700">
        {label}
      </label>

      <div className="input-box">
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          className="w-full bg-transparent outline-none"
          required
          placeholder={placeholder}
          onChange={(e) => onChange(e)}
        />
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-blue-600  cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
