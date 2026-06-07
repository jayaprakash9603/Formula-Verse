import type { FormulaVisualizerConfig } from "@/engines/formula-visualizer/types";
import { SITE_NAME, SITE_URL } from "./site";

export function buildBreadcrumbJsonLd(
  crumbs: { name: string; url?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.url ? { item: c.url } : {}),
    })),
  };
}

export function buildSoftwareAppJsonLd(
  config: FormulaVisualizerConfig,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.seo.title,
    url,
    description: config.seo.description,
    applicationCategory: "EducationApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function buildHowToJsonLd(
  config: FormulaVisualizerConfig,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use the ${config.name} Calculator and Visualizer`,
    url,
    step: config.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: text.split(".")[0] ?? text,
      text,
    })),
  };
}

export function buildFaqJsonLd(config: FormulaVisualizerConfig, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url,
    mainEntity: config.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function buildCollectionPageJsonLd(
  formulas: FormulaVisualizerConfig[],
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME} — Interactive Formula Visualizers`,
    url,
    hasPart: formulas.map((f) => ({
      "@type": "SoftwareApplication",
      name: f.seo.title,
      url: `${SITE_URL}/tools/${f.slug}`,
      applicationCategory: "EducationApplication",
    })),
  };
}
