import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, UserPlus } from "lucide-react";
import { useMutation } from "convex/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { dashboardForRole } from "@/lib/role-routing";

interface AuthProps {
  redirectAfterAuth?: string;
}

const authImages = {
  signIn: {
    src: "https://imgv2-1-f.scribdassets.com/img/word_document/750019592/original/b77c2d42cf/1727898670?v=1",
    alt: "FoodFlow community and sustainability illustration",
  },
  signUp: {
    src: "https://img.freepik.com/premium-photo/food-waste-recycling-facility-transforming-leftover-produce-into-new-products-created-with-generative-ai_762026-594.jpg",
    alt: "Food waste recycling facility",
  },
};

const authContent = {
  signIn: {
    eyebrow: "Welcome back to FoodFlow",
    heading: "Continue making a meaningful difference.",
    description: "Sign in to manage your donations, follow every pickup, and see how your surplus food helps communities and the planet.",
  },
  signUp: {
    eyebrow: "Join the FoodFlow community",
    heading: "Turn everyday surplus into real impact.",
    description: "Create your free account to share surplus food, connect with trusted partners, track your impact, and help build a zero-waste community.",
  },
};

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function getAuthErrorMessage(error: unknown, mode: "signIn" | "signUp") {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("InvalidAccountId")) {
    return mode === "signIn"
      ? "No account was found for this email. Register first or check the email address."
      : "This account could not be created. Please check the email address and try again.";
  }
  return message || "Authentication failed. Please check your details and try again.";
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn, user } = useAuth();
  const completeRegistration = useMutation(api.mutations.users.completeRegistration);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const appliedRedirectRole = useRef(false);
  const manualRedirect = useRef(false);
  const pendingRegistrationRole = useRef<string | null>(null);
  const registrationFormRef = useRef<HTMLFormElement>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (mode === "signUp" && registrationFormRef.current) {
        const formData = new FormData(registrationFormRef.current);
        sessionStorage.setItem("foodhub_registration", JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          role: selectedRole,
        }));
      }
      await signIn("google", { redirectTo: redirect });
    } catch (error) {
      console.error("Google authentication error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Google authentication failed. Please try again.",
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      pendingRegistrationRole.current &&
      user?.role === pendingRegistrationRole.current
    ) {
      const role = pendingRegistrationRole.current;
      pendingRegistrationRole.current = null;
      navigate(dashboardForRole(role, redirect));
      return;
    }
    if (!authLoading && isAuthenticated && !manualRedirect.current) {
      const savedRegistration = sessionStorage.getItem("foodhub_registration");
      if (savedRegistration && !appliedRedirectRole.current) {
        appliedRedirectRole.current = true;
        sessionStorage.removeItem("foodhub_registration");
        const registration = JSON.parse(savedRegistration);
        void completeRegistration(registration)
          .then(() => navigate(dashboardForRole(registration.role, redirect)))
          .catch((error) => setError(error instanceof Error ? error.message : "Unable to save your registration details."));
      } else {
        navigate(dashboardForRole(user?.role, redirect));
      }
    }
  }, [authLoading, isAuthenticated, navigate, redirect, completeRegistration, user?.role]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const isRegistering = mode === "signUp";
    if (isRegistering) {
      // Keep the auth effect from routing before the selected role is saved.
      manualRedirect.current = true;
    }
    try {
      const formData = new FormData(event.currentTarget);
      formData.set("flow", mode);
      formData.set("email", String(formData.get("email") || "").trim().toLowerCase());
      await signIn("password", formData);
      if (mode === "signUp") {
        await completeRegistration({
          name: String(formData.get("name") || ""),
          phone: String(formData.get("phone") || ""),
          address: String(formData.get("address") || ""),
          role: selectedRole as "user" | "business" | "employee" | "biogas",
        });
        pendingRegistrationRole.current = selectedRole;
        if (user?.role === selectedRole) {
          pendingRegistrationRole.current = null;
          navigate(dashboardForRole(selectedRole, redirect));
        }
      } else {
        // The auth session resolves before the user profile query refreshes.
        // Let the effect above redirect once the current role is available.
      }
    } catch (error) {
      console.error("Password authentication error:", error);
      setError(getAuthErrorMessage(error, mode));
      manualRedirect.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0EB]">

      
      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(350px,420px)] lg:gap-16">
          <aside className="hidden lg:block">
            <div>
              <img
                src={authImages[mode].src}
                alt={authImages[mode].alt}
                className={`h-72 w-full rounded-3xl ${mode === "signIn" ? "bg-gray-50 object-contain" : "object-cover"}`}
              />
              <div className="mt-8 max-w-xl">
                <p className="text-sm font-bold uppercase tracking-widest text-[#00615F]">{authContent[mode].eyebrow}</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                  {authContent[mode].heading}
                </h2>
                <p className="mt-4 leading-relaxed text-gray-500">
                  {authContent[mode].description}
                </p>
              </div>
            </div>
          </aside>

          <div className="flex flex-col">
          <Button type="button" variant="ghost" className="mb-4 self-start" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
          <Card className="w-full pb-0 border shadow-md">
          <CardHeader className="text-center">
                <CardTitle className="text-xl">{mode === "signIn" ? "Welcome back" : "Create your account"}</CardTitle>
                <CardDescription>
                  {mode === "signIn" ? "Log in to continue to FoodFlow" : "Register with your email and password"}
                </CardDescription>
              </CardHeader>
              <form ref={registrationFormRef} onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pb-8">
                  {mode === "signUp" && (
                    <>
                      <Input name="name" placeholder="Full name or organization name" disabled={isLoading} required />
                      <Input name="phone" placeholder="Phone number" type="tel" disabled={isLoading} required />
                      <Input name="address" placeholder="City or pickup address" disabled={isLoading} required />
                    </>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input name="email" placeholder="name@example.com" type="email" className="pl-9" disabled={isLoading} required />
                  </div>
                  {mode === "signUp" && (
                    <div className="space-y-2">
                      <label htmlFor="account-role" className="text-sm font-medium text-gray-700">
                        How will you use FoodFlow?
                      </label>
                      <select
                        id="account-role"
                        value={selectedRole}
                        onChange={(event) => setSelectedRole(event.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-[#00615F]/20"
                        disabled={isLoading}
                      >
                        <option value="user">Donor</option>
                        <option value="business">Business Partner</option>
                        <option value="employee">Collection Agent</option>
                        <option value="biogas">Waste-Processing Partner</option>
                      </select>
                    </div>
                  )}
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input name="password" placeholder="Password" type={showPassword ? "text" : "password"} className="pl-9 pr-10" minLength={8} disabled={isLoading} required />
                    <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    {mode === "signIn" ? "Log in" : "Create account"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2 font-bold">G</span>}
                    Continue with Google
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setError(null); }} disabled={isLoading}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {mode === "signIn" ? "Need an account? Register" : "Already have an account? Log in"}
                  </Button>
                </CardFooter>
              </form>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
