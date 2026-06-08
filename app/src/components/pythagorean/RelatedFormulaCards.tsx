import { motion } from "framer-motion";
import SectionShell from "./SectionShell";

const RELATED = [
  { title: "Distance Formula", formula: "d = √((x₂−x₁)² + (y₂−y₁)²)", href: "/formulas/math", desc: "Pythagorean theorem on a coordinate plane." },
  { title: "Trigonometry", formula: "sin²θ + cos²θ = 1", href: "/formulas/math", desc: "The triangle ratios that extend Pythagoras." },
  { title: "Coordinate Geometry", formula: "midpoint & slope", href: "/formulas/math", desc: "Connecting algebra with geometric shapes." },
  { title: "Similar Triangles", formula: "a/b = c/d", href: "/formulas/math", desc: "Proportional sides unlock another proof path." },
];

export default function RelatedFormulaCards() {
  return (
    <SectionShell
      id="related"
      title="Related Formulas"
      subtitle="Concepts that build on or connect to the Pythagorean theorem."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RELATED.map((item, i) => (
          <motion.a
            key={item.title}
            href={item.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="neu-flat neu-interactive rounded-2xl p-6 bg-card block group"
          >
            <h3 className="font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="font-mono text-xs text-primary mb-3">{item.formula}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.a>
        ))}
      </div>
    </SectionShell>
  );
}
