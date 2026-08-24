"use client";

import { useMutation } from "convex/react";
import { api } from "@/lib/convex-api";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export function UserSync() {
  const { isSignedIn, userId } = useAuth();
  // We use useMutation directly. Note: api.users might not be typed yet if codegen hasn't run,
  // but in a running dev environment it should be picking up.
  const store = useMutation(api.users.store);

  useEffect(() => {
    if (isSignedIn && userId) {
      void store();
    }
  }, [isSignedIn, userId, store]);

  return null;
}
