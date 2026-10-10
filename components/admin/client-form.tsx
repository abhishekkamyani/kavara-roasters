"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/app/admin/clients/actions";
import { TIER_LABELS } from "@/components/tier-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MIN_PASSWORD_LENGTH, TIERS } from "@/lib/constants";
import { discountPercent } from "@/lib/pricing";

export function ClientForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isSaving, startSaving] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startSaving(async () => {
      const result = await createClient(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(`${result.companyName} can now sign in`);
      router.push("/admin/clients");
    });
  }

  return (
    <Card className="[--card-spacing:--spacing(6)]">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              name="companyName"
              required
              maxLength={120}
              autoComplete="off"
              placeholder="Harbour Street Coffee"
              className="h-10"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Sign-in email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                placeholder="orders@harbourstreet.coffee"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tier">Tier</Label>
              <Select name="tier" defaultValue="BRONZE">
                <SelectTrigger id="tier" className="h-10! w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((tier) => (
                    <SelectItem key={tier} value={tier}>
                      {TIER_LABELS[tier]} · {discountPercent(tier)}% off
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Starting password</Label>
            {/* Shown in plain text: the admin has to pass it on to the client. */}
            <Input
              id="password"
              name="password"
              type="text"
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="password-hint"
              className="h-10 font-mono"
            />
            <p id="password-hint" className="text-xs text-muted-foreground">
              At least {MIN_PASSWORD_LENGTH} characters. Send it to the client
              yourself — the portal doesn&apos;t email it.
            </p>
          </div>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={isSaving}
            className="h-10 self-start px-5"
          >
            {isSaving && <Loader2 className="animate-spin" />}
            {isSaving ? "Creating…" : "Create client"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
