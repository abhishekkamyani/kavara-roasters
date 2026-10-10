"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantityStepper({
  value,
  min,
  onChange,
  label,
}: {
  value: number;
  min: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center rounded-lg border border-input"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Decrease by 1kg"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus />
      </Button>
      <span className="min-w-10 text-center text-sm font-medium tabular-nums">
        {value}kg
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Increase by 1kg"
        onClick={() => onChange(value + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}
