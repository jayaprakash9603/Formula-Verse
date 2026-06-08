import { motion } from "framer-motion";
import { Building2, Gamepad2, MapPin, Rocket, Ruler, Bot } from "lucide-react";
import SectionShell from "./SectionShell";

const APPS = [
  { icon: Building2, title: "Architecture", desc: "Ensuring walls meet at perfect 90° angles in skyscrapers and bridges." },
  { icon: Ruler, title: "Construction", desc: "Carpenters use 3-4-5 triangles to square foundations before building." },
  { icon: MapPin, title: "GPS Systems", desc: "Satellite triangulation calculates your position using distance geometry." },
  { icon: Gamepad2, title: "Game Development", desc: "Collision detection and character movement rely on distance formulas." },
  { icon: Bot, title: "Robotics", desc: "Robot arms compute reach distances to grab objects precisely." },
  { icon: Rocket, title: "Space Science", desc: "Trajectory calculations use right-triangle decomposition constantly." },
];

export default function ApplicationsGrid() {
  return (
    <SectionShell
      id="applications"
      title="Real-Life Applications"
      subtitle="This ancient theorem powers modern technology you use every day."
      centered
      contentClassName="max-w-[1174px] mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {APPS.map((app, i) => (
          <motion.div
            key={app.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="neu-flat neu-interactive rounded-2xl p-6 bg-card group"
          >
            <app.icon
              size={28}
              className="text-primary mb-4 transition-transform group-hover:scale-110"
              aria-hidden="true"
            />
            <h3 className="font-display font-bold text-foreground mb-2">{app.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
