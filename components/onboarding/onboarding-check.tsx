"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface OnboardingCheckProps {
  children: React.ReactNode;
}

export function OnboardingCheck({ children }: OnboardingCheckProps) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || checkedRef.current) return;
    
    checkedRef.current = true;

    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.username && pathname !== "/onboard") {
          router.push("/onboard");
        }
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn, router, pathname]);

  return <>{children}</>;
}
