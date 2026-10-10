"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Coffee, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import type { Tier } from "@/lib/constants";
import type { ProductDTO } from "@/lib/data";
import { formatMoney, priceForTier } from "@/lib/pricing";

const TILT_SPRING = { stiffness: 220, damping: 20, mass: 0.6 };
const MAX_TILT_DEG = 12;

export function ProductCard({
  product,
  tier,
}: {
  product: ProductDTO;
  tier: Tier;
}) {
  const [quantity, setQuantity] = useState(product.moqKg);
  const [imageFailed, setImageFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const add = useCart((state) => state.add);
  const openCart = useCart((state) => state.setOpen);

  const tierPrice = priceForTier(product.basePrice, tier);
  const isDiscounted = tierPrice < product.basePrice;

  // Pointer position over the card, 0–1 on each axis; 0.5 is dead centre.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, TILT_SPRING);
  const smoothY = useSpring(pointerY, TILT_SPRING);
  // The part of the card under the pointer leans toward the viewer, so the
  // controls come closer as you reach for them.
  const rotateY = useTransform(smoothX, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]);
  const rotateX = useTransform(smoothY, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]);
  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.4), transparent 55%)`;
  // The glare only exists while a pointer is over the card.
  const glareOpacity = useSpring(0, TILT_SPRING);
  // The bag's shadow slides away from the pointer, like a light following it.
  const shadowX = useTransform(smoothX, [0, 1], [18, -18]);
  const shadowY = useTransform(smoothY, [0, 1], [6, 30]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
    glareOpacity.set(1);
  }

  function resetTilt() {
    pointerX.set(0.5);
    pointerY.set(0.5);
    glareOpacity.set(0);
  }

  function addToCart() {
    add({
      productId: product.id,
      name: product.name,
      origin: product.origin,
      imageUrl: product.imageUrl,
      unitPrice: tierPrice,
      quantity,
      moqKg: product.moqKg,
    });
    toast.success(`Added ${quantity}kg of ${product.name}`, {
      action: { label: "View cart", onClick: () => openCart(true) },
    });
    setQuantity(product.moqKg);
  }

  return (
    <div
      className="h-full [perspective:1100px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      {/* No overflow clipping on this element: it would flatten preserve-3d. */}
      <motion.article
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="crema relative flex h-full flex-col rounded-2xl bg-card p-4 text-card-foreground shadow-xl shadow-black/40 ring-1 ring-foreground/10"
      >
        <div
          className="relative aspect-[4/3] rounded-xl bg-espresso"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-x-8 bottom-3 h-6 rounded-full bg-black/60 blur-xl"
            style={{ x: shadowX, y: shadowY }}
          />
          <div
            className="absolute inset-3 overflow-hidden rounded-lg [transform:translateZ(56px)]"
            style={{ boxShadow: "0 18px 30px -12px rgb(0 0 0 / 0.65)" }}
          >
            {imageFailed ? (
              <div className="flex size-full items-center justify-center bg-secondary">
                <Coffee className="size-10 text-gold-ink" aria-hidden />
              </div>
            ) : (
              <Image
                src={product.imageUrl}
                alt={`${product.name} coffee`}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
                onError={() => setImageFailed(true)}
              />
            )}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
              style={{ background: glare, opacity: glareOpacity }}
            />
          </div>
          <Badge className="absolute top-2 left-2 bg-espresso/90 text-crema [transform:translateZ(80px)]">
            {product.roastLevel} roast
          </Badge>
        </div>

        <div className="mt-4 flex flex-1 flex-col [transform:translateZ(28px)]">
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {product.origin}
          </p>
          <h3 className="mt-1 font-heading text-xl leading-snug font-medium text-balance">
            {product.name}
          </h3>

          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-4">
            {isDiscounted && (
              <span className="text-sm text-muted-foreground">
                <span className="sr-only">Base price </span>
                <s>{formatMoney(product.basePrice)}</s>
              </span>
            )}
            <span className="font-heading text-2xl font-semibold tabular-nums">
              <span className="sr-only">Your price </span>
              {formatMoney(tierPrice)}
            </span>
            <span className="text-sm text-muted-foreground">/ kg</span>
          </div>
          {product.moqKg > 1 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Minimum {product.moqKg}kg per order
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <QuantityStepper
              value={quantity}
              min={product.moqKg}
              onChange={setQuantity}
              label={`Quantity of ${product.name}`}
            />
            <Button className="h-9 flex-1" onClick={addToCart}>
              <ShoppingBag data-icon="inline-start" />
              Add to cart
            </Button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
