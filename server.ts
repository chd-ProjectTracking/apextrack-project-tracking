import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
}) : null;

// Helper: safe AI generator with model gemini-3.8-flash
async function generateGeminiText(prompt: string, systemInstruction?: string): Promise<string> {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: systemInstruction ? { systemInstruction } : undefined,
  });

  return response.text || '';
}

// 1. AI Procurement & Variance Auditor
app.post('/api/ai/audit-procurement', async (req, res) => {
  try {
    const { projectTitle, client, budget, items } = req.body;

    const itemsSummary = Array.isArray(items) ? items.map((i: any) => 
      `- [${i.itemCode}] ${i.description} (${i.category}): Qty ${i.quantity} ${i.unit}, Est: $${i.estimatedUnitCost}, Act: $${i.actualUnitCost}, Var: $${i.variance}, Supplier: ${i.supplier}, Status: ${i.orderStatus}`
    ).join('\n') : 'No items provided';

    const systemInstruction = 
      'You are the Chief Sourcing & Value Engineering AI Advisor for The Design Address by Rana Al Kassim, a premier luxury interior architecture and turnkey fit-out firm in Dubai, UAE. Provide a structured, highly analytical, concise procurement assessment. Structure your response with 3 clear sections: 1. Cost Variance & Margin Health, 2. Critical Supply Chain & Lead Time Risks, 3. Strategic Sourcing Recommendations for Procurement Lead.';

    const prompt = `Project: ${projectTitle}
Client: ${client}
Total Capex Budget: $${budget}

Bill of Quantities (BoQ) Items:
${itemsSummary}

Please conduct a comprehensive value engineering and cost variance audit for this luxury turnkey project. Highlight any high-variance line items, potential freight/customs delays at Jebel Ali, and specific negotiation tactics.`;

    const analysis = await generateGeminiText(prompt, systemInstruction);
    res.json({ success: true, analysis });
  } catch (err: any) {
    console.error('AI Procurement Audit Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate procurement audit' });
  }
});

// 2. AI Site Execution & Safety Risk Predictor
app.post('/api/ai/site-forecast', async (req, res) => {
  try {
    const { projectTitle, progress, logs, milestones } = req.body;

    const logsSummary = Array.isArray(logs) ? logs.slice(0, 5).map((l: any) =>
      `Date: ${l.logDate}, Shift: ${l.shift}, Weather: ${l.weather}, Manpower: ${JSON.stringify(l.labor)}, Equipment: ${l.equipmentActive?.join(', ')}, Completed: "${l.workCompleted}", Planned: "${l.workPlannedTomorrow}", Safety Notes: "${l.safetyNotes}", Delays: "${l.delaysOrBlockers || 'None'}"`
    ).join('\n---\n') : 'No recent logs';

    const systemInstruction =
      'You are the Lead Field Engineering & Safety AI Auditor for The Design Address by Rana Al Kassim in Dubai. Deliver a crisp, actionable site forecast. Structure into: 1. Manpower & Productivity Assessment, 2. Environmental & Schedule Delay Hazards, 3. Site Supervisor Action Items for Tariq Mansoor.';

    const prompt = `Project: ${projectTitle}
Current Physical Completion: ${progress}%

Recent Daily Site Construction Logs:
${logsSummary}

Forecast site execution bottlenecks, evaluate trade subcontractor density, and recommend specific measures to maintain milestone velocity with zero safety incidents.`;

    const forecast = await generateGeminiText(prompt, systemInstruction);
    res.json({ success: true, forecast });
  } catch (err: any) {
    console.error('AI Site Forecast Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate site forecast' });
  }
});

// 3. AI Executive Review & CEO Briefing Generator
app.post('/api/ai/executive-brief', async (req, res) => {
  try {
    const { project } = req.body;

    const systemInstruction = 
      'You are the Executive Strategy & Operations Intelligence AI for Rana Al Kassim, Founder & CEO of The Design Address. Produce an executive boardroom briefing evaluating operational readiness, financial margin viability, and recommending whether CEO sign-off and capital drawdown should be approved, revised, or held.';

    const prompt = `Project Code: ${project.code}
Project Name: ${project.name}
Client: ${project.client}
Location: ${project.location}
Total Capex: $${project.budgetAllocated}
Overall Progress: ${project.overallProgress}%
Operations Review Status: ${project.operationsReview?.status}
Operations Notes: "${project.operationsReview?.operationalNotes}"
CEO Status: ${project.ceoReview?.status}
Projected Margin: ${project.ceoReview?.roiProjectedMarginPct}%

Generate a high-level, executive briefing with:
1. Executive Summary & Delivery Health
2. Capex Variance & Financial Margin Check
3. Operations Manager Recommendation Validation
4. Suggested CEO Executive Directives for Rana Al Kassim`;

    const briefing = await generateGeminiText(prompt, systemInstruction);
    res.json({ success: true, briefing });
  } catch (err: any) {
    console.error('AI Executive Brief Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate executive brief' });
  }
});

