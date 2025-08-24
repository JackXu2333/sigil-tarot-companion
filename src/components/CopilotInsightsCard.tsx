import React, { useState } from "react";
import { Sparkles, Lightbulb, BookOpen, HelpCircle, Send, TrendingUp, Activity, Flame, Droplets, Wind, Mountain, Brain, Heart, Star, Package, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import type { CopilotInsights } from "@/services/copilotService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  insights: CopilotInsights;
  onSendToSOAP: (content: string | string[]) => void;
}

// Helper to get sentiment color
const getSentimentColor = (value: number) => {
  if (value >= 0.5) return "text-green-600";
  if (value >= 0) return "text-blue-600";
  if (value >= -0.5) return "text-orange-600";
  return "text-red-600";
};

// Helper to format sentiment value
const formatSentiment = (value: number) => {
  const percentage = Math.round((value + 1) * 50);
  return `${percentage}%`;
};

// Helper to get severity color
const getSeverityColor = (severity: number) => {
  if (severity >= 7) return "text-red-600";
  if (severity >= 4) return "text-orange-600";
  return "text-yellow-600";
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
  const highOpportunity = insights.scales.opportunity >= 7;
  const lowDifficulty = insights.scales.difficulty <= 3;
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

  // Collapsed/expanded state for archetypes
  const [showAllArchetypes, setShowAllArchetypes] = React.useState(false);


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
        <section className="bg-muted rounded-lg p-3 border">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2 text-foreground">
            <TrendingUp className="w-4 h-4" />
            Sentiment Analysis
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center bg-background rounded p-2 border">
              <div className={`font-bold text-lg ${Math.abs(insights.sentiment.overall) > 0.5 ? 'text-primary' : 'text-foreground'}`}>
                {formatSentiment(insights.sentiment.overall)}
              </div>
              <div className="text-xs text-muted-foreground">Overall</div>
            </div>
            <div className="text-center bg-background rounded p-2 border">
              <div className={`font-bold text-lg ${Math.abs(insights.sentiment.emotional) > 0.5 ? 'text-primary' : 'text-foreground'}`}>
                {formatSentiment(insights.sentiment.emotional)}
              </div>
              <div className="text-xs text-muted-foreground">Emotional</div>
            </div>
            <div className="text-center bg-background rounded p-2 border">
              <div className={`font-bold text-lg ${Math.abs(insights.sentiment.practical) > 0.5 ? 'text-primary' : 'text-foreground'}`}>
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
            <section className="bg-muted rounded-lg p-3 border">
              <h4 className="font-medium text-sm mb-2 text-foreground">Key Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Clarity</span>
                  <span className={`font-medium ${insights.scales.clarity >= 8 || insights.scales.clarity <= 3 ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {insights.scales.clarity}/10
                    {insights.scales.clarity >= 8 && <span className="ml-1 text-indigo-600">✨</span>}
                    {insights.scales.clarity <= 3 && <span className="ml-1 text-orange-500">⚠️</span>}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className={`h-full rounded-full transition-all ${insights.scales.clarity >= 8 ? 'bg-indigo-600' : insights.scales.clarity <= 3 ? 'bg-orange-500' : 'bg-gray-400'}`} style={{ width: `${insights.scales.clarity * 10}%` }} />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Agency</span>
                  <span className={`font-medium ${insights.scales.agency >= 8 || insights.scales.agency <= 3 ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {insights.scales.agency}/10
                    {insights.scales.agency >= 8 && <span className="ml-1 text-indigo-600">💪</span>}
                    {insights.scales.agency <= 3 && <span className="ml-1 text-orange-500">⚠️</span>}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className={`h-full rounded-full transition-all ${insights.scales.agency >= 8 ? 'bg-indigo-600' : insights.scales.agency <= 3 ? 'bg-orange-500' : 'bg-gray-400'}`} style={{ width: `${insights.scales.agency * 10}%` }} />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Difficulty</span>
                  <span className={`font-medium ${insights.scales.difficulty >= 8 || insights.scales.difficulty <= 2 ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {insights.scales.difficulty}/10
                    {insights.scales.difficulty >= 8 && <span className="ml-1 text-red-500">🔥</span>}
                    {insights.scales.difficulty <= 2 && <span className="ml-1 text-green-500">✅</span>}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className={`h-full rounded-full transition-all ${insights.scales.difficulty >= 8 ? 'bg-red-500' : insights.scales.difficulty <= 2 ? 'bg-green-500' : 'bg-gray-400'}`} style={{ width: `${insights.scales.difficulty * 10}%` }} />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Opportunity</span>
                  <span className={`font-medium ${insights.scales.opportunity >= 8 || insights.scales.opportunity <= 3 ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {insights.scales.opportunity}/10
                    {insights.scales.opportunity >= 8 && <span className="ml-1 text-indigo-600">🚀</span>}
                    {insights.scales.opportunity <= 3 && <span className="ml-1 text-gray-500">💤</span>}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className={`h-full rounded-full transition-all ${insights.scales.opportunity >= 8 ? 'bg-indigo-600' : insights.scales.opportunity <= 3 ? 'bg-gray-400' : 'bg-gray-400'}`} style={{ width: `${insights.scales.opportunity * 10}%` }} />
                </div>
              </div>
              
              {/* Timing */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Timing:</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${insights.scales.timing === 'immediate' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                    {insights.scales.timing.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </section>

            {/* Energy Balance */}
            <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h4 className="font-medium text-sm mb-2 text-gray-700">Energy Balance</h4>
              
              {/* Active vs Receptive */}
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1 text-gray-600">
                  <span className={activeReceptiveSum > 0 && Math.abs(insights.energyBalance.active - insights.energyBalance.receptive) >= 30 ? 'text-indigo-600 font-medium' : ''}>
                    Active: {insights.energyBalance.active}%
                    {insights.energyBalance.active >= 70 ? ' ⚡' : ''}
                  </span>
                  <span className={activeReceptiveSum > 0 && Math.abs(insights.energyBalance.active - insights.energyBalance.receptive) >= 30 ? 'text-indigo-600 font-medium' : ''}>
                    Receptive: {insights.energyBalance.receptive}%
                    {insights.energyBalance.receptive >= 70 ? ' 🌙' : ''}
                  </span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                  <div className={`${insights.energyBalance.active >= 70 ? 'bg-indigo-400' : 'bg-gray-400'}`} style={{ width: `${insights.energyBalance.active}%` }} />
                  <div className={`${insights.energyBalance.receptive >= 70 ? 'bg-indigo-600' : 'bg-gray-500'}`} style={{ width: `${insights.energyBalance.receptive}%` }} />
                </div>
              </div>
              
              {/* Energy Areas */}
              <div className="space-y-1">
                {energyAreas.map(area => (
                  <div key={area.key} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      {area.key === 'mental' && <Brain className={`w-3 h-3 ${area.key === dominantEnergy.key ? 'text-indigo-600' : 'text-gray-500'}`} />}
                      {area.key === 'emotional' && <Heart className={`w-3 h-3 ${area.key === dominantEnergy.key ? 'text-indigo-600' : 'text-gray-500'}`} />}
                      {area.key === 'spiritual' && <Star className={`w-3 h-3 ${area.key === dominantEnergy.key ? 'text-indigo-600' : 'text-gray-500'}`} />}
                      {area.key === 'material' && <Package className={`w-3 h-3 ${area.key === dominantEnergy.key ? 'text-indigo-600' : 'text-gray-500'}`} />}
                      <span className={`capitalize ${area.key === dominantEnergy.key ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                        {area.key}
                        {area.key === dominantEnergy.key && area.value >= 40 ? ' 👑' : ''}
                      </span>
                    </div>
                    <span className={`font-medium ${area.key === dominantEnergy.key ? 'text-indigo-700' : 'text-gray-700'}`}>
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
            <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h4 className="font-medium text-sm mb-2 text-gray-700">Elements</h4>
              
              {/* Element Bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-2 bg-gray-200">
                {elements.map(el => (
                  <div
                    key={el.key}
                    className={`
                      ${el.key === dominantElement.key && el.value >= 40 ? 
                        (el.key === 'fire' ? 'bg-red-500' : 
                         el.key === 'water' ? 'bg-blue-500' : 
                         el.key === 'air' ? 'bg-sky-400' : 'bg-green-600') :
                        'bg-gray-400'
                      }
                    `}
                    style={{ width: `${el.value}%` }}
                  />
                ))}
              </div>
              
              {/* Element Values */}
              <div className="grid grid-cols-2 gap-1 text-xs">
                {elements.map(el => (
                  <div key={el.key} className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {el.key === 'fire' && <Flame className={`w-3 h-3 ${el.key === dominantElement.key && el.value >= 40 ? 'text-red-500' : 'text-gray-500'}`} />}
                      {el.key === 'water' && <Droplets className={`w-3 h-3 ${el.key === dominantElement.key && el.value >= 40 ? 'text-blue-500' : 'text-gray-500'}`} />}
                      {el.key === 'air' && <Wind className={`w-3 h-3 ${el.key === dominantElement.key && el.value >= 40 ? 'text-sky-400' : 'text-gray-500'}`} />}
                      {el.key === 'earth' && <Mountain className={`w-3 h-3 ${el.key === dominantElement.key && el.value >= 40 ? 'text-green-600' : 'text-gray-500'}`} />}
                      <span className={`capitalize ${el.key === dominantElement.key && el.value >= 40 ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                        {el.key}
                        {el.key === dominantElement.key && el.value >= 40 ? ' ★' : ''}
                      </span>
                    </div>
                    <span className={`font-medium ${el.key === dominantElement.key && el.value >= 40 ? 'text-gray-800' : 'text-gray-700'}`}>
                      {el.value}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Archetypes */}
            {insights.archetypeIntensity.length > 0 && (
              <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="font-medium text-sm mb-2 text-gray-700">Top Archetypes</h4>
                <div className="space-y-2">
                  {insights.archetypeIntensity.slice(0, 3).map((arch, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className={`${arch.intensity >= 8 ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                        {arch.archetype}
                        {arch.intensity >= 8 ? ' ⭐' : ''}
                      </span>
                      <span className={`font-medium ${arch.intensity >= 8 ? 'text-indigo-700' : 'text-gray-700'}`}>
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
          <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="font-medium text-sm mb-2 text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Key Themes
            </h4>
            <div className="space-y-1">
              {insights.keyThemes.map((theme, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded px-2 py-1 border border-gray-200">
                  <span className="text-xs text-gray-700">{theme}</span>
                  <button className="text-gray-500 hover:text-indigo-600 p-1" onClick={() => onSendToSOAP(theme)} aria-label="Send to SOAP">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
          
          {/* Potential Narrative */}
          <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="font-medium text-sm mb-2 text-gray-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Potential Narrative
            </h4>
            <div className="flex items-center justify-between bg-white rounded px-2 py-2 border border-gray-200">
              <span className="text-xs text-gray-700">{insights.potentialNarrative}</span>
              <button className="text-gray-500 hover:text-indigo-600 p-1" onClick={() => onSendToSOAP(insights.potentialNarrative)} aria-label="Send to SOAP">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </section>
          
          {/* Questions to Ask */}
          <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="font-medium text-sm mb-2 text-gray-700 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Questions to Ask
            </h4>
            <div className="space-y-1">
              {insights.questionsToAsk.map((q, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded px-2 py-1 border border-gray-200">
                  <span className="text-xs text-gray-700">{q}</span>
                  <button className="text-gray-500 hover:text-indigo-600 p-1" onClick={() => onSendToSOAP(q)} aria-label="Send to SOAP">
                    <Send className="w-3 h-3" />
                  </button>
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
              <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="font-medium text-sm mb-2 text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Action Points
                </h4>
                <div className="space-y-1">
                  {insights.actionPoints.map((action, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded px-2 py-1 border border-gray-200">
                      <span className="text-xs text-gray-700">{action}</span>
                      <button className="text-gray-500 hover:text-indigo-600 p-1" onClick={() => onSendToSOAP(action)} aria-label="Send to SOAP">
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Warning Signals */}
            {insights.warningSignals && insights.warningSignals.length > 0 && (
              <section className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h4 className="font-medium text-sm mb-2 text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Warning Signals
                </h4>
                <div className="space-y-1">
                  {insights.warningSignals.map((warning, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded px-2 py-1 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">{warning.signal}</span>
                        <span className={`text-xs px-1 rounded text-white ${warning.severity >= 8 ? 'bg-red-500' : warning.severity >= 6 ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                          {warning.severity}/10
                        </span>
                      </div>
                      <button className="text-gray-500 hover:text-indigo-600 p-1" onClick={() => onSendToSOAP(warning.signal)} aria-label="Send to SOAP">
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Send All Button */}
        <div className="pt-2 border-t border-gray-200">
          <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-indigo-100 text-indigo-700 hover:bg-indigo-200 h-8 px-4 w-full" onClick={() => onSendToSOAP([
            ...insights.keyThemes,
            insights.potentialNarrative,
            ...insights.questionsToAsk,
            ...(insights.actionPoints || []),
          ])} aria-label="Send all to SOAP">
            <Sparkles className="w-4 h-4" />
            Send All to SOAP
          </button>
        </div>
      </CardContent>
    </Card>
  );
}