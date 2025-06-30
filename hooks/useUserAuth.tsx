import { useContext, useEffect, useState } from "react";
import { userContext } from "@/context/userContext";
import { usePathname, useRouter } from "next/navigation";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(userContext);
  const router = useRouter();
  const pathname = usePathname();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === "/login" || pathname === "/signup";


    // When user has not logged or 
    if (!user) {
      clearUser();

      if (!isAuthPage) {
        router.replace("/login");
        return;
      }

      setAuthReady(true);
      return;
    }

    const isAdminRoute = pathname.startsWith("/admin/dashboard");
    const isUserRoute = pathname.startsWith("/dashboard");

    if (isAdminRoute && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    if (isUserRoute && user.role !== "member") {
      router.push("/admin/dashboard");
      return;
    }

    if (isAuthPage) {
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
      return;
    }

    setAuthReady(true);
  }, [user, loading, pathname, clearUser, router]);

  return { authReady };
};
