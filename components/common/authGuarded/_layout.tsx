import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactElement;
}

// Protects authenticated routes
const AuthGuardedLayout = ({ children }: LayoutProps) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  return <>{user && children}</>;
};

export default AuthGuardedLayout;
