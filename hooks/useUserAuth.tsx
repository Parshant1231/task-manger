import { useContext, useEffect, useState } from "react";
import { userContext } from "@/context/userContext";
import { usePathname, useRouter } from "next/navigation";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(userContext);
  const router = useRouter();
  const pathname = usePathname();

  const [authReady, setAuthReady] = useState(false); // ✅ add ready flag

  useEffect(() => {
    if (loading) return;

    if (!user) {
      clearUser();
      router.push("/login");
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

    // ✅ All checks passed
    setAuthReady(true);
  }, [user, loading, pathname, clearUser, router]);

  return { authReady };
};
