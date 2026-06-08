"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface SegmentedTabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

export interface SegmentedTabsProps {
  items: SegmentedTabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  /** Stretch triggers to fill the track width evenly. Defaults to scrollable, content-sized triggers. */
  fitted?: boolean;
  ariaLabel?: string;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}

export default function SegmentedTabs({
  items,
  defaultValue,
  value,
  onValueChange,
  fitted = false,
  ariaLabel,
  className,
  listClassName,
  contentClassName,
}: SegmentedTabsProps) {
  const reduceMotion = useReducedMotion();
  const pillId = React.useId();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? items[0]?.id);
  const activeValue = isControlled ? value : internalValue;

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  if (items.length === 0) return null;

  return (
    <Tabs
      className={cn("w-full", className)}
      value={activeValue}
      onValueChange={handleValueChange}
    >
      <TabsList
        aria-label={ariaLabel}
        className={cn(
          "no-scrollbar max-w-full overflow-x-auto",
          fitted ? "justify-stretch" : "justify-start",
          listClassName,
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeValue;
          return (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className={fitted ? "flex-1" : "flex-none"}
            >
              {isActive && (
                <motion.span
                  layoutId={`segmented-pill-${pillId}`}
                  className="neu-raised pointer-events-none absolute inset-0 rounded-lg bg-background"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {Icon ? <Icon size={16} aria-hidden="true" /> : null}
                {item.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {items.map((item) => (
        <TabsContent
          key={item.id}
          value={item.id}
          className={cn("mt-6", contentClassName)}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
