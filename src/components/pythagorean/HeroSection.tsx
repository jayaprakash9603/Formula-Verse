import { motion } from "framer-motion";
import HeroSolverAnimation from "./HeroSolverAnimation";

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 10 + (i * 7) % 80,
  y: 15 + (i * 11) % 70,
  delay: i * 0.3,
}));

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col">
      <div className="absolute inset-0 hero-grid-bg pointer-events-none opacity-60" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, var(--brand-soft), transparent 70%)",
        }}
      />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary/40"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative flex-1 w-full px-4 sm:px-8 md:px-12 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span
            className="inline-flex items-center gap-2 neu-flat rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
            style={{ color: "var(--brand)", background: "var(--brand-soft)" }}
          >
            Interactive Mathematics
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            The Pythagorean Theorem
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
            See why the square of the hypotenuse equals the sum of the other two sides.
          </p>
          <a
            href="#playground"
            className="inline-flex items-center gap-2 neu-raised neu-interactive rounded-xl px-7 py-3.5 font-semibold text-sm"
            style={{ background: "var(--brand)", color: "var(--primary-foreground)" }}
          >
            Start exploring
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <HeroSolverAnimation />
        </motion.div>
      </div>

      <motion.a
        href="#playground"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to playground"
      >
        <span>Scroll to explore</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.a>
    </section>
  );
}
