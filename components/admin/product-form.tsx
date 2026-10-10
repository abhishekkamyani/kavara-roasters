"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/app/admin/actions";
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
import { ROAST_LEVELS } from "@/lib/constants";
import type { ProductDTO } from "@/lib/data";
import { UploadDropzone } from "@/lib/uploadthing";

/** Creates a product, or edits `product` when one is passed. */
export function ProductForm({ product }: { product?: ProductDTO }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [error, setError] = useState<string>();
  const [isSaving, startSaving] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("imageUrl", imageUrl);

    startSaving(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(
        product
          ? `${result.name} updated`
          : `${result.name} added to the catalog`
      );
      router.push("/admin/products");
    });
  }

  return (
    <Card className="[--card-spacing:--spacing(6)]">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              maxLength={120}
              defaultValue={product?.name}
              placeholder="Costa Rica Tarrazú Honey"
              className="h-10"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                name="origin"
                required
                maxLength={120}
                defaultValue={product?.origin}
                placeholder="Tarrazú, Costa Rica"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="roastLevel">Roast level</Label>
              <Select
                name="roastLevel"
                defaultValue={product?.roastLevel ?? "Medium"}
              >
                <SelectTrigger id="roastLevel" className="h-10! w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROAST_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="basePrice">Base price (USD per kg)</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                required
                defaultValue={product?.basePrice}
                placeholder="23.50"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="moqKg">Minimum per order (kg)</Label>
              <Input
                id="moqKg"
                name="moqKg"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                defaultValue={product?.moqKg ?? 1}
                required
                className="h-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm leading-none font-medium">
              Coffee bag image
            </span>
            {imageUrl ? (
              <div className="flex items-center gap-4 rounded-xl border border-input p-3">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-espresso">
                  <Image
                    src={imageUrl}
                    alt="Product image"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {imageUrl === product?.imageUrl
                      ? "Current image"
                      : "Image uploaded"}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setImageUrl("")}
                  >
                    Replace image
                  </Button>
                </div>
              </div>
            ) : (
              <UploadDropzone
                endpoint="productImage"
                config={{ mode: "auto" }}
                onClientUploadComplete={(files) => {
                  const url = files[0]?.ufsUrl;
                  if (url) {
                    setImageUrl(url);
                    setError(undefined);
                  }
                }}
                onUploadError={(uploadError) => {
                  toast.error(`Upload failed: ${uploadError.message}`);
                }}
                appearance={{
                  container:
                    "mt-0 cursor-pointer rounded-xl border-2 border-dashed border-input bg-muted/50 px-4 py-8",
                  uploadIcon: "text-muted-foreground",
                  label: "text-foreground! hover:text-gold-ink!",
                  allowedContent: "text-muted-foreground",
                  // UploadThing ships blue defaults for these; ! wins the tie.
                  button:
                    "bg-primary! text-primary-foreground! after:bg-gold-ink/40! focus-within:ring-ring! data-[state=disabled]:opacity-60",
                }}
              />
            )}
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
            {isSaving ? "Saving…" : product ? "Save changes" : "Save product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
