"use client";

import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

type Option = {
  label: string;
  value: string;
};

type SelectDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

const handleSelect = (option: string) => {
  onChange(option); // string like "High"
  setIsOpen(false);
};

  return (
    <div className="relative w-full ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full  txt-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}
        <span className="ml-2 ">
          {isOpen ? (
            <LuChevronUp className="" />
          ) : (
            <LuChevronDown className="" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute min-w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
