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
};