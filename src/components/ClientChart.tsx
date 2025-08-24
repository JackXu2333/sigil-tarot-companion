// src/components/ClientChart.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, MessageSquare, Star, Edit, Sparkles, Save, X, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { clientService, type FullClient } from "@/services/clientService";
import { readingService } from "@/services/readingService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  pronounOptions,
  howWeMetOptions,
  relationshipGoalOptions,
  workIndustryOptions,
  spiritualBeliefsOptions,
  communicationStyleOptions,
  coreValueOptions,
  ethnicityOptions
} from "@/data/formOptions";

// Bipolar Slider component using native range input
const BipolarSlider = ({ value, onChange, leftLabel, rightLabel, label, min = 0, max = 100, step = 1 }: {
    value?: number;
    onChange: (value: number) => void;
    leftLabel: string;
    rightLabel: string;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
}) => (
    <div className="space-y-2">
        {label && <div className="text-sm font-medium text-gray-700">{label}</div>}
        <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-20 text-left">{leftLabel}</span>
            <input
                type="range"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                min={min}
                max={max}
                step={step}
                className="relative flex w-full touch-none select-none items-center accent-indigo-600"
            />
            <span className="text-xs text-gray-500 w-20 text-right">{rightLabel}</span>
        </div>
        <div className="text-center text-xs text-gray-500">{value}</div>
    </div>
);

