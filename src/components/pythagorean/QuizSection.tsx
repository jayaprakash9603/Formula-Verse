import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionShell from "./SectionShell";

const QUESTIONS = [
  {
    q: "A right triangle has sides 5 and 12. What is the hypotenuse?",
    options: ["13", "17", "15", "10"],
    answer: "13",
  },
  {
    q: "If a = 3 and b = 4, what is c²?",
    options: ["7", "25", "12", "49"],
    answer: "25",
  },
  {
    q: "Which triangle satisfies the Pythagorean theorem?",
    options: ["3-4-5", "2-3-4", "5-6-8", "4-5-6"],
    answer: "3-4-5",
  },
];

export default function QuizSection() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const question = QUESTIONS[current];

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === question.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 1200);
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };

  return (
    <SectionShell
      id="quiz"
      title="Quick Practice Quiz"
      subtitle="Test your understanding with three fast challenges."
      centered
      contentClassName="max-w-[1174px] mx-auto"
    >
      <div className="max-w-xl mx-auto neu-flat rounded-2xl p-8 bg-card">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl font-bold text-primary">{score}/{QUESTIONS.length}</div>
              <p className="text-muted-foreground">
                {score === QUESTIONS.length ? "Perfect! You nailed it." : "Good effort — keep exploring!"}
              </p>
              <button type="button" onClick={reset} className="neu-raised neu-interactive rounded-xl px-6 py-3 text-sm font-semibold bg-card">
                Try again
              </button>
            </motion.div>
          ) : (
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>Question {current + 1} of {QUESTIONS.length}</span>
                <span>Score: {score}</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-6">{question.q}</h3>
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === question.answer;
                  const showResult = selected !== null;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswer(opt)}
                      disabled={selected !== null}
                      className={`neu-flat rounded-xl py-4 text-sm font-semibold transition-all ${
                        showResult && isCorrect ? "ring-2 ring-success text-success" :
                        showResult && isSelected && !isCorrect ? "ring-2 ring-destructive text-destructive" :
                        "neu-interactive bg-background hover:text-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
