import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import React, { ReactElement, useContext, useEffect } from "react";

interface LayoutProps {
  children: ReactElement;
}

const AuthGuardedLayout = ({ children }: LayoutProps) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth");
    }
  }, [loading]);

  return <>{user && children}</>;
};

export default AuthGuardedLayout;
