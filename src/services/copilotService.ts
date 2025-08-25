import { supabase } from "@/integrations/supabase/client";
import type { FullClient } from "./clientService";

export interface CopilotInsights {
  sentiment: {
    overall: number;
    emotional: number;
    practical: number;
  };
  scales: {
    clarity: number;
    agency: number;
    timing: "immediate" | "short-term" | "medium-term" | "long-term";
    difficulty: number;
    opportunity: number;
  };
  energyBalance: {
    active: number;
    receptive: number;
    mental: number;
    emotional: number;
    spiritual: number;
    material: number;
  };
  keyThemes: string[];
  dominantElements: {
    fire: number;
    water: number;
    air: number;
    earth: number;
  };
  archetypeIntensity: Array<{
    archetype: string;
    intensity: number;
  }>;
  potentialNarrative: string;
  questionsToAsk: string[];
  transformationPotential: {
    current: "stuck" | "transitioning" | "flowing" | "blocked";
    potential: "breakthrough" | "gradual-shift" | "maintenance" | "regression";
    likelihood: number;
  };
  cardSynergies?: Array<{
    cards: string[];
    interpretation: string;
    intensity: number;
  }>;
  actionPoints?: string[];
  warningSignals?: Array<{
    signal: string;
    severity: number;
  }>;
}

export async function getCopilotInsights({ question, cards, user }: {
  question: string;
  cards: string[];
  user: FullClient | null;
}): Promise<CopilotInsights> {
  const { data, error } = await supabase.functions.invoke('interpret-cards', {
    body: { question, cards, user },
  });
  if (error) throw error;
  return data;
}

// Demo/mock insights for UI testing
export const demoCopilotInsights: CopilotInsights = {
    "sentiment": {
        "overall": 0.7,
        "emotional": 0.8,
        "practical": 0.6
    },
    "scales": {
        "clarity": 8,
        "agency": 7,
        "timing": "immediate",
        "difficulty": 4,
        "opportunity": 8
    },
    "energyBalance": {
        "active": 80,
        "receptive": 60,
        "mental": 70,
        "emotional": 90,
        "spiritual": 50,
        "material": 50
    },
    "keyThemes": [
        "Swift celebration of justice",
        "Harmonious resolution",
        "Social equilibrium",
        "Dynamic progress"
    ],
    "dominantElements": {
        "fire": 40,
        "water": 30,
        "air": 20,
        "earth": 10
    },
    "archetypeIntensity": [
        {
            "archetype": "The Celebrant",
            "intensity": 8
        },
        {
            "archetype": "The Judge",
            "intensity": 7
        },
        {
            "archetype": "The Messenger",
            "intensity": 6
        }
    ],
    "potentialNarrative": "A situation is rapidly moving toward its natural resolution, carried forward by the support and celebration of community. Justice arrives swiftly, bringing balance and fairness, while friendship and joy act as catalysts for positive change.",
    "questionsToAsk": [
        "How can you balance swift action with fair consideration?",
        "What role does your community play in your success?",
        "How do you celebrate while maintaining equilibrium?"
    ],
    "transformationPotential": {
        "current": "flowing",
        "potential": "breakthrough",
        "likelihood": 8
    },
    "cardSynergies": [
        {
            "cards": [
                "Eight of Wands",
                "Justice"
            ],
            "interpretation": "Swift arrival of karmic balance",
            "intensity": 9
        },
        {
            "cards": [
                "Three of Cups",
                "Justice"
            ],
            "interpretation": "Community celebration of fairness",
            "intensity": 7
        }
    ],
    "actionPoints": [
        "Act decisively while maintaining fairness",
        "Engage with supportive community members",
        "Celebrate milestones while staying balanced"
    ],
    "warningSignals": [
        {
            "signal": "Don't let speed compromise fairness",
            "severity": 4
        },
        {
            "signal": "Avoid excessive celebration clouding judgment",
            "severity": 3
        }
    ]
}