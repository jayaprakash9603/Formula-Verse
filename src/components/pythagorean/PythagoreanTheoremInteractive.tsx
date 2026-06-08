import HeroSection from "./HeroSection";
import InteractiveTriangle from "./InteractiveTriangle";
import DerivationAnimation from "./DerivationAnimation";
import HistoryTimeline from "./HistoryTimeline";
import ApplicationsGrid from "./ApplicationsGrid";
import ProofTabs from "./ProofTabs";
import QuizSection from "./QuizSection";
import VideoSection from "./VideoSection";
import RelatedFormulaCards from "./RelatedFormulaCards";
import FooterCTA from "./FooterCTA";

export default function PythagoreanTheoremInteractive() {
  return (
    <article className="w-full overflow-x-hidden">
      <HeroSection />
      <InteractiveTriangle />
      <DerivationAnimation />
      <HistoryTimeline />
      <ApplicationsGrid />
      <ProofTabs />
      <QuizSection />
      <VideoSection />
      <RelatedFormulaCards />
      <FooterCTA />
    </article>
  );
}