// 4. AI BoQ Line Item Generator
app.post('/api/ai/estimate-boq', async (req, res) => {
  try {
    const { scopeDescription, category } = req.body;

    const systemInstruction = 
      'You are an expert luxury interior fit-out quantity surveyor and cost estimator for high-end Dubai projects. Generate an array of 3 to 5 realistic Bill of Quantities estimation items in strict JSON format based on the given room or scope description.';

    const prompt = `Generate realistic BoQ items for: "${scopeDescription}".
Category: "${category || 'Finishes'}".
Return a JSON array where each object has:
- itemCode: string (e.g. "MAT-WAL-01")
- description: string (detailed luxury specification)
- category: "Structural" | "Mechanical" | "Electrical" | "Finishes" | "Heavy Equipment" | "Site Services"
- quantity: number
- unit: string (e.g. "Sq Meters", "Linear Meters", "Sets", "Units")
- estimatedUnitCost: number (in USD)
- actualUnitCost: number (in USD, slight variance around estimated)
- supplier: string (authentic regional or European manufacturer, e.g. Verona Italy, Dubai atelier)
- requiredDaysFromNow: number (e.g. 30, 45, 60)`;

    const text = await generateGeminiText(prompt, systemInstruction);
    // Extract JSON array
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse structured JSON from AI output');
    }
    const items = JSON.parse(jsonMatch[0]);
    res.json({ success: true, items });
  } catch (err: any) {
    console.error('AI BoQ Generator Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate BoQ items' });
  }
});

// 5. AI Executive Directive Assistant
app.post('/api/ai/draft-directive', async (req, res) => {
  try {
    const { projectTitle, role, decisionType, keyPoints } = req.body;

    const prompt = `As ${role === 'ceo' ? 'Rana Al Kassim (Founder & CEO)' : 'Elena Vance (Director of Operations)'} of The Design Address, draft an authoritative, formal, and articulate executive review statement for project "${projectTitle}".
Decision: ${decisionType.toUpperCase()}
Key Points to include: "${keyPoints || 'All quality standards and budget allocations reviewed'}"
Keep it professional, executive, under 4 sentences.`;

    const directive = await generateGeminiText(prompt);
    res.json({ success: true, directive: directive.trim() });
  } catch (err: any) {
    console.error('AI Directive Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to draft directive' });
  }
});

// 6. AI Project Copilot & Instant Intelligence Q&A
app.post('/api/ai/project-copilot', async (req, res) => {
  try {
    const { project, question, userRole } = req.body;

    const systemInstruction =
      'You are the Senior Project Intelligence & Architecture AI Copilot for The Design Address by Rana Al Kassim. You have real-time access to the project BoQ items, milestones, site logs, risks, and review statuses. Provide concise, expert, actionable, and data-grounded answers to assist the user in their specific role.';

    const projectContext = `
Project: ${project.name} (${project.code})
Client: ${project.client} | Location: ${project.location}
Budget: $${project.budgetAllocated} | Progress: ${project.overallProgress}%
Status: ${project.status}
BoQ Items Count: ${project.procurement?.items?.length || 0}
Daily Logs Count: ${project.siteSupervision?.dailyLogs?.length || 0}
Milestones Count: ${project.pmSchedule?.milestones?.length || 0}
Open Risks Count: ${project.pmSchedule?.risks?.length || 0}
Operations Review: ${project.operationsReview?.status}
CEO Sign-Off: ${project.ceoReview?.status} (Margin: ${project.ceoReview?.roiProjectedMarginPct}%)
    `.trim();

    const prompt = `Context:
${projectContext}

User Role: ${userRole || 'Team Member'}
User Question: "${question}"

Please provide a precise, high-level, and helpful answer grounded in the project reality for The Design Address by Rana Al Kassim.`;

    const answer = await generateGeminiText(prompt, systemInstruction);
    res.json({ success: true, answer });
  } catch (err: any) {
    console.error('AI Copilot Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate copilot response' });
  }
});

// Vite Middleware mounting in development, or Static Serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Design Address Project Tracking Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
