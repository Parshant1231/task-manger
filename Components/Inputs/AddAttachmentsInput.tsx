"use client";

import React, { useEffect, useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

interface AddAttachmentsInputProps {
  attachments: string[];
  setAttachments: (attachments: string[]) => void;
}

export const AddAttachmentsInput = ({
  attachments,
  setAttachments,
}: AddAttachmentsInputProps) => {
  // Handle file input change
  const [option, setOption] = useState("");
  const [localAttachments, setLocalAttachments] = useState<string[]>([]);

  // ✅ Sync when parent updates `attachments` (like after updateTask fetch)
  useEffect(() => {
    // console.log("attachments prop updated to:", attachments);
    setLocalAttachments(attachments);
  }, [attachments]);

  const handleAddOption = () => {
    const trimmed = option.trim();
    if (!trimmed) return;

    const updated = [...localAttachments, trimmed];
    setLocalAttachments(updated);
    setAttachments(updated);
    setOption("");
  };

  // Delete a file by index
  const handleDeleteOption = (index: number) => {
    const updated = [...localAttachments];
    updated.splice(index, 1);
    setLocalAttachments(updated);
    setAttachments(updated);
  };

  return (
    <div>
      {localAttachments.map((item, index) => (
        <div
          key={index}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex-1 flex items-center gap-3 border border-gray-100">
            <LuPaperclip className="text-gray-400" />
            <p className="text-sm text-black">{item}</p>
          </div>

          <button
            className="cursor-pointer"
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400" />
          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white py-2"
          />
        </div>

        <button className="card-btn text-nowrap " onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add{" "}
        </button>
      </div>
    </div>
  );
};
