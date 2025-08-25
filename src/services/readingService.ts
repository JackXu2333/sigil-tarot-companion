import { supabase } from "@/integrations/supabase/client";
import { getDemoMode } from "@/lib/demoMode";
import { readingData as mockReadingData } from "@/data/mockData";
import type { CopilotInsights } from "./copilotService";

// Enhanced AI Insights Interfaces
export interface Sentiment {
  overall: number; // -1 to 1
  emotional: number; // -1 to 1
  practical: number; // -1 to 1
}

export interface Scales {
  clarity: number; // 0-10
  agency: number; // 0-10
  timing: "immediate" | "short-term" | "medium-term" | "long-term";
  difficulty: number; // 0-10
  opportunity: number; // 0-10
}

export interface EnergyBalance {
  active: number; // 0-100
  receptive: number; // 0-100
  mental: number; // 0-100
  emotional: number; // 0-100
  spiritual: number; // 0-100
  material: number; // 0-100
}

export interface DominantElements {
  fire: number; // 0-100
  water: number; // 0-100
  air: number; // 0-100
  earth: number; // 0-100
}

export interface ArchetypeIntensity {
  archetype: string;
  intensity: number; // 0-10
}

export interface TransformationPotential {
  current: "stuck" | "transitioning" | "flowing" | "blocked";
  potential: "breakthrough" | "gradual-shift" | "maintenance" | "regression";
  likelihood: number; // 0-10
}

export interface CardSynergy {
  cards: string[];
  interpretation: string;
  intensity: number; // 0-10
}

export interface WarningSignal {
  signal: string;
  severity: number; // 0-10
}

export interface AIInsights {
  sentiment: Sentiment;
  scales: Scales;
  energyBalance: EnergyBalance;
  keyThemes: string[];
  dominantElements: DominantElements;
  archetypeIntensity: ArchetypeIntensity[];
  potentialNarrative: string;
  questionsToAsk: string[];
  transformationPotential: TransformationPotential;
  cardSynergies?: CardSynergy[];
  actionPoints?: string[];
  warningSignals?: WarningSignal[];
}

export interface Reading {
  id: string;
  client_id: string;
  user_id: string;
  reading_type: string | null;
  question: string | null;
  cards: string[] | null;
  subjective: string | null;
  assessment: string | null;
  plan: string | null;
  content: string | null;
  insights?: CopilotInsights; // Canonical insights field
  reading_date: string;
  created_at: string;
  updated_at: string;
}

// Helper functions for analyzing insights
export const insightsAnalyzer = {
  getSentimentLabel: (value: number): string => {
    if (value >= 0.6) return "Very Positive";
    if (value >= 0.2) return "Positive";
    if (value >= -0.2) return "Neutral";
    if (value >= -0.6) return "Challenging";
    return "Very Challenging";
  },

  getScaleLabel: (scale: keyof Omit<Scales, 'timing'>, value: number): string => {
    const labels = {
      clarity: ["Very Confusing", "Confusing", "Unclear", "Somewhat Clear", "Clear", "Very Clear"],
      agency: ["No Control", "Little Control", "Some Control", "Good Control", "Strong Control", "Full Control"],
      difficulty: ["Very Easy", "Easy", "Manageable", "Moderate", "Challenging", "Very Difficult"],
      opportunity: ["No Opportunity", "Limited", "Some Potential", "Good Potential", "High Potential", "Excellent"]
    };
    
    const scaleLabels = labels[scale];
    const index = Math.min(Math.floor((value / 10) * scaleLabels.length), scaleLabels.length - 1);
    return scaleLabels[index];
  },

  getDominantElement: (elements: DominantElements): string => {
    const entries = Object.entries(elements);
    const dominant = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    return dominant[0];
  },

  getEnergyProfile: (balance: EnergyBalance): string => {
    if (balance.active > balance.receptive + 20) return "Action-Oriented";
    if (balance.receptive > balance.active + 20) return "Receptive";
    return "Balanced";
  },

  getTopArchetypes: (archetypes: ArchetypeIntensity[], count: number = 3): ArchetypeIntensity[] => {
    return archetypes
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, count);
  }
};

export const readingService = {
  async getReadingsByClientId(clientId: string): Promise<Reading[]> {
    if (getDemoMode()) {
      return Promise.resolve(mockReadingData[Number(clientId) as keyof typeof mockReadingData] || []);
    }
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .eq("client_id", clientId)
      .order("reading_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createReading(
    readingData: Omit<Reading, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<Reading> {
    if (getDemoMode()) {
        const newReading = { ...readingData, id: String(Date.now()), user_id: 'demo-user', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        return Promise.resolve(newReading);
    }
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("readings")
      .insert({
        ...readingData,
        user_id: session.session.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Update the client's last contact automatically
    if (data && readingData.client_id) {
      // Import clientService to update last contact
      // Note: We'll need to import this at the top of the file
      const { clientService } = await import("./clientService");
      try {
        await clientService.updateLastContact(readingData.client_id);
      } catch (contactUpdateError) {
        // Log but don't fail the reading creation if contact update fails
        console.warn("Failed to update client last contact:", contactUpdateError);
      }
    }

    return data;
  },

  async updateReading(
    id: string,
    readingData: Partial<Reading>
  ): Promise<Reading> {
    if (getDemoMode()) {
        return Promise.resolve({ ...readingData, id } as Reading);
    }
    const { data, error } = await supabase
      .from("readings")
      .update(readingData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteReading(id: string): Promise<void> {
    if (getDemoMode()) {
        return Promise.resolve();
    }
    const { error } = await supabase.from("readings").delete().eq("id", id);

    if (error) throw error;
  },

  async getAllReadings(): Promise<Reading[]> {
    if (getDemoMode()) {
        const allReadings = Object.values(mockReadingData).flat();
        return Promise.resolve(allReadings);
    }
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .order("reading_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};