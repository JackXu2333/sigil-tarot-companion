// src/components/ClientChart.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, MessageSquare, Star, Edit, Sparkles, Save, X, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { clientService, type FullClient } from "@/services/clientService";
import { readingService, type Reading } from "@/services/readingService";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
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

import { cn, typography } from "@/lib/utils";

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
        {label && <Label className={cn("font-medium", typography.label.default)}>{label}</Label>}
        <div className="flex items-center space-x-2">
            <span className={cn("text-muted-foreground w-20 text-left", typography.chart.label)}>{leftLabel}</span>
            <Slider
                value={[value || 0]}
                onValueChange={(values) => onChange(values[0])}
                min={min}
                max={max}
                step={step}
                className="flex-1"
            />
            <span className={cn("text-muted-foreground w-20 text-right", typography.chart.label)}>{rightLabel}</span>
        </div>
        <div className={cn("text-center text-muted-foreground", typography.chart.value)}>{value}</div>
    </div>
);

const MBTIScale = ({ value, labels }: { value?: number; labels: [string, string] }) => {
  const safeValue = value ?? 50;
  return (
    <div className="w-full mb-3">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span className="font-medium">{labels[0]}</span>
        <span className="font-medium">{labels[1]}</span>
      </div>
      <div className="h-2.5 w-full bg-muted rounded-full flex items-center">
        <div
          className="h-2.5 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

const AttachmentStyleMatrix = ({ anxiety, avoidance }: { anxiety: number; avoidance: number }) => {
  // Convert 0-10 scale to percentage (0-100%)
  const top = 100 - (anxiety * 10);
  const left = avoidance * 10;

  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2">Attachment Style</h4>
      <div className="relative aspect-square w-full bg-muted rounded-lg p-2 border">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
        <div
          className="absolute w-4 h-4 rounded-full bg-primary shadow-md transition-all duration-300"
          style={{ top: `calc(${top}% - 8px)`, left: `calc(${left}% - 8px)` }}
        />
        <span className="absolute top-1 left-1 text-xs text-muted-foreground font-medium">Anxious</span>
        <span className="absolute bottom-1 left-1 text-xs text-muted-foreground font-medium">Secure</span>
        <span className="absolute top-1 right-1 text-xs text-muted-foreground font-medium">Fearful</span>
        <span className="absolute bottom-1 right-1 text-xs text-muted-foreground font-medium">Avoidant</span>
      </div>
    </div>
  );
};


export default function ClientChart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<FullClient | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
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
  }, [id]);

  const handleSave = async () => {
    if (!client || !id) return;

    // Helper to convert undefined to null for database consistency
    const toNull = (obj: any): any => {
      const result: any = {};
      for (const key in obj) {
        result[key] = obj[key] === undefined ? null : obj[key];
      }
      return result;
    };

    try {
      // Extract only basic information for the main client update
      const { mbti, attachment, abilities, ...basicInfo } = editedClient;

      // Update the main client data
      const updatedClient = await clientService.updateClient(id, toNull(basicInfo));

      // Update related data if it exists
      if (mbti) {
        await clientService.updateClientMBTI(id, toNull(mbti));
      }
      if (attachment) {
        await clientService.updateClientAttachment(id, toNull(attachment));
      }
      if (abilities) {
        await clientService.updateClientAbilities(id, toNull(abilities));
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
        question: null,
        cards: null,
        subjective: null,
        assessment: null,
        plan: null,
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
      mbti: updatedMBTI as NonNullable<FullClient['mbti']>,
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
    return value ? <p className="text-foreground text-sm">{value}</p> : <p className="text-muted-foreground text-sm italic">Not specified</p>;
  };

  // Helper function to check if abilityData has valid values
  const hasValidAbilityData = (data: Array<{A: number}>) => {
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
  <div className="min-h-screen bg-background p-4 sm:p-8">
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
                <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
                <div className="flex gap-2">
                  <Select value={editedClient.pronouns || ''} onValueChange={(value) => setEditedClient({ ...editedClient, pronouns: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Pronouns" />
                    </SelectTrigger>
                    <SelectContent>
                      {pronounOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={editedClient.birth_day || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, birth_day: e.target.value })}
                    className="w-40"
                  />
                  <Select value={editedClient.ethnicity || ''} onValueChange={(value) => setEditedClient({ ...editedClient, ethnicity: value })}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      {ethnicityOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
                <p className="text-muted-foreground">{client.pronouns} · {age} years old · {client.ethnicity}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div>
            <p className="text-sm text-muted-foreground text-right">Client Since</p>
            <p className="font-semibold text-foreground text-right">
              {client?.client_since ? new Date(client.client_since).toLocaleDateString() : 'Unknown'}
            </p>
            <p className="text-xs text-muted-foreground text-right">({clientSince})</p>
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
              <Button 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => navigate(`/reading/${id}`)}
              >
                <Sparkles className="w-4 h-4" />
                New Reading
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Panel: Vitals & Notes & Events */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Vitals
              </h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Current Life Vibe</h4>
                  {isEditing ? (
                    <Input
                      value={editedClient.current_vibe || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, current_vibe: e.target.value })}
                    />
                  ) : (
                    displayField(client.current_vibe)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Relationship Goal</h4>
                  {isEditing ? (
                    <Select value={editedClient.relationship_goal || ''} onValueChange={(value) => setEditedClient({ ...editedClient, relationship_goal: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipGoalOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    displayField(client.relationship_goal)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Work/Industry</h4>
                  {isEditing ? (
                    <Select value={editedClient.work_industry || ''} onValueChange={(value) => setEditedClient({ ...editedClient, work_industry: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {workIndustryOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    displayField(client.work_industry)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Spiritual Beliefs</h4>
                  {isEditing ? (
                    <Select value={editedClient.spiritual_beliefs || ''} onValueChange={(value) => setEditedClient({ ...editedClient, spiritual_beliefs: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {spiritualBeliefsOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    displayField(client.spiritual_beliefs)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">A Core Value is...</h4>
                  {isEditing ? (
                    <Select value={editedClient.core_value || ''} onValueChange={(value) => setEditedClient({ ...editedClient, core_value: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {coreValueOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    displayField(client.core_value)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">How We Met</h4>
                  {isEditing ? (
                    <Select value={editedClient.how_we_met || ''} onValueChange={(value) => setEditedClient({ ...editedClient, how_we_met: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {howWeMetOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    displayField(client.how_we_met)
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Communication Style</h4>
                  {isEditing ? (
                    <Select value={editedClient.communication_style || ''} onValueChange={(value) => setEditedClient({ ...editedClient, communication_style: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {communicationStyleOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    displayField(client.communication_style)
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Notes & Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Quick Add</h4>
                <div className="space-y-2">
                  <Select value={quickAddType} onValueChange={setQuickAddType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Life Event">Life Event</SelectItem>
                      <SelectItem value="Milestone">Milestone</SelectItem>
                      <SelectItem value="Challenge">Challenge</SelectItem>
                      <SelectItem value="Note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder={`Add a ${quickAddType.toLowerCase()} to the timeline...`}
                    className="min-h-[100px]"
                    value={quickAddNote}
                    onChange={(e) => setQuickAddNote(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleQuickAdd}
                  disabled={!quickAddNote.trim()}
                  className="mt-3 w-full"
                >
                  <Plus className="w-4 h-4" />
                  Add to Timeline
                </Button>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Private Notes</h4>
                {isEditing ? (
                  <Textarea
                    placeholder="Private insights about this client (not added to timeline)..."
                    className="min-h-[120px]"
                    value={editedClient.reader_notes || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, reader_notes: e.target.value })}
                  />
                ) : (
                  <div className="min-h-[120px] p-3 bg-muted rounded-md border">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {client.reader_notes || "No private notes yet..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
            </CardContent>
          </Card>
        
      </div>
      
        {/* Center Panel: Activity Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {readings.map((entry) => (
                <div key={entry.id} className="border-l-2 border-primary pl-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.reading_date).toLocaleDateString()}
                    </span>
                    <div className="inline-flex items-center rounded-full border border-primary bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-semibold">
                      {entry.reading_type || 'reading'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {entry.question && <p className="font-medium text-foreground">"{entry.question}"</p>}
                    {entry.cards && Array.isArray(entry.cards) && (
                      <div className="flex flex-wrap gap-1">
                        {entry.cards.map((card: string, index: number) => (
                          <div key={index} className="inline-flex items-center rounded-full border border-primary bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold">
                            {card}
                          </div>
                        ))}
                      </div>
                    )}
                    {(entry.subjective || entry.assessment || entry.plan) && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {entry.subjective && `S: ${entry.subjective}\n`}
                        {entry.assessment && `A: ${entry.assessment}\n`}
                        {entry.plan && `P: ${entry.plan}`}
                      </p>
                    )}
                    {entry.content && <p className="text-foreground">{entry.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      
        {/* Right Panel: Personality & Ability Chart */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Personality</h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {(client.mbti || isEditing) && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    MBTI: {isEditing ? (
                    <Input
                      value={editedClient.mbti?.mbti_type || ''}
                      onChange={(e) => handleMBTIChange('mbti_type', e.target.value.toUpperCase().replace(/[^INFJESTP]/g, ''))}
                      className="inline w-20 ml-2 h-6 text-xs"
                      placeholder="ENFP"
                    />
                    ) : (
                    <span className="font-medium text-primary ml-1">
                      {client.mbti?.mbti_type || "Not set"}
                    </span>
                    )}
                  </h4>
                  <div className="space-y-2 mt-3">
                    {isEditing ? (
                      <>
                        <BipolarSlider
                          value={editedClient.mbti?.ie_score ?? undefined}
                          onChange={(value) => handleMBTIChange('ie_score', value)}
                          leftLabel="I"
                          rightLabel="E"
                          min={0}
                          max={100}
                        />
                        <BipolarSlider
                          value={editedClient.mbti?.ns_score ?? undefined}
                          onChange={(value) => handleMBTIChange('ns_score', value)}
                          leftLabel="S"
                          rightLabel="N"
                          min={0}
                          max={100}
                        />
                        <BipolarSlider
                          value={editedClient.mbti?.ft_score ?? undefined}
                          onChange={(value) => handleMBTIChange('ft_score', value)}
                          leftLabel="T"
                          rightLabel="F"
                          min={0}
                          max={100}
                        />
                        <BipolarSlider
                          value={editedClient.mbti?.jp_score ?? undefined}
                          onChange={(value) => handleMBTIChange('jp_score', value)}
                          leftLabel="P"
                          rightLabel="J"
                          min={0}
                          max={100}
                        />
                      </>
                    ) : (
                      <>
                        <MBTIScale value={client.mbti?.ie_score ?? undefined} labels={['I', 'E']} />
                        <MBTIScale value={client.mbti?.ns_score ?? undefined} labels={['S', 'N']} />
                        <MBTIScale value={client.mbti?.ft_score ?? undefined} labels={['T', 'F']} />
                        <MBTIScale value={client.mbti?.jp_score ?? undefined} labels={['P', 'J']} />
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
                            anxiety_score: value,
                            avoidance_score: editedClient.attachment?.avoidance_score ?? null,
                            created_at: editedClient.attachment?.created_at || '',
                            updated_at: editedClient.attachment?.updated_at || ''
                          }
                        })}
                        leftLabel="Low"
                        rightLabel="High"
                        label="Anxiety"
                        min={0}
                        max={10}
                      />
                      <BipolarSlider
                        value={editedClient.attachment?.avoidance_score || 0}
                        onChange={(value) => setEditedClient({
                          ...editedClient,
                          attachment: {
                            id: editedClient.attachment?.id || '',
                            client_id: editedClient.attachment?.client_id || id || '',
                            anxiety_score: editedClient.attachment?.anxiety_score ?? null,
                            avoidance_score: value,
                            created_at: editedClient.attachment?.created_at || '',
                            updated_at: editedClient.attachment?.updated_at || ''
                          }
                        })}
                        leftLabel="Low"
                        rightLabel="High"
                        label="Avoidance"
                        min={0}
                        max={10}
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
          </Card>
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Ability Chart</h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Button>
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
                        intuition: value,
                        empathy: editedClient.abilities?.empathy ?? null,
                        ambition: editedClient.abilities?.ambition ?? null,
                        intellect: editedClient.abilities?.intellect ?? null,
                        creativity: editedClient.abilities?.creativity ?? null,
                        self_awareness: editedClient.abilities?.self_awareness ?? null,
                        created_at: editedClient.abilities?.created_at || '',
                        updated_at: editedClient.abilities?.updated_at || ''
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
                        intuition: editedClient.abilities?.intuition ?? null,
                        empathy: value,
                        ambition: editedClient.abilities?.ambition ?? null,
                        intellect: editedClient.abilities?.intellect ?? null,
                        creativity: editedClient.abilities?.creativity ?? null,
                        self_awareness: editedClient.abilities?.self_awareness ?? null,
                        created_at: editedClient.abilities?.created_at || '',
                        updated_at: editedClient.abilities?.updated_at || ''
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
                        intuition: editedClient.abilities?.intuition ?? null,
                        empathy: editedClient.abilities?.empathy ?? null,
                        ambition: value,
                        intellect: editedClient.abilities?.intellect ?? null,
                        creativity: editedClient.abilities?.creativity ?? null,
                        self_awareness: editedClient.abilities?.self_awareness ?? null,
                        created_at: editedClient.abilities?.created_at || '',
                        updated_at: editedClient.abilities?.updated_at || ''
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
                        intuition: editedClient.abilities?.intuition ?? null,
                        empathy: editedClient.abilities?.empathy ?? null,
                        ambition: editedClient.abilities?.ambition ?? null,
                        intellect: value,
                        creativity: editedClient.abilities?.creativity ?? null,
                        self_awareness: editedClient.abilities?.self_awareness ?? null,
                        created_at: editedClient.abilities?.created_at || '',
                        updated_at: editedClient.abilities?.updated_at || ''
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
                        intuition: editedClient.abilities?.intuition ?? null,
                        empathy: editedClient.abilities?.empathy ?? null,
                        ambition: editedClient.abilities?.ambition ?? null,
                        intellect: editedClient.abilities?.intellect ?? null,
                        creativity: value,
                        self_awareness: editedClient.abilities?.self_awareness ?? null,
                        created_at: editedClient.abilities?.created_at || '',
                        updated_at: editedClient.abilities?.updated_at || ''
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
                        intuition: editedClient.abilities?.intuition ?? null,
                        empathy: editedClient.abilities?.empathy ?? null,
                        ambition: editedClient.abilities?.ambition ?? null,
                        intellect: editedClient.abilities?.intellect ?? null,
                        creativity: editedClient.abilities?.creativity ?? null,
                        self_awareness: value,
                        created_at: editedClient.abilities?.created_at || '',
                        updated_at: editedClient.abilities?.updated_at || ''
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
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 500 }} 
                          tickLine={false}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 10]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                          axisLine={false}
                          tickCount={6} 
                        />
                        <Radar 
                          name={client.name} 
                          dataKey="A" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.6} 
                          strokeWidth={2} 
                          isAnimationActive={true}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] bg-muted rounded-md border">
                      <p className="text-muted-foreground mb-2 font-medium">No ability data available</p>
                      <p className="text-sm text-muted-foreground">Edit to add abilities</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
}