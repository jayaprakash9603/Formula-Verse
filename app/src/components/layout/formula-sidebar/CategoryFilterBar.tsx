"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CategoryIcon } from "@/lib/formula-icons";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";
import { CATEGORY_META } from "./constants";

interface TabItem {
  id: string;
  label: string;
  category: string | null;
  icon?: React.ReactNode;
}

interface Props {
  categories: string[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilterBar({ categories, activeCategory, onSelect }: Props) {
  const reduceMotion = useReducedMotion();
  const pillId = React.useId();

  const tabs = React.useMemo<TabItem[]>(
    () => [
      { id: "all", label: "All", category: null },
      ...categories.map((cat) => ({
        id: cat,
        label: CATEGORY_META[cat]?.short ?? cat,
        category: cat,
        icon: <CategoryIcon category={cat} size={14} aria-hidden="true" />,
      })),
    ],
    [categories],
  );

  const activeId = activeCategory ?? "all";

  return (
    <div className="px-4 pb-3">
      <div
        className={cn(
          neuVariants({ elevation: "inset", shape: "lg" }),
          "fv-category-track bg-background p-1",
        )}
      >
        <div
          role="tablist"
          aria-label="Filter by category"
          className="fv-category-scroll no-scrollbar flex gap-1 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="formula-list"
                onClick={() => onSelect(isActive && tab.category ? null : tab.category)}
                className={cn(
                  "fv-category-tab relative inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2",
                  "text-xs font-medium transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                  isActive
                    ? "fv-category-tab-active text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId={`fv-category-pill-${pillId}`}
                    className="fv-category-pill absolute inset-0 rounded-lg bg-primary"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 34 }
                    }
                  />
                ) : null}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
