import React from "react";
import { Navigate } from "react-router-dom";
import { LoadingCircle } from "@/components/icons";
import { useAuthSlice } from "@/pages/Auth/slice";
import { EnhancedNavbar } from "@/components/shared/EnhancedNavbar";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isFetchingUser } = useAuthSlice();
  if (isFetchingUser && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingCircle />
      </div>
    );
  }

  // If user types are specified and user doesn't have the required type
  if (!user) {
    // Redirect based on user type
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EnhancedNavbar />
      <div className="pt-16">{children}</div>
    </div>
  );
};
