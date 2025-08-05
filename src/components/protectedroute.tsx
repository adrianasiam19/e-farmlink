"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface UserData {
  id: number;
  email: string;
  is_farmer: boolean;
  is_buyer: boolean;
  // Add other fields if needed
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      toast.error("You must be logged in.");
      router.push("/auth");
      return;
    }

    try {
      const user: UserData = JSON.parse(userData);

      if (!user.is_farmer) {
        toast.error("Access denied: Only farmers allowed.");
        router.push("/unauthorized");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      toast.error("Failed to validate user.");
      localStorage.removeItem("access");
      localStorage.removeItem("user");
      router.push("/auth");
    }
  }, [router]);

  if (!isAuthorized) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
