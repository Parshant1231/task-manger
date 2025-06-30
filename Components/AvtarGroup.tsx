import React from "react";
import Image from "next/image";
interface AvatarGroupProps {
  avatars: string[]; // array of image URLs
  maxVisible?: number; // optional, defaults to 3
}

export const AvatarGroup = ({ avatars, maxVisible = 3 }: AvatarGroupProps) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <Image
          height={30}
          width={30}
          key={index}
          src={avatar}
          alt={`Avatar ${index}`}
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0"
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50  text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};
