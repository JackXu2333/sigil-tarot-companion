import { supabase } from "@/integrations/supabase/client";
import { getDemoMode } from "@/lib/demoMode";
import { 
  sampleClients, 
  clientData, 
  clientMBTIData, 
  clientAttachmentData, 
  clientAbilitiesData 
} from "@/data/mockData";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  pronouns: string | null;
  how_we_met: string | null;
  current_vibe: string | null;
  relationship_goal: string | null;
  work_industry: string | null;
  spiritual_beliefs: string | null;
  communication_style: string | null;
  core_value: string | null;
  birth_day: string | null;
  ethnicity: string | null;
  client_since: string | null;
  reader_notes: string | null;
  avatar: string | null;
  tags: string[] | null;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientMBTI {
  id: string;
  client_id: string;
  mbti_type: string | null;
  ie_score: number | null;
  ns_score: number | null;
  ft_score: number | null;
  jp_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClientAttachment {
  id: string;
  client_id: string;
  anxiety_score: number | null;
  avoidance_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClientAbilities {
  id: string;
  client_id: string;
  intuition: number | null;
  empathy: number | null;
  ambition: number | null;
  intellect: number | null;
  creativity: number | null;
  self_awareness: number | null;
  created_at: string;
  updated_at: string;
}

export interface FullClient extends Client {
  mbti?: ClientMBTI;
  attachment?: ClientAttachment;
  abilities?: ClientAbilities;
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    if (getDemoMode()) {
      const demoClients = sampleClients.map((c) => ({
        ...clientData[c.id as keyof typeof clientData],
        id: String(c.id),
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as Client[];
      return Promise.resolve(demoClients);
    }
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getClientById(id: string): Promise<FullClient | null> {
    if (getDemoMode()) {
      const client = clientData[Number(id) as keyof typeof clientData];
      if (client) {
        const mbti = clientMBTIData[Number(id) as keyof typeof clientMBTIData] || undefined;
        const attachment = clientAttachmentData[Number(id) as keyof typeof clientAttachmentData] || undefined;
        const abilities = clientAbilitiesData[Number(id) as keyof typeof clientAbilitiesData] || undefined;
        
        return Promise.resolve({
          ...client,
          id: String(client.id),
          user_id: "demo-user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          mbti,
          attachment,
          abilities,
        } as FullClient);
      }
      return Promise.resolve(null);
    }
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (clientError) throw clientError;
    if (!client) return null;

    // Get related data
    const [mbtiResult, attachmentResult, abilitiesResult] = await Promise.all([
      supabase
        .from("client_mbti")
        .select("*")
        .eq("client_id", id)
        .maybeSingle(),
      supabase
        .from("client_attachment")
        .select("*")
        .eq("client_id", id)
        .maybeSingle(),
      supabase
        .from("client_abilities")
        .select("*")
        .eq("client_id", id)
        .maybeSingle(),
    ]);

    return {
      ...client,
      mbti: mbtiResult.data || undefined,
      attachment: attachmentResult.data || undefined,
      abilities: abilitiesResult.data || undefined,
    };
  },

  async createClient(
    clientData: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<Client> {
    if (getDemoMode()) {
      const newClient = {
        ...clientData,
        id: String(Date.now()),
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return Promise.resolve(newClient);
    }
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("clients")
      .insert({
        ...clientData,
        user_id: session.session.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    if (getDemoMode()) {
      // This is a mock, so we just return the updated data
      return Promise.resolve({ ...clientData, id } as Client);
    }
    const { data, error } = await supabase
      .from("clients")
      .update(clientData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClient(id: string): Promise<void> {
    if (getDemoMode()) {
      return Promise.resolve();
    }
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) throw error;
  },

  async updateClientMBTI(
    clientId: string,
    mbtiData: Partial<ClientMBTI>
  ): Promise<ClientMBTI> {
    if (getDemoMode()) {
      const existingMbti = clientMBTIData[Number(clientId) as keyof typeof clientMBTIData];
      return Promise.resolve({
        ...existingMbti,
        ...mbtiData,
        id: existingMbti?.id || "demo-mbti-" + clientId,
        client_id: clientId,
      } as ClientMBTI);
    }
    const { data, error } = await supabase
      .from("client_mbti")
      .upsert({
        ...mbtiData,
        client_id: clientId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateClientAttachment(
    clientId: string,
    attachmentData: Partial<ClientAttachment>
  ): Promise<ClientAttachment> {
    if (getDemoMode()) {
      const existingAttachment = clientAttachmentData[Number(clientId) as keyof typeof clientAttachmentData];
      return Promise.resolve({
        ...existingAttachment,
        ...attachmentData,
        id: existingAttachment?.id || "demo-attachment-" + clientId,
        client_id: clientId,
      } as ClientAttachment);
    }
    const { data, error } = await supabase
      .from("client_attachment")
      .upsert({
        ...attachmentData,
        client_id: clientId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateClientAbilities(
    clientId: string,
    abilitiesData: Partial<ClientAbilities>
  ): Promise<ClientAbilities> {
    if (getDemoMode()) {
      const existingAbilities = clientAbilitiesData[Number(clientId) as keyof typeof clientAbilitiesData];
      return Promise.resolve({
        ...existingAbilities,
        ...abilitiesData,
        id: existingAbilities?.id || "demo-abilities-" + clientId,
        client_id: clientId,
      } as ClientAbilities);
    }
    const { data, error } = await supabase
      .from("client_abilities")
      .upsert({
        ...abilitiesData,
        client_id: clientId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLastContact(clientId: string): Promise<void> {
    if (getDemoMode()) {
      return Promise.resolve();
    }

    // Get the most recent reading for this client
    const { data: readings, error: readingsError } = await supabase
      .from("readings")
      .select("reading_date, created_at")
      .eq("client_id", clientId)
      .order("reading_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1);

    if (readingsError) throw readingsError;

    if (readings && readings.length > 0) {
      const mostRecent = readings[0];
      const lastContactDate = mostRecent.reading_date || mostRecent.created_at.split('T')[0];
      
      // Format as relative time string
      const lastContactFormatted = this.formatRelativeDate(lastContactDate);

      const { error: updateError } = await supabase
        .from("clients")
        .update({ last_contact: lastContactFormatted })
        .eq("id", clientId);

      if (updateError) throw updateError;
    }
  },

  formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "1 day ago";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
  },

  async getClientsWithCalculatedLastContact(): Promise<Client[]> {
    if (getDemoMode()) {
      const demoClients = sampleClients.map((c) => ({
        ...clientData[c.id as keyof typeof clientData],
        id: String(c.id),
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as Client[];
      return Promise.resolve(demoClients);
    }

    // Get all clients
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .order("updated_at", { ascending: false });

    if (clientsError) throw clientsError;
    if (!clients) return [];

    // For each client, calculate their last contact from readings
    const clientsWithLastContact = await Promise.all(
      clients.map(async (client) => {
        const { data: readings } = await supabase
          .from("readings")
          .select("reading_date, created_at")
          .eq("client_id", client.id)
          .order("reading_date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(1);

        let calculatedLastContact = "Never";
        if (readings && readings.length > 0) {
          const mostRecent = readings[0];
          const lastContactDate = mostRecent.reading_date || mostRecent.created_at.split('T')[0];
          calculatedLastContact = this.formatRelativeDate(lastContactDate);
        }

        return {
          ...client,
          last_contact: calculatedLastContact,
        };
      })
    );

    return clientsWithLastContact;
  },
};