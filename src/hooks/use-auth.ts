import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";

const DEMO_USER = {
  _id: "demo-user",
  _creationTime: Date.now(),
  name: "Demo User",
  email: "demo@foodflow.com",
  role: "user",
  phone: "+1-555-0100",
  address: "Demo City",
  verificationStatus: "verified",
} as any;

const shouldUseDemoAuth = (() => {
  if (typeof window === "undefined") return false;
  const forcedValue = window.localStorage.getItem("foodflow_demo_auth");
  if (forcedValue !== null) return forcedValue === "true";
  return true;
})();

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const { signIn, signOut: authSignOut } = useAuthActions();

  const signOut = async () => {
    sessionStorage.removeItem("foodhub_registration");
    localStorage.removeItem("foodflow_donor_donations");
    if (shouldUseDemoAuth) {
      window.localStorage.setItem("foodflow_demo_auth", "false");
      return;
    }
    await authSignOut();
  };

  if (shouldUseDemoAuth) {
    return {
      isLoading: false,
      isAuthenticated: true,
      user: DEMO_USER,
      signIn: async (..._args: unknown[]) => true as any,
      signOut,
    };
  }

  const isLoading = isAuthLoading || user === undefined;

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
