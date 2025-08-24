import React from "react";
import { Sparkles, Lightbulb, BookOpen, HelpCircle, Send, TrendingUp, Flame, Droplets, Wind, Mountain, Brain, Heart, Star, Package, AlertTriangle, CheckCircle } from "lucide-react";
import type { CopilotInsights } from "@/services/copilotService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
  insights: CopilotInsights;
  onSendToSOAP: (content: string | string[]) => void;
}

// Constants for thresholds
const THRESHOLDS = {
  HIGH_CLARITY: 8,
  LOW_CLARITY: 3,
  HIGH_AGENCY: 8,
  LOW_AGENCY: 3,
  HIGH_DIFFICULTY: 8,
  LOW_DIFFICULTY: 2,
  HIGH_OPPORTUNITY: 8,
  LOW_OPPORTUNITY: 3,
  HIGH_ENERGY: 70,
  DOMINANT_ELEMENT: 40,
  DOMINANT_ENERGY: 40,
  HIGH_ARCHETYPE: 8,
  HIGH_SENTIMENT: 0.5,
  LOW_SENTIMENT: -0.5
} as const;

// Helper to get sentiment color using design tokens
const getSentimentColor = (value: number) => {
  if (value >= THRESHOLDS.HIGH_SENTIMENT) return "text-emerald-600 dark:text-emerald-400";
  if (value >= 0) return "text-primary";
  if (value >= THRESHOLDS.LOW_SENTIMENT) return "text-amber-600 dark:text-amber-400";
  return "text-destructive";
};

// Helper to format sentiment value
const formatSentiment = (value: number) => {
  const percentage = Math.round((value + 1) * 50);
  return `${percentage}%`;
};

// Helper to get severity badge variant
const getSeverityVariant = (severity: number): "destructive" | "secondary" | "outline" => {
  if (severity >= 7) return "destructive";
  if (severity >= 4) return "secondary";
  return "outline";
};

