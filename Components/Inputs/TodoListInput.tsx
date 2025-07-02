"use client";

import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

interface TodoListInputProps {
  todoList: string[];
  setTodoList: (todos: string[]) => void;
}

const TodoListInput: React.FC<TodoListInputProps> = ({
  todoList,
  setTodoList,
}) => {
  const [option, setOption] = useState<string>("");

  // Add a new todo
  const handleAddOption = () => {
    const trimmed = option.trim();
    if (trimmed) {
      setTodoList([...todoList, trimmed]);
      setOption("");
    }
  };

  // Delete a todo by index
  const handleDeleteOption = (index: number) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {todoList.map((item, index) => (
        <div
           key={`${item}-${index}`}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2" // Added some common classes to complete the styles based on common UI patterns
        >
          <p className="text-sm text-black">
            <span className="text-sm text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            className="cursor-pointer" // Added classes for styling the delete button
            onClick={() => {
              handleDeleteOption(index);
            }}
          >
            <HiOutlineTrash className="text-lg text-red-500" /> {/* Added size to icon */}
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        {/* Added gap and margin-top */}
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md" 
        />
        <button
          className="card-btn text-nowrap"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" /> Add{" "}
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
