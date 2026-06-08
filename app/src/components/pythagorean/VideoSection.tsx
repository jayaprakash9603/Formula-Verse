import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionShell from "./SectionShell";

const LESSONS = [
  { title: "Distance Formula Explained", duration: "4:20" },
  { title: "Introduction to Trigonometry", duration: "6:15" },
  { title: "Coordinate Geometry Basics", duration: "5:40" },
];

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    setPlaying(true);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 200);
  };

  return (
    <SectionShell
      id="video"
      title="Video Explainer"
      subtitle="Watch a guided walkthrough of the theorem in action."
      className="bg-card/50"
      centered
      contentClassName="max-w-[1174px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div className="neu-flat rounded-2xl overflow-hidden bg-card">
          <div className="relative aspect-video bg-background flex items-center justify-center">
            {!playing ? (
              <button
                type="button"
                onClick={handlePlay}
                className="flex h-20 w-20 items-center justify-center rounded-full neu-raised neu-interactive bg-card text-primary"
                aria-label="Play video"
              >
                <Play size={32} fill="currentColor" />
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex items-center justify-center p-8"
              >
                <svg viewBox="0 0 300 200" className="w-full max-w-md" aria-label="Video animation placeholder">
                  <polygon points="60,160 60,80 180,160" fill="var(--brand-soft)" stroke="var(--primary)" strokeWidth="2" />
                  <motion.rect
                    x="60" y="160" width="120" height="120"
                    fill="var(--warning)" fillOpacity="0.3"
                    animate={{ width: [0, 120] }}
                    transition={{ duration: 2 }}
                  />
                  <text x="150" y="110" textAnchor="middle" className="fill-foreground font-mono text-sm">a² + b² = c²</text>
                </svg>
              </motion.div>
            )}
          </div>
          <div className="p-4">
            <div className="neu-inset rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pythagorean Theorem — Visual Proof (3:45)</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Related Lessons</h3>
          {LESSONS.map((lesson) => (
            <div key={lesson.title} className="neu-flat neu-interactive rounded-xl p-4 bg-card flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{lesson.title}</span>
              <span className="text-xs text-muted-foreground font-mono">{lesson.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
