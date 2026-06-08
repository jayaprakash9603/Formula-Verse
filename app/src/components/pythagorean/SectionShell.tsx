import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionShellProps {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  centered?: boolean;
}

export default function SectionShell({
  id,
  title,
  subtitle,
  children,
  className = "",
  contentClassName = "",
  centered = false,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`w-full px-4 sm:px-8 md:px-12 py-20 sm:py-28 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`mb-12 max-w-3xl ${centered ? "mx-auto text-center" : ""}`}
      >
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {title}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">{subtitle}</p>
      </motion.div>
      {contentClassName ? <div className={contentClassName}>{children}</div> : children}
    </section>
  );
}