const MBTIScale = ({ value, labels }: { value?: number; labels: [string, string] }) => {
  const safeValue = value ?? 50;
  return (
    <div className="w-full mb-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span className="font-medium">{labels[0]}</span>
        <span className="font-medium">{labels[1]}</span>
      </div>
      <div className="h-2.5 w-full bg-gray-200 rounded-full flex items-center">
        <div
          className="h-2.5 rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

const AttachmentStyleMatrix = ({ anxiety, avoidance }: { anxiety: number; avoidance: number }) => {
  const top = 100 - ((anxiety + 5) * 10);
  const left = (avoidance + 5) * 10;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachment Style</h4>
      <div className="relative aspect-square w-full bg-gray-100 rounded-lg p-2 border border-gray-200">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2" />
        <div
          className="absolute w-4 h-4 rounded-full bg-indigo-600 shadow-md transition-all duration-300"
          style={{ top: `calc(${top}% - 8px)`, left: `calc(${left}% - 8px)` }}
        />
        <span className="absolute top-1 left-1 text-xs text-gray-600 font-medium">Anxious</span>
        <span className="absolute bottom-1 left-1 text-xs text-gray-600 font-medium">Secure</span>
        <span className="absolute top-1 right-1 text-xs text-gray-600 font-medium">Fearful</span>
        <span className="absolute bottom-1 right-1 text-xs text-gray-600 font-medium">Avoidant</span>
      </div>
    </div>
  );
};


export default function ClientChart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<FullClient | null>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<FullClient>>({});
  const [quickAddNote, setQuickAddNote] = useState("");
  const [quickAddType, setQuickAddType] = useState("Note");

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const [clientData, readingsData] = await Promise.all([
          clientService.getClientById(id),
          readingService.getReadingsByClientId(id)
        ]);

        if (clientData && !clientData.client_since) {
          clientData.client_since = clientData.created_at;
        }
        setClient(clientData);
        setReadings(readingsData);
        setEditedClient(clientData || {});
      } catch (error) {
        console.error('Failed to load client data:', error);
        toast.error("Failed to load client data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, toast]);

  const handleSave = async () => {
    if (!client || !id) return;

    try {
      // Extract only basic information for the main client update
      const { mbti, attachment, abilities, ...basicInfo } = editedClient;

      // Update the main client data
      const updatedClient = await clientService.updateClient(id, basicInfo);

      // Update related data if it exists
      if (mbti) {
        await clientService.updateClientMBTI(id, mbti);
      }
      if (attachment) {
        await clientService.updateClientAttachment(id, attachment);
      }
      if (abilities) {
        await clientService.updateClientAbilities(id, abilities);
      }

      setClient({ ...client, ...updatedClient });
      setIsEditing(false);
      toast.success("Client updated successfully");
    } catch (error) {
      console.error("Failed to update client:", error);
      toast.error("Failed to update client");
    }
  };

  const handleCancel = () => {
    setEditedClient(client || {});
    setIsEditing(false);
  };

  const handleQuickAdd = async () => {
    if (!quickAddNote.trim() || !client || !id) return;

    try {
      const newReading = await readingService.createReading({
        client_id: id,
        reading_type: quickAddType,
        content: quickAddNote,
        reading_date: new Date().toISOString().split('T')[0],
      });

      setReadings([newReading, ...readings]);
      setQuickAddNote("");
      toast.success(`${quickAddType} added to timeline`);
    } catch (error) {
      console.error('Failed to add session:', error);
      toast.error(`Failed to add ${quickAddType}`);
    }
  };

  const handleMBTIChange = (field: keyof NonNullable<FullClient['mbti']>, value: number | string) => {
    const updatedMBTI = { ...editedClient.mbti, [field]: value };

    if (field === "mbti_type" && typeof value === "string") {
      const type = value.toUpperCase().replace(/[^INFJESTP]/g, "");
      updatedMBTI.mbti_type = type;

      if (type.length >= 1) updatedMBTI.ie_score = type[0] === "I" ? 0 : 100;
      if (type.length >= 2) updatedMBTI.ns_score = type[1] === "N" ? 100 : 0;
      if (type.length >= 3) updatedMBTI.ft_score = type[2] === "F" ? 100 : 0;
      if (type.length >= 4) updatedMBTI.jp_score = type[3] === "P" ? 0 : 100;
    }

    setEditedClient({
      ...editedClient,
      mbti: updatedMBTI as any,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  // Add debug log to check client data structure
  console.log("Client data:", client);

  const clientSince = client.client_since
    ? formatDistanceToNow(new Date(client.client_since), { addSuffix: true })
    : 'Unknown';
  const age = client.birth_day
    ? new Date().getFullYear() - new Date(client.birth_day).getFullYear()
    : 'Unknown';

  // Helper function to display field with fallback
  const displayField = (value: string | null | undefined) => {
    return value ? <p className="text-gray-900 text-sm">{value}</p> : <p className="text-gray-400 text-sm italic">Not specified</p>;
  };

  // Helper function to check if abilityData has valid values
  const hasValidAbilityData = (data: any[]) => {
    if (!data || !data.length) return false;
    // Check if at least one ability has a non-zero value
    return data.some(item => item.A > 0);
  };

  // Format ability data with minimum values to prevent SVG errors
  const abilityData = client?.abilities ? [
    { subject: 'Intuition', A: Math.max(0.1, client.abilities.intuition || 0), fullMark: 10 },
    { subject: 'Empathy', A: Math.max(0.1, client.abilities.empathy || 0), fullMark: 10 },
    { subject: 'Ambition', A: Math.max(0.1, client.abilities.ambition || 0), fullMark: 10 },
    { subject: 'Intellect', A: Math.max(0.1, client.abilities.intellect || 0), fullMark: 10 },
    { subject: 'Creativity', A: Math.max(0.1, client.abilities.creativity || 0), fullMark: 10 },
    { subject: 'Self Awareness', A: Math.max(0.1, client.abilities.self_awareness || 0), fullMark: 10 },
  ] : [];


  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 font-brockmann">{client.name}</h1>
                <div className="flex gap-2">
                  <select value={editedClient.pronouns || ''} onChange={(e) => setEditedClient({ ...editedClient, pronouns: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-32">
                    <option value="" disabled>Pronouns</option>
                    {pronounOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editedClient.birth_day || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, birth_day: e.target.value })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-40"
                  />
                  <select value={editedClient.ethnicity || ''} onChange={(e) => setEditedClient({ ...editedClient, ethnicity: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-48">
                    <option value="" disabled>Ethnicity</option>
                    {ethnicityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 font-brockmann">{client.name}</h1>
                <p className="text-gray-500">{client.pronouns} · {age} years old · {client.ethnicity}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div>
            <p className="text-sm text-gray-500 text-right">Client Since</p>
            <p className="font-semibold text-gray-900 text-right">
              {client?.client_since ? new Date(client.client_since).toLocaleDateString() : 'Unknown'}
            </p>
            <p className="text-xs text-gray-400 text-right">({clientSince})</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button 
                variant="outline"
                onClick={handleCancel}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-10 px-4 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button 
                onClick={() => navigate(`/reading/${id}`)} 
                className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-10 px-4 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                New Reading
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Panel: Vitals & Notes & Events */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-600 flex items-center font-brockmann">
                <Star className="w-5 h-5 mr-2" />
                Vitals
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-8 w-8 transition-colors"
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">Current Life Vibe</h4>
                  {isEditing ? (
                    <input
                      value={editedClient.current_vibe || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, current_vibe: e.target.value })}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full"
                    />
                  ) : (
                    displayField(client.current_vibe)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">Relationship Goal</h4>
                  {isEditing ? (
                    <select value={editedClient.relationship_goal || ''} onChange={(e) => setEditedClient({ ...editedClient, relationship_goal: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full">
                      <option value="">Select an option</option>
                      {relationshipGoalOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    displayField(client.relationship_goal)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">Work/Industry</h4>
                  {isEditing ? (
                    <select value={editedClient.work_industry || ''} onChange={(e) => setEditedClient({ ...editedClient, work_industry: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full">
                      <option value="">Select an option</option>
                      {workIndustryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    displayField(client.work_industry)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">Spiritual Beliefs</h4>
                  {isEditing ? (
                    <select value={editedClient.spiritual_beliefs || ''} onChange={(e) => setEditedClient({ ...editedClient, spiritual_beliefs: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full">
                      <option value="">Select an option</option>
                      {spiritualBeliefsOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    displayField(client.spiritual_beliefs)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">A Core Value is...</h4>
                  {isEditing ? (
                    <select value={editedClient.core_value || ''} onChange={(e) => setEditedClient({ ...editedClient, core_value: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full">
                      <option value="">Select an option</option>
                      {coreValueOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    displayField(client.core_value)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">How We Met</h4>
                  {isEditing ? (
                    <select value={editedClient.how_we_met || ''} onChange={(e) => setEditedClient({ ...editedClient, how_we_met: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full">
                      <option value="">Select an option</option>
                      {howWeMetOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    displayField(client.how_we_met)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">Communication Style</h4>
                  {isEditing ? (
                    <select value={editedClient.communication_style || ''} onChange={(e) => setEditedClient({ ...editedClient, communication_style: e.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full">
                      <option value="">Select an option</option>
                      {communicationStyleOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    displayField(client.communication_style)
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="rounded-xl border border-gray-200 bg-white shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-indigo-600 flex items-center font-brockmann">
                <MessageSquare className="w-5 h-5 mr-2" />
                Notes & Events
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Quick Add</h4>
                <div className="space-y-2">
                  <select value={quickAddType} onChange={(e) => setQuickAddType(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full">
                    <option value="Life Event">Life Event</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Challenge">Challenge</option>
                    <option value="Note">Note</option>
                  </select>
                  <textarea
                    placeholder={`Add a ${quickAddType.toLowerCase()} to the timeline...`}
                    className="min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                    value={quickAddNote}
                    onChange={(e) => setQuickAddNote(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleQuickAdd}
                  disabled={!quickAddNote.trim()}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to Timeline
                </button>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Private Notes</h4>
                {isEditing ? (
                  <textarea
                    placeholder="Private insights about this client (not added to timeline)..."
                    className="min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                    value={editedClient.reader_notes || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, reader_notes: e.target.value })}
                  />
                ) : (
                  <div className="min-h-[120px] p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {client.reader_notes || "No private notes yet..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Activity Timeline */}
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow rounded-xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-indigo-600 font-brockmann">Activity Timeline</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {readings.map((entry) => (
                <div key={entry.id} className="border-l-2 border-indigo-600 pl-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-500">
                      {new Date(entry.reading_date).toLocaleDateString()}
                    </span>
                    <div className="inline-flex items-center rounded-full border border-indigo-600 bg-indigo-600 text-white px-2.5 py-0.5 text-xs font-semibold">
                      {entry.reading_type || 'reading'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {entry.question && <p className="font-medium text-gray-900">"{entry.question}"</p>}
                    {entry.cards && Array.isArray(entry.cards) && (
                      <div className="flex flex-wrap gap-1">
                        {entry.cards.map((card: string, index: number) => (
                          <div key={index} className="inline-flex items-center rounded-full border border-indigo-600 bg-indigo-50 text-indigo-700 px-2.5 py-0.5 text-xs font-semibold">
                            {card}
                          </div>
                        ))}
                      </div>
                    )}
                    {(entry.subjective || entry.assessment || entry.plan) && (
                      <p className="text-sm text-gray-500 whitespace-pre-wrap">
                        {entry.subjective && `S: ${entry.subjective}\n`}
                        {entry.assessment && `A: ${entry.assessment}\n`}
                        {entry.plan && `P: ${entry.plan}`}
                      </p>
                    )}
                    {entry.content && <p className="text-gray-900">{entry.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Personality & Ability Chart */}
        <div className="lg:col-span-1 space-y-8">
          <div className="rounded-xl border border-gray-200 bg-white shadow p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-600 font-brockmann">Personality</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-8 w-8 transition-colors"
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-4">
              {(client.mbti || isEditing) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    MBTI: {isEditing ? (
                    <input
                      value={editedClient.mbti?.mbti_type || ''}
                      onChange={(e) => handleMBTIChange('mbti_type', e.target.value.toUpperCase().replace(/[^INFJESTP]/g, ''))}
                      className="inline w-20 ml-2 h-6 text-xs rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="ENFP"
                    />
                    ) : (
                    <span className="font-medium text-indigo-600 ml-1">
                      {client.mbti?.mbti_type || "Not set"}
                    </span>
                    )}
                  </h4>
                  <div className="space-y-2 mt-3">
                    {isEditing ? (
                      <>
                        <BipolarSlider
                          value={editedClient.mbti?.ie_score}
                          onChange={(value) => handleMBTIChange('ie_score', value)}
                          leftLabel="I"
                          rightLabel="E"
                          min={0}
                          max={100}
                        />
                        <BipolarSlider
                          value={editedClient.mbti?.ns_score}
                          onChange={(value) => handleMBTIChange('ns_score', value)}
                          leftLabel="S"
                          rightLabel="N"
                          min={0}
                          max={100}
                        />
                        <BipolarSlider
                          value={editedClient.mbti?.ft_score}
                          onChange={(value) => handleMBTIChange('ft_score', value)}
                          leftLabel="T"
                          rightLabel="F"
                          min={0}
                          max={100}
                        />
                        <BipolarSlider
                          value={editedClient.mbti?.jp_score}
                          onChange={(value) => handleMBTIChange('jp_score', value)}
                          leftLabel="P"
                          rightLabel="J"
                          min={0}
                          max={100}
                        />
                      </>
                    ) : (
                      <>
                        <MBTIScale value={client.mbti?.ie_score} labels={['I', 'E']} />
                        <MBTIScale value={client.mbti?.ns_score} labels={['S', 'N']} />
                        <MBTIScale value={client.mbti?.ft_score} labels={['T', 'F']} />
                        <MBTIScale value={client.mbti?.jp_score} labels={['P', 'J']} />
                      </>
                    )}
                  </div>
                </div>
              )}
              {(client.attachment || isEditing) && (
                <div className="mt-6">
                  {isEditing ? (
                    <div className="space-y-2">
                      <BipolarSlider
                        value={editedClient.attachment?.anxiety_score || 0}
                        onChange={(value) => setEditedClient({
                          ...editedClient,
                          attachment: {
                            id: editedClient.attachment?.id || '',
                            client_id: editedClient.attachment?.client_id || id || '',
                            ...(editedClient.attachment || {}),
                            anxiety_score: value
                          }
                        })}
                        leftLabel="Low"
                        rightLabel="High"
                        label="Anxiety"
                        min={-5}
                        max={5}
                      />
                      <BipolarSlider
                        value={editedClient.attachment?.avoidance_score || 0}
                        onChange={(value) => setEditedClient({
                          ...editedClient,
                          attachment: {
                            id: editedClient.attachment?.id || '',
                            client_id: editedClient.attachment?.client_id || id || '',
                            ...(editedClient.attachment || {}),
                            avoidance_score: value
                          }
                        })}
                        leftLabel="Low"
                        rightLabel="High"
                        label="Avoidance"
                        min={-5}
                        max={5}
                      />
                    </div>
                  ) : (
                    <AttachmentStyleMatrix
                      anxiety={client.attachment?.anxiety_score || 0}
                      avoidance={client.attachment?.avoidance_score || 0}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-600 font-brockmann">Ability Chart</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-8 w-8 transition-colors"
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <BipolarSlider
                    value={editedClient.abilities?.intuition || 0}
                    onChange={(value) => setEditedClient({
                      ...editedClient,
                      abilities: {
                        id: editedClient.abilities?.id || '',
                        client_id: editedClient.abilities?.client_id || id || '',
                        ...(editedClient.abilities || {}),
                        intuition: value
                      }
                    })}
                    leftLabel="Low"
                    rightLabel="High"
                    label="Intuition"
                    max={10}
                  />
                  <BipolarSlider
                    value={editedClient.abilities?.empathy || 0}
                    onChange={(value) => setEditedClient({
                      ...editedClient,
                      abilities: {
                        id: editedClient.abilities?.id || '',
                        client_id: editedClient.abilities?.client_id || id || '',
                        ...(editedClient.abilities || {}),
                        empathy: value
                      }
                    })}
                    leftLabel="Low"
                    rightLabel="High"
                    label="Empathy"
                    max={10}
                  />
                  <BipolarSlider
                    value={editedClient.abilities?.ambition || 0}
                    onChange={(value) => setEditedClient({
                      ...editedClient,
                      abilities: {
                        id: editedClient.abilities?.id || '',
                        client_id: editedClient.abilities?.client_id || id || '',
                        ...(editedClient.abilities || {}),
                        ambition: value
                      }
                    })}
                    leftLabel="Low"
                    rightLabel="High"
                    label="Ambition"
                    max={10}
                  />
                  <BipolarSlider
                    value={editedClient.abilities?.intellect || 0}
                    onChange={(value) => setEditedClient({
                      ...editedClient,
                      abilities: {
                        id: editedClient.abilities?.id || '',
                        client_id: editedClient.abilities?.client_id || id || '',
                        ...(editedClient.abilities || {}),
                        intellect: value
                      }
                    })}
                    leftLabel="Low"
                    rightLabel="High"
                    label="Intellect"
                    max={10}
                  />
                  <BipolarSlider
                    value={editedClient.abilities?.creativity || 0}
                    onChange={(value) => setEditedClient({
                      ...editedClient,
                      abilities: {
                        id: editedClient.abilities?.id || '',
                        client_id: editedClient.abilities?.client_id || id || '',
                        ...(editedClient.abilities || {}),
                        creativity: value
                      }
                    })}
                    leftLabel="Low"
                    rightLabel="High"
                    label="Creativity"
                    max={10}
                  />
                  <BipolarSlider
                    value={editedClient.abilities?.self_awareness || 0}
                    onChange={(value) => setEditedClient({
                      ...editedClient,
                      abilities: {
                        id: editedClient.abilities?.id || '',
                        client_id: editedClient.abilities?.client_id || id || '',
                        ...(editedClient.abilities || {}),
                        self_awareness: value
                      }
                    })}
                    leftLabel="Low"
                    rightLabel="High"
                    label="Self Awareness"
                    max={10}
                  />
                </div>
              ) : (
                <>
                  {hasValidAbilityData(abilityData) ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart 
                        cx="50%" 
                        cy="50%" 
                        outerRadius="70%" 
                        data={abilityData}
                        margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                      >
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }} 
                          tickLine={false}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 10]} 
                          tick={{ fill: '#6b7280' }} 
                          axisLine={false}
                          tickCount={6} 
                        />
                        <Radar 
                          name={client.name} 
                          dataKey="A" 
                          stroke="#4f46e5" 
                          fill="#4f46e5" 
                          fillOpacity={0.6} 
                          strokeWidth={2} 
                          isAnimationActive={true}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-gray-500 mb-2 font-medium">No ability data available</p>
                      <p className="text-sm text-gray-400">Edit to add abilities</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}