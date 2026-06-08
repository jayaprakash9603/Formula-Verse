import { motion } from "framer-motion";

export default function FooterCTA() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="neu-inset rounded-3xl p-12 sm:p-16 text-center bg-background max-w-4xl mx-auto"
      >
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
          Mathematics You Can Finally SEE.
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Explore dozens of interactive formula visualizers across math, physics, finance, and more.
        </p>
        <a
          href="/formulas"
          className="inline-flex items-center gap-2 neu-raised neu-interactive rounded-xl px-8 py-4 font-semibold text-sm"
          style={{ background: "var(--brand)", color: "var(--primary-foreground)" }}
        >
          Explore More Formulas
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
