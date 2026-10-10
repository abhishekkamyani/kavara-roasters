"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Sign out"
        title="Sign out"
        // The cart lives in this browser, so don't leave it for the next account.
        onClick={() => useCart.getState().clear()}
      >
        <LogOut />
      </Button>
    </form>
  );
}
