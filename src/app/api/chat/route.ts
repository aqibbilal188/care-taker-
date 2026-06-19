import { NextRequest, NextResponse } from "next/server";
import {
  buildAiContext,
  complianceTasks,
  contractorVisits,
  tickets,
  schools,
  schoolName,
} from "@/lib/data";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are "Caretaker AI", a domain-specific operations copilot for school facilities and estates management.
You assist Facility Managers and Operations Managers with maintenance, compliance, contractor coordination and SLA monitoring across multiple school sites.

Rules:
- Answer ONLY from the live operational data provided below. Never invent schools, tasks, contractors or dates that are not in the data.
- Be concise, practical and confident — you are an operations expert. Use short paragraphs or tight bullet lists.
- When something is overdue, a legal/compliance risk, or breaching an SLA, say so plainly and recommend the next action.
- For "how do I prepare for X" questions, give a brief, sensible operational checklist.
- Use British English and UK facilities terminology (PAT, L8 Legionella, CP12, EICR, fire risk assessment, etc.).
- Keep answers under ~150 words unless asked for detail.

LIVE OPERATIONAL DATA:
`;

// --- Gemini call ----------------------------------------------------------
async function callGemini(
  messages: { role: string; content: string }[]
): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT + buildAiContext() }],
        },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text)
      .join("")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

// --- Scripted fallback (works with zero config / no network) --------------
function fallbackAnswer(q: string): string {
  const t = q.toLowerCase();

  if (/(water|legionella|l8)/.test(t)) {
    const next = complianceTasks
      .filter((c) => /water|legionella/i.test(c.title))
      .sort((a, b) => a.daysOffset - b.daysOffset)[0];
    return `The next water hygiene task is **${next.title}** at **${schoolName(
      next.schoolId
    )}** — ${next.dueLabel}, carried out by ${next.responsible}. Riverside High's monthly Legionella test is the most urgent; I'd confirm Aqua-Safe's attendance today.`;
  }

  if (/(overdue|late|missed|behind)/.test(t)) {
    const od = complianceTasks.filter((c) => c.urgency === "overdue");
    const list = od
      .map((c) => `• ${c.title} — ${schoolName(c.schoolId)} (${c.dueLabel})`)
      .join("\n");
    return `You have **${od.length} overdue compliance tasks**:\n\n${list}\n\nThe Fire Risk Assessment at Riverside High is the priority — an overdue FRA is a legal breach. Want me to escalate it to the responsible contractor?`;
  }

  if (/(fire audit|fire risk|fra|fire inspection|prepare)/.test(t)) {
    return `To prepare for a fire audit:\n\n1. Confirm the Fire Risk Assessment is in date (Riverside High's is **6 days overdue** — fix first).\n2. Check weekly fire alarm test logs are complete.\n3. Verify emergency lighting function tests (Riverside's is overdue).\n4. Ensure fire doors, signage and extinguisher service tags are current.\n5. Have evacuation plans and the latest drill record ready.\n\nI can generate a printable audit-readiness checklist per site if useful.`;
  }

  if (/(contractor|visit|sprinkler|notif)/.test(t)) {
    const unnotified = contractorVisits.filter((v) => !v.notified);
    const list = unnotified
      .map((v) => `• ${v.contractor} — ${v.purpose} at ${schoolName(v.schoolId)} (${v.whenLabel})`)
      .join("\n");
    return `There ${unnotified.length === 1 ? "is" : "are"} **${
      unnotified.length
    } upcoming contractor visit${unnotified.length === 1 ? "" : "s"} the site team hasn't been notified about**:\n\n${list}\n\nThis is exactly the "surprise visit" risk. I can send notifications now via email, SMS, WhatsApp or Teams.`;
  }

  if (/(sla|breach|ticket|job|help ?desk|escalat)/.test(t)) {
    const urgent = [...tickets]
      .sort((a, b) => a.slaHoursLeft - b.slaHoursLeft)
      .slice(0, 3)
      .map(
        (t) =>
          `• ${t.id} — ${t.title} (${schoolName(t.schoolId)}): ${t.slaLabel}`
      )
      .join("\n");
    return `Highest-risk jobs by SLA:\n\n${urgent}\n\n**HD-4821** (no heating, Science Block) breaches in 4 hours — recommend escalating to Northgas immediately. **HD-4807** has already breached.`;
  }

  if (/(health|status|overview|how are|summary|worst|risk)/.test(t)) {
    const list = schools
      .map((s) => `• ${s.name}: ${s.healthScore}% (${s.status})`)
      .join("\n");
    return `Estate health summary:\n\n${list}\n\n**Riverside High** needs attention — 56% health, 3 overdue compliance tasks, a breached roofing SLA and a contractor visit with no site notification. St. Mary's is in great shape at 91%.`;
  }

  return `I'm your estates operations copilot. I can see live data for ${schools.length} schools — compliance deadlines, contractor visits, help-desk SLAs and incidents.\n\nTry asking:\n• "Which compliance tasks are overdue?"\n• "When is the next water test?"\n• "Which jobs are about to breach SLA?"\n• "How do I prepare for a fire audit?"`;
}

export async function POST(req: NextRequest) {
  let messages: { role: string; content: string }[] = [];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const question = lastUser?.content ?? "";

  const aiText = await callGemini(messages);
  if (aiText) {
    return NextResponse.json({ reply: aiText, source: "gemini" });
  }

  return NextResponse.json({
    reply: fallbackAnswer(question),
    source: "fallback",
  });
}
