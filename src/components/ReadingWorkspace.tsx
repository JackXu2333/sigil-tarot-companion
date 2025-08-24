import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Shuffle, FileText, Save, Sparkles } from "lucide-react";
import { tarotDeck, type TarotCard } from "@/data/tarotDeck";
import { clientService, type Client, type FullClient } from "@/services/clientService";
import { readingService } from "@/services/readingService";
import { toast } from "sonner";
import { CopilotInsightsCard } from "@/components/CopilotInsightsCard";
import type { CopilotInsights } from "@/services/copilotService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
          const raw: any = await getCopilotInsights({
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
      alert("Please select a client for this reading.");
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
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8">
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
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                Live Reading - {selectedClient ? selectedClient.name : "Select a Client"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-gray-700">Session Question:</span>
                <Input
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
          <Button
            onClick={() => setShowSOAPModal(true)}
          >
            <FileText className="w-5 h-5" />
            Complete Session
          </Button>
        </div>

        {/* Client Select */}
        {!selectedClient && (
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <p className="font-semibold text-gray-700">Select a client for this reading:</p>
              <select
                onChange={(e) => handleClientSelect(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none w-64"
              >
                <option value="" disabled selected>Choose a client</option>
                {loadingClients ? (
                  <option disabled>Loading...</option>
                ) : (
                  clients.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Drawing Board */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-indigo-600 font-brockmann">The Drawing Board</h3>
              <Button
                variant="outline"
                onClick={drawCards}
              >
                <Shuffle className="w-5 h-5" />
                Draw Cards
              </Button>
            </div>
            <div className="p-6 pt-4 relative">
              {/* Synergy arrows overlay */}
              {/* {copilotInsights?.cardSynergies && (
                <DrawingBoardSynergyArrows synergies={copilotInsights.cardSynergies} />
              )} */}
              {/* Cards grid */}
              {drawnCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {drawnCards.map((card, index) => (
                    <div
                      key={index}
                      id={`card-${card.name.replace(/\s+/g, "-")}`}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedCard?.name === card.name
                          ? "border-indigo-600 bg-indigo-600/10 shadow-lg -translate-y-2"
                          : "border-gray-200 hover:border-indigo-600/50 bg-gray-50"
                      }`}
                      onClick={() => setSelectedCard(card)}
                    >
                      <div className="text-center space-y-3">
                        <div
                          className={`w-24 h-40 mx-auto bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-lg border-4 border-gray-100 text-4xl transition-transform duration-500 ${
                            card.position === "Reversed" ? "rotate-180" : ""
                          }`}
                        >
                          {card.emoji}
                        </div>
                        <p className="font-semibold text-gray-900 font-brockmann">{card.name}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${card.position === "Upright" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{card.position}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-40 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                    <Shuffle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">Click "Draw Cards" to begin the reading</p>
                </div>
              )}
            </div>
          </Card>

          {/* Card Details */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="border-2 border-gray-200 shadow bg-gray-50 rounded-xl">
              <div className="p-6 pb-2 flex flex-col items-center">
                <div className={`w-24 h-40 mx-auto rounded-lg flex items-center justify-center shadow-lg mb-2 border-4 border-gray-100 text-4xl bg-gradient-to-br from-indigo-100 to-blue-100 ${selectedCard?.position === "Reversed" ? "rotate-180" : ""}`}>
                  {selectedCard ? selectedCard.emoji : <span className="text-gray-400">?</span>}
                </div>
                <h3 className={`text-lg font-bold text-center mt-2 font-brockmann ${selectedCard ? "text-gray-900" : "text-gray-400"}`}>{selectedCard ? selectedCard.name : "Select a Card"}</h3>
                {selectedCard && (
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${selectedCard.position === "Upright" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{selectedCard.position}</span>
                )}
              </div>
              <div className="p-6 pt-0 space-y-3">
                <div>
                  <h4 className={`font-semibold mb-1 ${selectedCard ? "text-gray-900" : "text-gray-400"}`}>Meaning</h4>
                  <p className={`text-sm ${selectedCard ? "text-gray-700" : "text-gray-400"}`}>
                    {selectedCard
                      ? selectedCard.position === "Upright"
                        ? selectedCard.meaning.upright
                        : selectedCard.meaning.reversed
                      : "Click a card on the Drawing Board to see its details here."}
                  </p>
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${selectedCard ? "text-gray-900" : "text-gray-400"}`}>Key Themes</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCard
                      ? selectedCard.keywords.map((keyword, i) => (
                          <div key={i} className="text-xs inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold bg-blue-100 text-blue-700">{keyword}</div>
                        ))
                      : <div className="text-xs inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold bg-gray-100 text-gray-400 opacity-50">—</div>}
                  </div>
                </div>

                {/* Card-specific Copilot insights */}
                {selectedCard && copilotInsights && (copilotInsights as any).cardSynergies && (
                  <div className="pt-2 border-t border-gray-200">
                    <h4 className="font-semibold mb-1 text-sm flex items-center gap-1 text-indigo-600">
                      <Sparkles className="w-4 h-4" />
                      AI Insights
                    </h4>
                    {(copilotInsights as any).cardSynergies
                      .filter((synergy: any) => synergy.cards?.includes(selectedCard.name))
                      .map((synergy: any, i: number) => (
                        <div key={i} className="text-xs bg-indigo-600/5 rounded p-2 mt-1">
                          <span className="font-medium text-indigo-600">
                            {synergy.cards.join(" + ")}:
                          </span>
                          <p className="text-gray-700 mt-0.5">{synergy.interpretation}</p>
                        </div>
                      ))}
                    {(copilotInsights as any).narrativeElements && selectedCard && (
                      <div className="text-xs mt-2">
                        <span className="font-medium text-gray-500">Related myths: </span>
                        <span className="text-gray-500 italic">
                          {(copilotInsights as any).narrativeElements[0]}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copilot Insights Card */}
        <div className="w-full mt-8">
          <div className="flex items-center justify-end mb-2 gap-2">
            <label htmlFor="demo-toggle" className="text-xs text-gray-400">Demo Copilot</label>
            <input
              id="demo-toggle"
              type="checkbox"
              checked={useDemoCopilot}
              onChange={e => setUseDemoCopilot(e.target.checked)}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-xs text-gray-400">{useDemoCopilot ? "Demo" : "Live"}</span>
          </div>
          {loadingCopilot ? (
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow p-6 text-center text-gray-400">Generating insights...</div>
          ) : (
            copilotInsights && <CopilotInsightsCard insights={copilotInsights} onSendToSOAP={handleSendToSOAP} />
          )}
          <div className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17l6-6m0 0l6-6m-6 6v12" /></svg>
              Click the icon to send an insight to your SOAP notes.
            </span>
          </div>
        </div>
      </div>

      {/* SOAP Modal */}
      {showSOAPModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <button
              onClick={() => setShowSOAPModal(false)}
              className="absolute right-4 top-4 rounded-full bg-gray-100 hover:bg-gray-200 p-2 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              <span className="sr-only">Close</span>
            </button>
            <h2 className="text-xl font-bold text-indigo-600 mb-6 text-center font-playfair">S.O.A.P. Notes</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">Subjective (Client's words & mood)</label>
                <Textarea
                  placeholder="How is the client feeling? What are they expressing?"
                  value={sessionData.subjective}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      subjective: e.target.value,
                    })
                  }
                  className="mt-2 min-h-[60px]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Objective (Cards drawn)</label>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  {drawnCards.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {drawnCards.map((card, index) => (
                        <div key={index} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-indigo-600 text-white shadow">{card.name} ({card.position})</div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No cards drawn yet</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Assessment (Your interpretation)</label>
                <Textarea
                  placeholder="What story do the cards tell? Your synthesis and interpretation..."
                  value={sessionData.assessment}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      assessment: e.target.value,
                    })
                  }
                  className="mt-2 min-h-[60px]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Plan (Actionable advice)</label>
                <Textarea
                  placeholder="What are the recommended next steps? Actionable guidance..."
                  value={sessionData.plan}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, plan: e.target.value })
                  }
                  className="mt-2 min-h-[60px]"
                />
              </div>
              <Button
                onClick={saveReading}
                className="w-full"
              >
                <Save className="w-5 h-5" />
                Save Reading to Timeline
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}