"use client";

import { motion, type Variants } from "framer-motion";
import { ProductCard } from "@/components/catalog/product-card";
import type { Tier } from "@/lib/constants";
import type { ProductDTO } from "@/lib/data";

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 20 },
  },
};

export function CatalogGrid({
  products,
  tier,
}: {
  products: ProductDTO[];
  tier: Tier;
}) {
  return (
    <motion.ul
      variants={grid}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product) => (
        <motion.li key={product.id} variants={card}>
          <ProductCard product={product} tier={tier} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
