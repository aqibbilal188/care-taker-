import { NextRequest, NextResponse } from "next/server";
import {
  buildAiContext,
  complianceTasks,
  contractorVisits,
  tickets,
  schools,
  schoolName,
  REGISTER_TOTAL,
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

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
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
// Every answer is derived from the live data — no hard-coded site/job names.
function fallbackAnswer(q: string): string {
  const t = q.toLowerCase();
  const byHealth = [...schools].sort((a, b) => a.healthScore - b.healthScore);
  const worst = byHealth[0];
  const best = byHealth[byHealth.length - 1];

  if (/(water|legionella|l8|hygiene)/.test(t)) {
    const next = complianceTasks
      .filter((c) => /water|legionella|hygiene|calorifier|tmv|tank/i.test(c.title + c.category))
      .sort((a, b) => a.daysOffset - b.daysOffset)[0];
    if (next) {
      return `The most urgent water-hygiene task is **${next.title}** at **${schoolName(
        next.schoolId
      )}** — ${next.dueLabel}, assigned to ${next.responsible}. I'd confirm attendance and temperature logging before the visit.`;
    }
  }

  if (/(overdue|late|missed|behind)/.test(t)) {
    const od = complianceTasks.filter((c) => c.urgency === "overdue");
    const list = od
      .map((c) => `• ${c.title} — ${schoolName(c.schoolId)} (${c.dueLabel})`)
      .join("\n");
    const lead = od.find((c) => /fire/i.test(c.title + c.category)) ?? od[0];
    return `You have **${od.length} overdue compliance task${
      od.length === 1 ? "" : "s"
    }**:\n\n${list}\n\n${
      lead
        ? `Priority: **${lead.title}** at ${schoolName(
            lead.schoolId
          )} — overdue statutory work is a legal and insurance risk. Want me to escalate it to ${lead.responsible}?`
        : ""
    }`;
  }

  if (/(fire audit|fire risk|fra|fire inspection|prepare)/.test(t)) {
    const fireOverdue = complianceTasks.filter(
      (c) => c.urgency === "overdue" && /fire/i.test(c.title + c.category)
    );
    const flag = fireOverdue.length
      ? ` (note: ${fireOverdue
          .map((c) => `${c.title} at ${schoolName(c.schoolId)} is ${c.dueLabel.toLowerCase()}`)
          .join("; ")} — clear these first)`
      : "";
    return `To prepare for a fire audit:\n\n1. Confirm the Fire Risk Assessment is in date${flag}.\n2. Check weekly fire-alarm test logs are complete.\n3. Verify emergency-lighting function tests are up to date.\n4. Ensure fire doors, signage and extinguisher service tags are current.\n5. Have evacuation plans and the latest drill record ready.\n\nI can generate a printable audit-readiness checklist per site if useful.`;
  }

  if (/(contractor|visit|sprinkler|notif|coming|tomorrow)/.test(t)) {
    const unnotified = contractorVisits.filter((v) => !v.notified);
    const list = (unnotified.length ? unnotified : contractorVisits)
      .map((v) => `• ${v.contractor} — ${v.purpose} at ${schoolName(v.schoolId)} (${v.whenLabel})`)
      .join("\n");
    if (unnotified.length) {
      return `There ${unnotified.length === 1 ? "is" : "are"} **${
        unnotified.length
      } upcoming contractor visit${
        unnotified.length === 1 ? "" : "s"
      } the site team hasn't been notified about**:\n\n${list}\n\nThis is exactly the "surprise visit" risk. I can send notifications now via email, SMS, WhatsApp or Teams.`;
    }
    return `Upcoming contractor visits:\n\n${list}\n\nAll sites have been notified. Want me to add any of these to the site calendars?`;
  }

  if (/(sla|breach|ticket|job|help ?desk|escalat)/.test(t)) {
    const sorted = [...tickets].sort((a, b) => a.slaHoursLeft - b.slaHoursLeft);
    const urgent = sorted
      .slice(0, 3)
      .map((tk) => `• ${tk.id} — ${tk.title} (${schoolName(tk.schoolId)}): ${tk.slaLabel}`)
      .join("\n");
    const breached = sorted.filter((tk) => tk.slaHoursLeft < 0);
    const next = sorted.find((tk) => tk.slaHoursLeft >= 0);
    const tail = `${
      next
        ? `**${next.id}** breaches next (${next.slaLabel.toLowerCase()}) — recommend escalating to ${next.assignedTo} now. `
        : ""
    }${
      breached.length
        ? `${breached.length} job${breached.length === 1 ? " has" : "s have"} already breached.`
        : ""
    }`;
    return `Highest-risk jobs by SLA:\n\n${urgent}\n\n${tail}`;
  }

  if (/(health|status|overview|how are|summary|worst|risk|attention)/.test(t)) {
    const list = byHealth
      .map((s) => `• ${s.name}: ${s.healthScore}% (${s.status})`)
      .join("\n");
    const wOverdue = complianceTasks.filter(
      (c) => c.schoolId === worst.id && c.urgency === "overdue"
    ).length;
    return `Estate health summary (lowest first):\n\n${list}\n\n**${worst.name}** needs the most attention — ${worst.healthScore}% health, ${wOverdue} overdue compliance task${
      wOverdue === 1 ? "" : "s"
    } and ${worst.openIncidents} open incident${
      worst.openIncidents === 1 ? "" : "s"
    }. **${best.name}** is in great shape at ${best.healthScore}%.`;
  }

  return `I'm your estates operations copilot. I can see live data for ${schools.length} schools across ${schools[0]?.region ?? "your estate"} — ${REGISTER_TOTAL} planned maintenance tasks, plus contractor visits, help-desk SLAs and incidents.\n\nTry asking:\n• "Which compliance tasks are overdue?"\n• "When is the next water test?"\n• "Which jobs are about to breach SLA?"\n• "Which school needs the most attention?"\n• "How do I prepare for a fire audit?"`;
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
