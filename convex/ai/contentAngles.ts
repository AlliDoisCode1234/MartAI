/**
 * The Content Angle Matrix
 * 
 * Defines highly opinionated narrative structures for the "Blog" content type.
 * Ensures the AI never generates generic "What is X" filler by forcing a specific
 * perspective and structural argument.
 */

export const CONTENT_ANGLES = {
  mythbuster: {
    id: 'mythbuster',
    name: 'The Mythbuster',
    description: 'Debunks common industry misconceptions.',
    instruction: `
      ANGLE: The Mythbuster
      - You must start by identifying 2-3 common misconceptions or "myths" related to the keyword.
      - Systematically debunk each myth using data, logic, and the brand's unique value propositions.
      - Structure your H2s around the myths themselves (e.g., "Myth 1: [Statement]", "The Reality: [Truth]").
      - Maintain an authoritative but accessible tone.
    `
  },
  pricing_guide: {
    id: 'pricing_guide',
    name: 'The Ultimate Pricing Guide',
    description: 'Focuses on transparency, costs, and ROI.',
    instruction: `
      ANGLE: The Ultimate Pricing Guide
      - Focus heavily on ROI, cost breakdown, and hidden fees related to the keyword.
      - Address the reader's underlying anxiety about "how much this really costs".
      - Structure your H2s around cost components, factors influencing price, and long-term ROI.
      - Provide actionable frameworks for how the reader can budget for this.
    `
  },
  how_to_guide: {
    id: 'how_to_guide',
    name: 'The Step-by-Step Guide',
    description: 'Actionable, step-by-step instructions for practitioners.',
    instruction: `
      ANGLE: The Step-by-Step Practitioner Guide
      - Assume the reader already knows *what* the topic is; they need to know *how* to execute it.
      - Structure the article as a chronological sequence of actionable steps.
      - Provide real-world examples, potential pitfalls, and expert tips for each step.
      - Do not include fluff introductions defining the keyword. Jump straight into the execution.
    `
  },
  local_spotlight: {
    id: 'local_spotlight',
    name: 'The Local Spotlight',
    description: 'Hyper-localized content for geo-targeted keywords.',
    instruction: `
      ANGLE: The Local Spotlight
      - Strongly anchor the content to a specific geographical location and local market dynamics.
      - Reference local trends, climate/geography, local regulations, or community standards if applicable.
      - Structure the H2s to emphasize why this service/product matters specifically in this local area.
      - Build trust by demonstrating "boots on the ground" local expertise.
    `
  },
  contrarian: {
    id: 'contrarian',
    name: 'The Contrarian Take',
    description: 'Argues against the conventional industry wisdom.',
    instruction: `
      ANGLE: The Contrarian Take
      - Identify the "conventional wisdom" surrounding this keyword that everyone else repeats.
      - Provide a strong, well-reasoned argument for why that conventional wisdom is wrong or outdated.
      - Structure your H2s to build a persuasive counter-narrative.
      - Be bold and opinionated, positioning the brand as a thought leader that sees what others miss.
    `
  }
} as const;

export type ContentAngleId = keyof typeof CONTENT_ANGLES;

/**
 * Intelligently select an angle based on the keyword string.
 * This is a lightweight heuristic; eventually can be replaced by an LLM intent classifier.
 */
export function determineContentAngle(keyword: string): ContentAngleId {
  const kw = keyword.toLowerCase();
  
  if (kw.includes('cost') || kw.includes('price') || kw.includes('cheap') || kw.includes('worth')) {
    return 'pricing_guide';
  }
  
  if (kw.includes('how to') || kw.includes('guide') || kw.includes('steps') || kw.includes('tutorial')) {
    return 'how_to_guide';
  }
  
  if (kw.includes('near me') || kw.includes('city') || kw.includes('local') || kw.includes('service in')) {
    return 'local_spotlight';
  }

  // Deterministically select between mythbuster and contrarian for informational queries
  // to guarantee variety while ensuring mutation safety.
  const hash = kw.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 2 === 0 ? 'mythbuster' : 'contrarian';
}
