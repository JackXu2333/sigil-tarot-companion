import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Shuffle, FileText, Save, Sparkles, ArrowUp } from "lucide-react";
import { tarotDeck, type TarotCard } from "@/data/tarotDeck";
import { clientService, type Client, type FullClient } from "@/services/clientService";
import { readingService } from "@/services/readingService";
import { toast } from "sonner";
import { CopilotInsightsCard } from "@/components/CopilotInsightsCard";
import type { CopilotInsights } from "@/services/copilotService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getCopilotInsights, demoCopilotInsights } from "@/services/copilotService";

interface DrawnTarotCard extends TarotCard {
  position: "Upright" | "Reversed";
}

export default function ReadingWorkspace({ copilotEnabled = true }: { copilotEnabled?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cameFrom = location.state?.from; // Check where we came from

  const [drawnCards, setDrawnCards] = useState<DrawnTarotCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<DrawnTarotCard | null>(
    null
  );
  const [sessionData, setSessionData] = useState({
    question: "",
    subjective: "",
    assessment: "",
    plan: "",
  });
  const [showSOAPModal, setShowSOAPModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [copilotInsights, setCopilotInsights] = useState<CopilotInsights | null>(null);
  const [useDemoCopilot, setUseDemoCopilot] = useState(true); // Toggle for demo/real
  const [loadingCopilot, setLoadingCopilot] = useState(false);

  const [selectedClient, setSelectedClient] = useState<FullClient | null>(null);
  const prevQuestionRef = useRef<string>("");

  useEffect(() => {
    loadClients();
    if (id && id !== "new") {
      loadClient(id);
    }
  }, [id]);

  const loadClients = async () => {
    try {
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Failed to load clients", error);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadClient = async (clientId: string) => {
    try {
      const clientData = await clientService.getClientById(clientId);
      setSelectedClient(clientData);
    } catch (error) {
      console.error("Failed to load client", error);
    }
  };

  useEffect(() => {
    prevQuestionRef.current = sessionData.question;
  });

  useEffect(() => {
    const prevQuestion = prevQuestionRef.current;

    setSessionData((prevData) => {
      if (prevData.subjective === prevQuestion || prevData.subjective === "") {
        return { ...prevData, subjective: prevData.question };
      }
      return prevData;
    });
  }, [sessionData.question]);

  const handleBackNavigation = () => {
    if (cameFrom) {
      navigate(cameFrom); // Go back to the tab we started from
    } else {
      navigate(-1); // Otherwise, use default browser back behavior
    }
  };

  // Placeholder handler for sending Copilot output to SOAP
  const handleSendToSOAP = (content: string | string[]) => {
    toast.success(`Sent to SOAP (UI only): ${Array.isArray(content) ? content.join("\n\n") : content}`);
  };

  // Trigger Copilot after drawing cards if enabled
  const drawCards = async () => {
    const numberOfCards = 3;
    const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
    const drawn = shuffled
      .slice(0, numberOfCards)
      .map((card) => ({
        ...card,
        position: Math.random() > 0.5 ? "Upright" : ("Reversed" as "Upright" | "Reversed"),
      }));
    setDrawnCards(drawn as DrawnTarotCard[]);
    setSelectedCard(null);
    // Copilot logic
    if (copilotEnabled) {
      setLoadingCopilot(true);
      if (useDemoCopilot) {
        setTimeout(() => {
          setCopilotInsights(demoCopilotInsights);
          setLoadingCopilot(false);
        }, 800);
      } else {
        try {
          const user = selectedClient || null;
          const raw = await getCopilotInsights({
            question: sessionData.question,
            cards: drawn.map((c) => c.name),
            user,
          });
          // Canonical mapping for CopilotInsights
          const insights: CopilotInsights = {
            sentiment: raw.sentiment,
            scales: raw.scales,
            energyBalance: raw.energyBalance,
            keyThemes: raw.keyThemes,
            dominantElements: raw.dominantElements,
            archetypeIntensity: raw.archetypeIntensity,
            potentialNarrative: raw.potentialNarrative,
            questionsToAsk: raw.questionsToAsk,
            transformationPotential: raw.transformationPotential,
            cardSynergies: raw.cardSynergies,
            actionPoints: raw.actionPoints,
            warningSignals: raw.warningSignals,
          };
          setCopilotInsights(insights);
        } catch (e) {
          toast.error(`Copilot Error: ${String(e)}`);
        } finally {
          setLoadingCopilot(false);
        }
      }
    } else {
      setCopilotInsights(null);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const clientToSet = clients.find((c) => c.id === clientId);
    if (clientToSet) {
      loadClient(clientToSet.id);
    }
  };

  const saveReading = async () => {
    if (!selectedClient) {
      toast.error("Please select a client for this reading.");
      return;
    }

    const newReading = {
      client_id: selectedClient.id,
      reading_type: "reading",
      reading_date: new Date().toISOString().split("T")[0],
      question: sessionData.question,
      cards: drawnCards.map((card) => `${card.name} (${card.position})`),
      subjective: sessionData.subjective,
      assessment: sessionData.assessment,
      plan: sessionData.plan,
      content: null,
    };

    try {
      const savedReading = await readingService.createReading(newReading); // Use readingService
      console.log("Saved reading:", savedReading);

      navigate(`/client/${selectedClient.id}`);
      toast.success("Reading saved successfully!");
    } catch (error) {
      console.error("Failed to save reading:", error);
      toast.error("Failed to save reading to the backend.");
    }
  };

  return (
  <div className="min-h-screen bg-background p-4 sm:p-8">
  <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackNavigation}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">
                Live Reading - {selectedClient ? selectedClient.name : "Select a Client"}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <Label htmlFor="session-question" className="font-semibold text-foreground whitespace-nowrap">
                  Session Question:
                </Label>
                <Input
                  id="session-question"
                  placeholder="What question is the client asking?"
                  value={sessionData.question}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, question: e.target.value })
                  }
                  className="w-64"
                />
              </div>
            </div>
          </div>
          <Dialog open={showSOAPModal} onOpenChange={setShowSOAPModal}>
            <Button onClick={() => setShowSOAPModal(true)}>
              <FileText className="w-5 h-5" />
              Complete Session
            </Button>
          </Dialog>
        </div>

        {/* Client Select */}
        {!selectedClient && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
              <Label className="font-semibold text-foreground">
                Select a client for this reading:
              </Label>
              <Select onValueChange={handleClientSelect}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {loadingClients ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    clients.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Drawing Board */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-semibold text-primary font-brockmann">
                The Drawing Board
              </CardTitle>
              <Button
                variant="outline"
                onClick={drawCards}
              >
                <Shuffle className="w-5 h-5" />
                Draw Cards
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Synergy arrows overlay */}
              {/* {copilotInsights?.cardSynergies && (
                <DrawingBoardSynergyArrows synergies={copilotInsights.cardSynergies} />
              )} */}
              {/* Cards grid */}
              {drawnCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {drawnCards.map((card, index) => (
                    <Card
                      key={index}
                      id={`card-${card.name.replace(/\s+/g, "-")}`}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedCard?.name === card.name
                          ? "border-primary bg-primary/10 shadow-lg -translate-y-2"
                          : "hover:border-primary/50 bg-muted/50"
                      }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <CardContent className="pt-6 text-center space-y-4">
                        <div
                          className={`w-24 h-40 mx-auto bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg flex items-center justify-center shadow-sm border border-border text-4xl transition-transform duration-500 ${
                            card.position === "Reversed" ? "rotate-180" : ""
                          }`}
                        >
                          {card.emoji}
                        </div>
                        <p className="font-semibold text-foreground font-brockmann">{card.name}</p>
                        <Badge
                          variant={card.position === "Upright" ? "secondary" : "destructive"}
                        >
                          {card.position}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-24 h-40 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                    <Shuffle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Click "Draw Cards" to begin the reading</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card Details */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Card className="bg-muted/50">
              <CardHeader className="text-center space-y-4">
                <div className={`w-24 h-40 mx-auto rounded-lg flex items-center justify-center shadow-sm border border-border text-4xl bg-gradient-to-br from-primary/20 to-primary/30 ${selectedCard?.position === "Reversed" ? "rotate-180" : ""}`}>
                  {selectedCard ? selectedCard.emoji : <span className="text-muted-foreground">?</span>}
                </div>
                <div className="space-y-2">
                  <CardTitle className={`text-lg font-bold text-center font-brockmann ${selectedCard ? "text-foreground" : "text-muted-foreground"}`}>
                    {selectedCard ? selectedCard.name : "Select a Card"}
                  </CardTitle>
                  {selectedCard && (
                    <Badge
                      variant={selectedCard.position === "Upright" ? "secondary" : "destructive"}
                    >
                      {selectedCard.position}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className={`font-semibold mb-1 ${selectedCard ? "text-foreground" : "text-muted-foreground"}`}>Meaning</h4>
                  <p className={`text-sm ${selectedCard ? "text-muted-foreground" : "text-muted-foreground"}`}>
                    {selectedCard
                      ? selectedCard.position === "Upright"
                        ? selectedCard.meaning.upright
                        : selectedCard.meaning.reversed
                      : "Click a card on the Drawing Board to see its details here."}
                  </p>
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${selectedCard ? "text-foreground" : "text-muted-foreground"}`}>Key Themes</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCard
                      ? selectedCard.keywords.map((keyword, i) => (
                          <Badge key={i} variant="outline">
                            {keyword}
                          </Badge>
                        ))
                      : <Badge variant="outline" className="opacity-50">
                          —
                        </Badge>}
                  </div>
                </div>

                {/* Card-specific Copilot insights */}
                {selectedCard && copilotInsights && copilotInsights.cardSynergies && (
                  <div className="pt-2 border-t border-border">
                    <h4 className="font-semibold mb-1 text-sm flex items-center gap-1 text-primary">
                      <Sparkles className="w-4 h-4" />
                      AI Insights
                    </h4>
                    {copilotInsights.cardSynergies
                      .filter((synergy) => synergy.cards?.includes(selectedCard.name))
                      .map((synergy, i) => (
                        <div key={i} className="text-xs bg-primary/5 rounded p-2 mt-1">
                          <span className="font-medium text-primary">
                            {synergy.cards.join(" + ")}:
                          </span>
                          <p className="text-muted-foreground mt-0.5">{synergy.interpretation}</p>
                        </div>
                      ))}
                    {/* Card narrative insights would go here if available */}
                    {copilotInsights.actionPoints && selectedCard && (
                      <div className="text-xs mt-2">
                        <span className="font-medium text-muted-foreground">Related myths: </span>
                        <span className="text-muted-foreground italic">
                          {/* Narrative elements */}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Copilot Insights Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-4">
            <Label htmlFor="demo-toggle" className="text-sm text-muted-foreground">
              Demo Copilot
            </Label>
            <Switch
              id="demo-toggle"
              checked={useDemoCopilot}
              onCheckedChange={setUseDemoCopilot}
            />
            <span className="text-sm text-muted-foreground">
              {useDemoCopilot ? "Demo" : "Live"}
            </span>
          </div>
          {loadingCopilot ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <p className="text-muted-foreground mt-4">Generating insights...</p>
              </CardContent>
            </Card>
          ) : (
            copilotInsights && <CopilotInsightsCard insights={copilotInsights} onSendToSOAP={handleSendToSOAP} />
          )}
          <div className="text-sm text-muted-foreground text-center mt-4 flex items-center justify-center gap-2">
            <ArrowUp className="w-4 h-4 text-primary" />
            <span>Click the icon to send an insight to your SOAP notes.</span>
          </div>
        </div>
      </div>

      {/* SOAP Modal */}
      <Dialog open={showSOAPModal} onOpenChange={setShowSOAPModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary text-center font-playfair">
              S.O.A.P. Notes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Subjective (Client's words & mood)
              </Label>
              <Textarea
                placeholder="How is the client feeling? What are they expressing?"
                value={sessionData.subjective}
                onChange={(e) =>
                  setSessionData({
                    ...sessionData,
                    subjective: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Objective (Cards drawn)
              </Label>
              <div className="p-4 bg-muted/50 rounded-md">
                {drawnCards.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {drawnCards.map((card, index) => (
                      <Badge key={index} variant="default">
                        {card.name} ({card.position})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No cards drawn yet</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Assessment (Your interpretation)
              </Label>
              <Textarea
                placeholder="What story do the cards tell? Your synthesis and interpretation..."
                value={sessionData.assessment}
                onChange={(e) =>
                  setSessionData({
                    ...sessionData,
                    assessment: e.target.value,
                  })
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Plan (Actionable advice)
              </Label>
              <Textarea
                placeholder="What are the recommended next steps? Actionable guidance..."
                value={sessionData.plan}
                onChange={(e) =>
                  setSessionData({ ...sessionData, plan: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>
            <Button onClick={saveReading} className="w-full">
              <Save className="w-5 h-5" />
              Save Reading to Timeline
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}