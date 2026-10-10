"use client";

import { useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { placeOrder } from "@/app/dashboard/actions";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cartSubtotal, cartTotalKg, useCart } from "@/lib/cart-store";
import { CHECKOUT_MOQ_KG } from "@/lib/constants";
import { formatMoney, kgShortOfMoq } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const router = useRouter();
  const [isPlacing, startPlacing] = useTransition();
  const { items, isOpen, setOpen, setQuantity, remove, clear } = useCart();

  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  const totalKg = cartTotalKg(items);
  const subtotal = cartSubtotal(items);
  const shortBy = kgShortOfMoq(totalKg);
  const meetsMoq = shortBy === 0;
  const progress = Math.min(1, totalKg / CHECKOUT_MOQ_KG);

  function checkout() {
    startPlacing(async () => {
      const result = await placeOrder(
        items.map(({ productId, quantity }) => ({ productId, quantity }))
      );
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      clear();
      setOpen(false);
      toast.success(
        `Order placed — ${formatMoney(result.totalAmount)}. We'll invoice you shortly.`
      );
      router.push("/dashboard/orders");
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative h-9 border-input">
          <ShoppingBag data-icon="inline-start" />
          <span className="hidden sm:inline">Cart</span>
          <span className="sr-only sm:hidden">Cart</span>
          <AnimatePresence>
            {totalKg > 0 && (
              <motion.span
                key="count"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
                className="rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums"
              >
                {totalKg}kg
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="text-xl">Your order</SheetTitle>
          <SheetDescription>
            Wholesale orders start at {CHECKOUT_MOQ_KG}kg.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBag
                className="size-8 text-muted-foreground"
                aria-hidden
              />
              <p className="text-sm text-muted-foreground">
                Your cart is empty. Add coffee from the catalog to start an
                order.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-3 py-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-espresso">
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="leading-snug font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatMoney(item.unitPrice)} / kg
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <QuantityStepper
                            value={item.quantity}
                            min={item.moqKg}
                            onChange={(quantity) =>
                              setQuantity(item.productId, quantity)
                            }
                            label={`Quantity of ${item.name}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => remove(item.productId)}
                          >
                            <Trash2 />
                          </Button>
                          <span className="ml-auto font-medium tabular-nums">
                            {formatMoney(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        <SheetFooter className="gap-4 border-t">
          <div>
            <div
              role="progressbar"
              aria-label="Progress toward the minimum order"
              aria-valuemin={0}
              aria-valuemax={CHECKOUT_MOQ_KG}
              aria-valuenow={Math.min(totalKg, CHECKOUT_MOQ_KG)}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
            >
              <motion.div
                className={cn(
                  "h-full rounded-full transition-colors duration-500",
                  meetsMoq ? "bg-emerald-600" : "bg-primary"
                )}
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <p
              aria-live="polite"
              className={cn(
                "mt-2 text-sm",
                meetsMoq ? "text-emerald-800" : "text-muted-foreground"
              )}
            >
              {meetsMoq
                ? `Minimum met — ${totalKg}kg in this order.`
                : `You must add ${shortBy} more kg to reach the ${CHECKOUT_MOQ_KG}kg minimum.`}
            </p>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-heading text-2xl font-semibold tabular-nums">
              {formatMoney(subtotal)}
            </span>
          </div>

          <Button
            className="h-11 text-base"
            disabled={!meetsMoq || isPlacing}
            onClick={checkout}
          >
            {isPlacing && <Loader2 className="animate-spin" />}
            {isPlacing ? "Placing order…" : "Place wholesale order"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
