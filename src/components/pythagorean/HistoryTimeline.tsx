import { motion } from "framer-motion";
import SectionShell from "./SectionShell";

const EVENTS = [
  { year: "1900 BCE", place: "Babylon", detail: "Clay tablets record triples like 3-4-5 long before formal proofs." },
  { year: "1650 BCE", place: "Egypt", detail: "Builders used knotted ropes to lay out perfect right angles for pyramids." },
  { year: "600 BCE", place: "India", detail: "Sulba Sutras describe geometric constructions using the theorem." },
  { year: "500 BCE", place: "Greece", detail: "Pythagoras and his school proved it for all right triangles." },
  { year: "300 BCE", place: "China", detail: "Zhou Bi Suan Jing contains visual proofs using area rearrangement." },
];

export default function HistoryTimeline() {
  return (
    <SectionShell
      id="history"
      title="A Story Across Civilizations"
      subtitle="The theorem was discovered independently by cultures separated by oceans and millennia."
      className="bg-card/50"
      centered
    >
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-primary/30" />
        <div className="space-y-8">
          {EVENTS.map((event, i) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative pl-12 sm:pl-20"
            >
              <span className="absolute left-2 sm:left-6 top-2 h-4 w-4 rounded-full bg-primary neu-raised" />
              <div className="neu-flat rounded-xl p-5 bg-card">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-bold text-primary">{event.year}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{event.place}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{event.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