export function CopilotInsightsCard({ insights, onSendToSOAP }: Props) {
  if (!insights) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No insights available.
      </div>
    );
  }

  // Highlight logic
  const highOpportunity = insights.scales.opportunity >= THRESHOLDS.HIGH_OPPORTUNITY;
  const lowDifficulty = insights.scales.difficulty <= THRESHOLDS.LOW_DIFFICULTY;
  const activeReceptiveSum = insights.energyBalance.active + insights.energyBalance.receptive;
  const energyAreas = [
    { key: 'mental', value: insights.energyBalance.mental },
    { key: 'emotional', value: insights.energyBalance.emotional },
    { key: 'spiritual', value: insights.energyBalance.spiritual },
    { key: 'material', value: insights.energyBalance.material },
  ];
  const dominantEnergy = energyAreas.reduce((max, curr) => curr.value > max.value ? curr : max, energyAreas[0]);
  const elements = [
    { key: 'fire', value: insights.dominantElements.fire },
    { key: 'water', value: insights.dominantElements.water },
    { key: 'air', value: insights.dominantElements.air },
    { key: 'earth', value: insights.dominantElements.earth },
  ];
  const dominantElement = elements.reduce((max, curr) => curr.value > max.value ? curr : max, elements[0]);



  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="w-6 h-6" />
          Copilot Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm pt-0">
        {/* Sentiment Overview */}
        <section className="bg-muted/50 rounded-lg p-4 border">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2 text-foreground">
            <TrendingUp className="w-4 h-4" />
            Sentiment Analysis
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-background rounded-md p-3 border">
              <div className={`font-bold text-lg ${Math.abs(insights.sentiment.overall) > THRESHOLDS.HIGH_SENTIMENT ? 'text-primary' : 'text-foreground'}`}>
                {formatSentiment(insights.sentiment.overall)}
              </div>
              <div className="text-xs text-muted-foreground">Overall</div>
            </div>
            <div className="text-center bg-background rounded-md p-3 border">
              <div className={`font-bold text-lg ${Math.abs(insights.sentiment.emotional) > THRESHOLDS.HIGH_SENTIMENT ? 'text-primary' : 'text-foreground'}`}>
                {formatSentiment(insights.sentiment.emotional)}
              </div>
              <div className="text-xs text-muted-foreground">Emotional</div>
            </div>
            <div className="text-center bg-background rounded-md p-3 border">
              <div className={`font-bold text-lg ${Math.abs(insights.sentiment.practical) > THRESHOLDS.HIGH_SENTIMENT ? 'text-primary' : 'text-foreground'}`}>
                {formatSentiment(insights.sentiment.practical)}
              </div>
              <div className="text-xs text-muted-foreground">Practical</div>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Key Metrics */}
            <section className="bg-muted/50 rounded-lg p-4 border">
              <h4 className="font-medium text-sm mb-3 text-foreground">Key Metrics</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Clarity</span>
                    <span className={`font-medium ${insights.scales.clarity >= THRESHOLDS.HIGH_CLARITY || insights.scales.clarity <= THRESHOLDS.LOW_CLARITY ? 'text-primary' : 'text-foreground'}`}>
                      {insights.scales.clarity}/10
                      {insights.scales.clarity >= THRESHOLDS.HIGH_CLARITY && <span className="ml-1 text-primary">✨</span>}
                      {insights.scales.clarity <= THRESHOLDS.LOW_CLARITY && <span className="ml-1 text-amber-600 dark:text-amber-400">⚠️</span>}
                    </span>
                  </div>
                  <Progress 
                    value={insights.scales.clarity * 10}
                    className={`${insights.scales.clarity >= THRESHOLDS.HIGH_CLARITY ? 'bg-primary/20' : insights.scales.clarity <= THRESHOLDS.LOW_CLARITY ? 'bg-amber-600/20 dark:bg-amber-400/20' : 'bg-muted'}`}
                    aria-label={`Clarity level: ${insights.scales.clarity} out of 10`}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Agency</span>
                    <span className={`font-medium ${insights.scales.agency >= THRESHOLDS.HIGH_AGENCY || insights.scales.agency <= THRESHOLDS.LOW_AGENCY ? 'text-primary' : 'text-foreground'}`}>
                      {insights.scales.agency}/10
                      {insights.scales.agency >= THRESHOLDS.HIGH_AGENCY && <span className="ml-1 text-primary">💪</span>}
                      {insights.scales.agency <= THRESHOLDS.LOW_AGENCY && <span className="ml-1 text-amber-600 dark:text-amber-400">⚠️</span>}
                    </span>
                  </div>
                  <Progress 
                    value={insights.scales.agency * 10}
                    className={`${insights.scales.agency >= THRESHOLDS.HIGH_AGENCY ? 'bg-primary/20' : insights.scales.agency <= THRESHOLDS.LOW_AGENCY ? 'bg-amber-600/20 dark:bg-amber-400/20' : 'bg-muted'}`}
                    aria-label={`Agency level: ${insights.scales.agency} out of 10`}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className={`font-medium ${insights.scales.difficulty >= THRESHOLDS.HIGH_DIFFICULTY || insights.scales.difficulty <= THRESHOLDS.LOW_DIFFICULTY ? 'text-primary' : 'text-foreground'}`}>
                      {insights.scales.difficulty}/10
                      {insights.scales.difficulty >= THRESHOLDS.HIGH_DIFFICULTY && <span className="ml-1 text-destructive">🔥</span>}
                      {insights.scales.difficulty <= THRESHOLDS.LOW_DIFFICULTY && <span className="ml-1 text-emerald-600 dark:text-emerald-400">✅</span>}
                    </span>
                  </div>
                  <Progress 
                    value={insights.scales.difficulty * 10}
                    className={`${insights.scales.difficulty >= THRESHOLDS.HIGH_DIFFICULTY ? 'bg-destructive/20' : insights.scales.difficulty <= THRESHOLDS.LOW_DIFFICULTY ? 'bg-emerald-600/20 dark:bg-emerald-500/20' : 'bg-muted'}`}
                    aria-label={`Difficulty level: ${insights.scales.difficulty} out of 10`}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Opportunity</span>
                    <span className={`font-medium ${insights.scales.opportunity >= THRESHOLDS.HIGH_OPPORTUNITY || insights.scales.opportunity <= THRESHOLDS.LOW_OPPORTUNITY ? 'text-primary' : 'text-foreground'}`}>
                      {insights.scales.opportunity}/10
                      {insights.scales.opportunity >= THRESHOLDS.HIGH_OPPORTUNITY && <span className="ml-1 text-primary">🚀</span>}
                      {insights.scales.opportunity <= THRESHOLDS.LOW_OPPORTUNITY && <span className="ml-1 text-muted-foreground">💤</span>}
                    </span>
                  </div>
                  <Progress 
                    value={insights.scales.opportunity * 10}
                    className={`${insights.scales.opportunity >= THRESHOLDS.HIGH_OPPORTUNITY ? 'bg-primary/20' : 'bg-muted'}`}
                    aria-label={`Opportunity level: ${insights.scales.opportunity} out of 10`}
                  />
                </div>
              </div>
              
              {/* Timing */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Timing:</span>
                  <Badge variant={insights.scales.timing === 'immediate' ? 'default' : 'secondary'}>
                    {insights.scales.timing.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </section>

            {/* Energy Balance */}
            <section className="bg-muted/50 rounded-lg p-4 border">
              <h4 className="font-medium text-sm mb-3 text-foreground">Energy Balance</h4>
              
              {/* Active vs Receptive */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                  <span className={activeReceptiveSum > 0 && Math.abs(insights.energyBalance.active - insights.energyBalance.receptive) >= 30 ? 'text-primary font-medium' : ''}>
                    Active: {insights.energyBalance.active}%
                    {insights.energyBalance.active >= 70 ? ' ⚡' : ''}
                  </span>
                  <span className={activeReceptiveSum > 0 && Math.abs(insights.energyBalance.active - insights.energyBalance.receptive) >= 30 ? 'text-primary font-medium' : ''}>
                    Receptive: {insights.energyBalance.receptive}%
                    {insights.energyBalance.receptive >= 70 ? ' 🌙' : ''}
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-muted" role="progressbar" aria-label={`Energy balance: ${insights.energyBalance.active}% active, ${insights.energyBalance.receptive}% receptive`}>
                  <div className={`${insights.energyBalance.active >= THRESHOLDS.HIGH_ENERGY ? 'bg-primary/70' : 'bg-muted-foreground/50'} transition-all duration-200`} style={{ width: `${insights.energyBalance.active}%` }} />
                  <div className={`${insights.energyBalance.receptive >= THRESHOLDS.HIGH_ENERGY ? 'bg-primary' : 'bg-muted-foreground/70'} transition-all duration-200`} style={{ width: `${insights.energyBalance.receptive}%` }} />
                </div>
              </div>
              
              {/* Energy Areas */}
              <div className="space-y-2">
                {energyAreas.map(area => (
                  <div key={area.key} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      {area.key === 'mental' && <Brain className={`w-4 h-4 ${area.key === dominantEnergy.key ? 'text-primary' : 'text-muted-foreground'}`} />}
                      {area.key === 'emotional' && <Heart className={`w-4 h-4 ${area.key === dominantEnergy.key ? 'text-primary' : 'text-muted-foreground'}`} />}
                      {area.key === 'spiritual' && <Star className={`w-4 h-4 ${area.key === dominantEnergy.key ? 'text-primary' : 'text-muted-foreground'}`} />}
                      {area.key === 'material' && <Package className={`w-4 h-4 ${area.key === dominantEnergy.key ? 'text-primary' : 'text-muted-foreground'}`} />}
                      <span className={`capitalize ${area.key === dominantEnergy.key ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {area.key}
                        {area.key === dominantEnergy.key && area.value >= 40 ? ' 👑' : ''}
                      </span>
                    </div>
                    <span className={`font-medium ${area.key === dominantEnergy.key ? 'text-primary' : 'text-foreground'}`}>
                      {area.value}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Elemental Distribution */}
            <section className="bg-muted/50 rounded-lg p-4 border">
              <h4 className="font-medium text-sm mb-3 text-foreground">Elements</h4>
              
              {/* Element Bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-3 bg-muted" role="progressbar" aria-label={`Elemental distribution: ${elements.map(el => `${el.key} ${el.value}%`).join(', ')}`}>
                {elements.map(el => (
                  <div
                    key={el.key}
                    className={`
                      ${el.key === dominantElement.key && el.value >= THRESHOLDS.DOMINANT_ELEMENT ? 
                        (el.key === 'fire' ? 'bg-red-500 dark:bg-red-400' : 
                         el.key === 'water' ? 'bg-blue-500 dark:bg-blue-400' : 
                         el.key === 'air' ? 'bg-sky-400 dark:bg-sky-300' : 'bg-emerald-600 dark:bg-emerald-500') :
                        'bg-muted-foreground/50'
                      } transition-all duration-200
                    `}
                    style={{ width: `${el.value}%` }}
                  />
                ))}
              </div>
              
              {/* Element Values */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {elements.map(el => (
                  <div key={el.key} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {el.key === 'fire' && <Flame className={`w-4 h-4 ${el.key === dominantElement.key && el.value >= 40 ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground'}`} />}
                      {el.key === 'water' && <Droplets className={`w-4 h-4 ${el.key === dominantElement.key && el.value >= 40 ? 'text-blue-500 dark:text-blue-400' : 'text-muted-foreground'}`} />}
                      {el.key === 'air' && <Wind className={`w-4 h-4 ${el.key === dominantElement.key && el.value >= 40 ? 'text-sky-400 dark:text-sky-300' : 'text-muted-foreground'}`} />}
                      {el.key === 'earth' && <Mountain className={`w-4 h-4 ${el.key === dominantElement.key && el.value >= 40 ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground'}`} />}
                      <span className={`capitalize ${el.key === dominantElement.key && el.value >= 40 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {el.key}
                        {el.key === dominantElement.key && el.value >= 40 ? ' ★' : ''}
                      </span>
                    </div>
                    <span className={`font-medium ${el.key === dominantElement.key && el.value >= 40 ? 'text-foreground' : 'text-foreground'}`}>
                      {el.value}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Archetypes */}
            {insights.archetypeIntensity.length > 0 && (
              <section className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-3 text-foreground">Top Archetypes</h4>
                <div className="space-y-2">
                  {insights.archetypeIntensity.slice(0, 3).map((arch, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className={`${arch.intensity >= THRESHOLDS.HIGH_ARCHETYPE ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {arch.archetype}
                        {arch.intensity >= THRESHOLDS.HIGH_ARCHETYPE ? ' ⭐' : ''}
                      </span>
                      <span className={`font-medium ${arch.intensity >= THRESHOLDS.HIGH_ARCHETYPE ? 'text-primary' : 'text-foreground'}`}>
                        {arch.intensity}/10
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
        {/* Key Insights - Compact Layout */}
        <div className="space-y-3">
          {/* Key Themes */}
          <section className="bg-muted/50 rounded-lg p-4 border">
            <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Key Themes
            </h4>
            <div className="space-y-2">
              {insights.keyThemes.map((theme, i) => (
                <div key={i} className="flex items-center justify-between bg-background rounded-md px-3 py-2 border">
                  <span className="text-sm text-foreground">{theme}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onSendToSOAP(theme)} 
                    aria-label={`Send theme "${theme}" to SOAP`}
                    className="h-6 w-6 p-0"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
          
          {/* Potential Narrative */}
          <section className="bg-muted/50 rounded-lg p-4 border">
            <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Potential Narrative
            </h4>
            <div className="flex items-center justify-between bg-background rounded-md px-3 py-2 border">
              <span className="text-sm text-foreground">{insights.potentialNarrative}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onSendToSOAP(insights.potentialNarrative)} 
                aria-label={`Send narrative "${insights.potentialNarrative}" to SOAP`}
                className="h-6 w-6 p-0"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </section>
          
          {/* Questions to Ask */}
          <section className="bg-muted/50 rounded-lg p-4 border">
            <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Questions to Ask
            </h4>
            <div className="space-y-2">
              {insights.questionsToAsk.map((q, i) => (
                <div key={i} className="flex items-center justify-between bg-background rounded-md px-3 py-2 border">
                  <span className="text-sm text-foreground">{q}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onSendToSOAP(q)} 
                    aria-label={`Send question "${q}" to SOAP`}
                    className="h-6 w-6 p-0"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* Action Points & Warning Signals */}
        {((insights.actionPoints && insights.actionPoints.length > 0) || (insights.warningSignals && insights.warningSignals.length > 0)) && (
          <div className="grid grid-cols-1 gap-3">
            {/* Action Points */}
            {insights.actionPoints && insights.actionPoints.length > 0 && (
              <section className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Action Points
                </h4>
                <div className="space-y-2">
                  {insights.actionPoints.map((action, i) => (
                    <div key={i} className="flex items-center justify-between bg-background rounded-md px-3 py-2 border">
                      <span className="text-sm text-foreground">{action}</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onSendToSOAP(action)} 
                        aria-label={`Send action "${action}" to SOAP`}
                        className="h-6 w-6 p-0"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Warning Signals */}
            {insights.warningSignals && insights.warningSignals.length > 0 && (
              <section className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Warning Signals
                </h4>
                <div className="space-y-2">
                  {insights.warningSignals.map((warning, i) => (
                    <div key={i} className="flex items-center justify-between bg-background rounded-md px-3 py-2 border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{warning.signal}</span>
                        <Badge variant={getSeverityVariant(warning.severity)}>
                          {warning.severity}/10
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onSendToSOAP(warning.signal)} 
                        aria-label={`Send warning "${warning.signal}" to SOAP`}
                        className="h-6 w-6 p-0"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Send All Button */}
        <div className="pt-4 border-t border-border">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full" 
            onClick={() => onSendToSOAP([
              ...insights.keyThemes,
              insights.potentialNarrative,
              ...insights.questionsToAsk,
              ...(insights.actionPoints || []),
            ])} 
            aria-label="Send all insights to SOAP notes"
          >
            <Sparkles className="w-4 h-4" />
            Send All to SOAP
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}