import React, { useState } from 'react';
import { Project, ProcurementItem } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { 
  auditProcurementAI, 
  forecastSiteRisksAI, 
  generateExecutiveBriefAI, 
  estimateBoQItemsAI, 
  draftExecutiveDirectiveAI,
  askProjectCopilotAI,
  EstimatedBoQItem 
} from '../../services/aiService';
import { 
  Sparkles, 
  Bot, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  Send, 
  Plus, 
  CheckCircle2, 
  Loader2, 
  Layers, 
  DollarSign, 
  HardHat, 
  Building2, 
  ArrowRight,
  HelpCircle,
  Cpu,
  RefreshCw,
  Award
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AiAddonsTabProps {
  project: Project;
}

export const AiAddonsTab: React.FC<AiAddonsTabProps> = ({ project }) => {
  const { currentRole, addProcurementItem, submitCeoDecision } = useProjectContext();

  // Active AI Tool Tab
  const [activeTool, setActiveTool] = useState<
    'copilot' | 'boq_generator' | 'variance_auditor' | 'site_forecast' | 'ceo_briefing' | 'directive_drafter'
  >('copilot');

  // Tool 1: Copilot
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your AI Project Copilot for The Design Address by Rana Al Kassim. I have indexed all ${project.procurement.items.length} BoQ items, site daily logs, schedule milestones, and executive sign-off states for "${project.name}". How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Tool 2: BoQ Generator
  const [scopeDesc, setScopeDesc] = useState('Bespoke Italian Calacatta Gold wall cladding with brushed champagne brass reveals');
  const [boqCategory, setBoqCategory] = useState<'Structural' | 'Mechanical' | 'Electrical' | 'Finishes'>('Finishes');
  const [generatedBoQItems, setGeneratedBoQItems] = useState<EstimatedBoQItem[]>([]);
  const [isBoQLoading, setIsBoQLoading] = useState(false);
  const [addedSuccessMsg, setAddedSuccessMsg] = useState<string | null>(null);

  // Tool 3: Variance Auditor
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Tool 4: Site Forecast
  const [forecastResult, setForecastResult] = useState<string | null>(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);

  // Tool 5: CEO Briefing
  const [ceoBriefing, setCeoBriefing] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // Tool 6: Directive Drafter
  const [directiveDecision, setDirectiveDecision] = useState<'approve' | 'revision' | 'hold'>('approve');
  const [directiveNotes, setDirectiveNotes] = useState('All Italian stone dry-lays and MEP rough-in inspections passed. Authorize stage 4 capital release.');
  const [draftedDirective, setDraftedDirective] = useState<string | null>(null);
  const [isDraftingLoading, setIsDraftingLoading] = useState(false);
  const [directiveApplied, setDirectiveApplied] = useState(false);

  // Handlers
  const handleSendCopilot = async (q?: string) => {
    const questionText = q || copilotQuestion;
    if (!questionText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCopilotMessages((prev) => [...prev, userMsg]);
    setCopilotQuestion('');
    setIsCopilotLoading(true);

    try {
      const response = await askProjectCopilotAI(project, questionText, currentRole);
      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to connect to AI server. Please verify network connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleGenerateBoQ = async () => {
    if (!scopeDesc.trim()) return;
    setIsBoQLoading(true);
    setAddedSuccessMsg(null);
    try {
      const items = await estimateBoQItemsAI(scopeDesc, boqCategory);
      setGeneratedBoQItems(items);
    } finally {
      setIsBoQLoading(false);
    }
  };

  const handleAddBoQItemToProject = (item: EstimatedBoQItem) => {
    const estTotal = item.quantity * item.estimatedUnitCost;
    const actTotal = item.quantity * item.actualUnitCost;

    addProcurementItem(project.id, {
      itemCode: item.itemCode,
      description: item.description,
      category: item.category as any,
      quantity: item.quantity,
      unit: item.unit,
      estimatedUnitCost: item.estimatedUnitCost,
      actualUnitCost: item.actualUnitCost,
      supplier: item.supplier,
      orderStatus: 'Draft',
      requiredOnSiteDate: new Date(Date.now() + item.requiredDaysFromNow * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      poNumber: 'PO-AI-' + Math.floor(1000 + Math.random() * 9000),
    });

    setAddedSuccessMsg(`Added "${item.itemCode}: ${item.description}" to Project BoQ!`);
    setTimeout(() => setAddedSuccessMsg(null), 4000);
  };

  const handleAddAllGeneratedToBoQ = () => {
    generatedBoQItems.forEach((item) => handleAddBoQItemToProject(item));
    setAddedSuccessMsg(`Successfully imported all ${generatedBoQItems.length} AI items into Project BoQ!`);
    setTimeout(() => setAddedSuccessMsg(null), 5000);
  };

  const handleRunAudit = async () => {
    setIsAuditLoading(true);
    try {
      const res = await auditProcurementAI(project);
      setAuditResult(res);
    } finally {
      setIsAuditLoading(false);
    }
  };

  const handleRunForecast = async () => {
    setIsForecastLoading(true);
    try {
      const res = await forecastSiteRisksAI(project);
      setForecastResult(res);
    } finally {
      setIsForecastLoading(false);
    }
  };

  const handleGenerateBriefing = async () => {
    setIsBriefingLoading(true);
    try {
      const res = await generateExecutiveBriefAI(project);
      setCeoBriefing(res);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const handleDraftDirective = async () => {
    setIsDraftingLoading(true);
    setDirectiveApplied(false);
    try {
      const text = await draftExecutiveDirectiveAI(project.name, 'ceo', directiveDecision, directiveNotes);
      setDraftedDirective(text);
    } finally {
      setIsDraftingLoading(false);
    }
  };

  const handleApplyDirectiveToSignOff = () => {
    if (!draftedDirective) return;
    const statusMap = {
      approve: 'approved' as const,
      revision: 'revision_required' as const,
      hold: 'on_hold' as const,
    };
    submitCeoDecision(project.id, statusMap[directiveDecision], draftedDirective, directiveDecision === 'approve');
    setDirectiveApplied(true);
  };

  return (
    <div className="space-y-6">
      {/* Luxury AI Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#2A231C] text-white rounded-2xl p-6 shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <Sparkles className="w-48 h-48 text-[#D4AF37]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B6F4E]/30 border border-[#8B6F4E]/40 text-[#E0C097] text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>AI Intelligence Addon Suite</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white">
              The Design Address AI Project Engineering
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Powered by advanced Gemini multimodal intelligence. Real-time value engineering audits, automated Bill of Quantities generation, site execution forecasts, and executive boardroom briefings for Rana Al Kassim and leadership.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-mono text-slate-400">Target Project</span>
            <span className="font-bold text-white text-sm">{project.name}</span>
            <span className="text-[11px] font-mono text-[#D4AF37]">{project.code} · ${project.budgetAllocated.toLocaleString()} Capex</span>
          </div>
        </div>

        {/* Sub-tools Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 -mb-1 scrollbar-none border-t border-slate-700/60 mt-6">
          {[
            { id: 'copilot', label: 'AI Project Copilot', icon: Bot },
            { id: 'boq_generator', label: 'AI BoQ Estimator', icon: Plus },
            { id: 'variance_auditor', label: 'Value Engineering Audit', icon: TrendingUp },
            { id: 'site_forecast', label: 'Site Safety & Hazard Predictor', icon: HardHat },
            { id: 'ceo_briefing', label: 'Boardroom CEO Briefing', icon: Award },
            { id: 'directive_drafter', label: 'Directive Drafter', icon: FileText },
          ].map((tool) => {
            const Icon = tool.icon;
            const isCurrent = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#8B6F4E] text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOOL 1: Copilot Chat */}
      {activeTool === 'copilot' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[560px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#D4AF37] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Project Intelligence Copilot</h3>
                <p className="text-[11px] text-slate-500">Ask any technical, procurement, or schedule inquiry about {project.name}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Model: gemini-3.8-flash
            </div>
          </div>

          {/* Quick Query Starters */}
          <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium">Quick Queries:</span>
            {[
              'Are we within the Capex baseline?',
              'What is the status of the Italian marble?',
              'What are open critical path milestones?',
              'What did the CEO direct for handover?',
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleSendCopilot(q)}
                className="px-2.5 py-1 bg-white hover:bg-slate-200/70 border border-slate-200 text-slate-700 rounded-md whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {copilotMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-2xl ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-[#8B6F4E] text-white shadow-2xs'
                  }`}
                >
                  {m.sender === 'user' ? 'ME' : 'AI'}
                </div>

                <div
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <div>{m.text}</div>
                  <div
                    className={`text-[9px] mt-1.5 font-mono ${
                      m.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isCopilotLoading && (
              <div className="flex gap-3 max-w-xl">
                <div className="w-7 h-7 rounded-lg bg-[#8B6F4E] text-white flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 rounded-tl-none text-xs flex items-center gap-2">
                  <span>Analyzing project BoQ, schedule logs, and contracts...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCopilot();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about material specs, contractor performance, cost variances, or schedule delays..."
                value={copilotQuestion}
                onChange={(e) => setCopilotQuestion(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:border-slate-400 transition-all"
              />
              <button
                type="submit"
                disabled={isCopilotLoading || !copilotQuestion.trim()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOOL 2: BoQ Estimator */}
      {activeTool === 'boq_generator' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Bill of Quantities (BoQ) Estimator</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Enter any interior design room or architectural scope to generate high-precision BoQ items calibrated for luxury Dubai fit-outs.
            </p>
          </div>

          {addedSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{addedSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Room / Scope Description</label>
              <input
                type="text"
                value={scopeDesc}
                onChange={(e) => setScopeDesc(e.target.value)}
                placeholder="e.g. Master suite bespoke fluted walnut wall panelling with brushed brass trim"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={boqCategory}
                onChange={(e) => setBoqCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Finishes">Finishes & Joinery</option>
                <option value="Electrical">Electrical & Lighting</option>
                <option value="Structural">Structural & Marble</option>
                <option value="Mechanical">Mechanical & HVAC</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateBoQ}
              disabled={isBoQLoading || !scopeDesc.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer disabled:bg-slate-300 transition-colors"
            >
              {isBoQLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#D4AF37]" />}
              <span>Generate BoQ Items with AI</span>
            </button>

            {generatedBoQItems.length > 0 && (
              <button
                onClick={handleAddAllGeneratedToBoQ}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Import All ({generatedBoQItems.length}) Into Project BoQ</span>
              </button>
            )}
          </div>

          {/* Generated Items Grid */}
          {generatedBoQItems.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Generated Line Items:</span>
                <span className="text-slate-500 font-mono text-[11px]">{generatedBoQItems.length} items ready for BoQ ledger</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {generatedBoQItems.map((item, idx) => {
                  const lineTotal = item.quantity * item.actualUnitCost;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded">
                            {item.itemCode}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-slate-500">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 text-xs leading-snug">
                          {item.description}
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          Supplier: <span className="font-medium text-slate-700">{item.supplier}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Qty: {item.quantity} {item.unit}</span>
                          <span className="font-mono font-bold text-slate-900">
                            ${lineTotal.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddBoQItemToProject(item)}
                          className="w-full py-1.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to BoQ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: Value Engineering & Variance Auditor */}
      {activeTool === 'variance_auditor' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Value Engineering & Cost Variance Auditor</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Evaluates line-item cost deviations, Jebel Ali shipping delays, and bulk rebate opportunities.
              </p>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg cursor-pointer shadow-xs transition-colors shrink-0"
            >
              {isAuditLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-[#D4AF37]" />}
              <span>Run Live Value Engineering Audit</span>
            </button>
          </div>

          {auditResult ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {auditResult}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-3">
              <TrendingUp className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-slate-500">
                Click &ldquo;Run Live Value Engineering Audit&rdquo; to analyze the {project.procurement.items.length} items in the BoQ ledger.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TOOL 4: Site Hazard & Delay Forecaster */}
      {activeTool === 'site_forecast' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Site Execution & Safety Hazard Forecaster</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Cross-references daily site logs, weather conditions, manpower trades, and milestone critical paths.
              </p>
            </div>

            <button
              onClick={handleRunForecast}
              disabled={isForecastLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg cursor-pointer shadow-xs transition-colors shrink-0"
            >
              {isForecastLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HardHat className="w-4 h-4 text-[#D4AF37]" />}
              <span>Run Site Hazard & Velocity Forecast</span>
            </button>
          </div>

          {forecastResult ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {forecastResult}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-3">
              <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-slate-500">
                Click &ldquo;Run Site Hazard & Velocity Forecast&rdquo; to assess trade density and environmental hazards for Tariq Mansoor.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TOOL 5: Boardroom CEO Briefing */}
      {activeTool === 'ceo_briefing' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Boardroom Executive Briefing</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Executive intelligence summary compiled for Founder & CEO Rana Al Kassim and Director of Operations Elena Vance.
              </p>
            </div>

            <button
              onClick={handleGenerateBriefing}
              disabled={isBriefingLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg cursor-pointer shadow-xs transition-colors shrink-0"
            >
              {isBriefingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4 text-[#D4AF37]" />}
              <span>Generate CEO Executive Brief</span>
            </button>
          </div>

          {ceoBriefing ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {ceoBriefing}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-3">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-slate-500">
                Click &ldquo;Generate CEO Executive Brief&rdquo; to prepare a boardroom overview of Capex health, progress, and recommendations.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TOOL 6: Directive Drafter */}
      {activeTool === 'directive_drafter' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Executive Directive Drafter</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Draft articulate, authoritative directives for Founder & CEO Rana Al Kassim to formalize executive decisions and capital releases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Decision Mandate</label>
              <select
                value={directiveDecision}
                onChange={(e) => setDirectiveDecision(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white cursor-pointer font-medium"
              >
                <option value="approve">Full Executive Approval (Greenlight)</option>
                <option value="revision">Revision Required (Punchlist Directives)</option>
                <option value="hold">Project On Hold (Permits / Dispute)</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Key Points / Punchlist Notes</label>
              <input
                type="text"
                value={directiveNotes}
                onChange={(e) => setDirectiveNotes(e.target.value)}
                placeholder="e.g. Verify Italian marble bookmatching before drawdown release"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <button
            onClick={handleDraftDirective}
            disabled={isDraftingLoading || !directiveNotes.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg cursor-pointer shadow-xs transition-colors"
          >
            {isDraftingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-[#D4AF37]" />}
            <span>Draft Executive Directive</span>
          </button>

          {draftedDirective && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Drafted Executive Statement:</span>
                <span className="text-[10px] text-slate-400 font-mono">By Rana Al Kassim, Founder & CEO</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed font-serif text-sm italic">
                &ldquo;{draftedDirective}&rdquo;
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyDirectiveToSignOff}
                  disabled={directiveApplied}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 font-semibold rounded-lg text-xs cursor-pointer transition-colors shadow-xs ${
                    directiveApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#8B6F4E] hover:bg-[#745B3E] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{directiveApplied ? 'Applied to CEO Sign-Off Room!' : 'Apply Directly to CEO Sign-Off'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
