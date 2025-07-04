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

    // No user? Redirect to login (if not already there)
    if (!user) {
      clearUser();
      if (!isAuthPage) {
        router.replace("/login");
      }
      setAuthReady(true);
      return;
    }

    // ✅ ROLE CHECK from userContext (not decoded)
    const isAdminRoute = pathname.startsWith("/admin/dashboard");
    const isUserRoute = pathname.startsWith("/dashboard") && !isAdminRoute;

    if (isAdminRoute && user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    if (isUserRoute && user.role !== "member") {
      router.replace("/admin/dashboard");
      return;
    }

    if (isAuthPage) {
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
      return;
    }

    setAuthReady(true);
  }, [user, loading, pathname, router, clearUser]);

  return { authReady };
};
