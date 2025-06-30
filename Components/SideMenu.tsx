"use client";

import { userContext } from "@/context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "@/utils/data";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { getFirstName } from "@/utils/helper";
import Loading from "@/app/loading";

export default function SideMenu() {
  const { user, loading, clearUser } = useContext(userContext);
  const [sideMenuData, setSideMenuData] = useState<typeof SIDE_MENU_DATA>([]);
  const [errorImage, setErrorImage] = useState(false);
  const pathname = usePathname();
  const navigate = useRouter();

  const handleClick = (route: any) => {
    if (route === "logout") {
      localStorage.clear();
      clearUser();
      navigate.push("/login");
      return; // ✅ prevent second push
    }
    navigate.push(route);
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);

  if (loading) return <Loading />;
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white order-r border-gray-200/50 sticky top-[61px] z-20 ">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md ring-2 ring-primary">
          {user?.profileImageUrl ? (
            <Image
              src={errorImage ? "/default.png" : user.profileImageUrl}
              alt="Profile"
              width={80}
              height={80}
              className="object-cover w-full h-full rounded-full"
              onError={() => setErrorImage(true)}
            />
          ) : (
            <Image
              src="/default.png"
              alt="Default Profile"
              width={80}
              height={80}
              className="object-cover w-full h-full rounded-full"
            />
          )}
        </div>

        {user?.role === "admin" && (
          <div className="text-[14px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name ? getFirstName(user.name) : ""}
        </h5>

        <p className="text-[12px] text-gray-500 ">{user?.email || ""}</p>
      </div>
      <div>
        {sideMenuData.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);

          return (
            <button
              key={`menu_${index}`}
              className={clsx(
                "w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-pointer",
                isActive
                  ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-blue-500"
                  : ""
              )}
              onClick={() => handleClick(item.path)}
            >
              <Icon className="text-xl" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
