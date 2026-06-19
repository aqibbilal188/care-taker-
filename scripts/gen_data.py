# Generates src/lib/data.ts from the customer's real Amey PPM schedule.
import openpyxl, json, random
from collections import defaultdict

SRC = r"C:\saas clients\care taker\caretaker-ai\Dumfries All Schools 26-27 (6) (1).xlsx"
OUT = r"C:\saas clients\care taker\caretaker-ai\src\lib\data.ts"

wb = openpyxl.load_workbook(SRC, data_only=True)
ws = wb["Dumfries"]
rows = list(ws.iter_rows(values_only=True))[2:]

FREQ_ORDER = {"1W": 0, "1M": 1, "3M": 2, "6M": 3, "12M": 4}
FREQ_LABEL = {"1W": "Weekly", "1M": "Monthly", "3M": "Quarterly",
              "6M": "6-Monthly", "12M": "Annual"}

def freq_of(r):
    best = None
    for c in r[7:19]:
        if c in (None, ""):
            continue
        tok = str(c).strip()
        if tok in FREQ_ORDER:
            if best is None or FREQ_ORDER[tok] < FREQ_ORDER[best]:
                best = tok
    return FREQ_LABEL.get(best, "Annual")

# group real tasks per school
by_school = defaultdict(list)
reg_total = 0
reg_stat = 0
for r in rows:
    if not r[0]:
        continue
    reg_total += 1
    statutory = (str(r[6]).strip() == "Statutory") if r[6] else False
    if statutory:
        reg_stat += 1
    by_school[str(r[0]).strip()].append({
        "system": str(r[2]).strip() if r[2] else "General",
        "task": str(r[3]).strip() if r[3] else "Maintenance task",
        "ref": str(r[4]).strip() if r[4] else "",
        "assignment": str(r[5]).strip() if r[5] else "Site Team",
        "statutory": statutory,
        "frequency": freq_of(r),
    })

# School meta (region/pupils/buildings/manager invented — not in source file)
META = {
    "Castle Douglas": dict(pupils=430, buildings=4, manager="Fiona Bell", phase="Primary"),
    "Heathhall":      dict(pupils=290, buildings=3, manager="Andrew Reid", phase="Primary"),
    "Kirkcudbright":  dict(pupils=510, buildings=4, manager="Morag Sinclair", phase="Primary"),
    "Lockerbie":      dict(pupils=1180, buildings=8, manager="Derek Hamilton", phase="Academy"),
    "Moffat":         dict(pupils=620, buildings=5, manager="Claire Watson", phase="All-through"),
    "St Andrew's":    dict(pupils=240, buildings=3, manager="Paul McKenna", phase="Primary"),
    "Stranraer":      dict(pupils=1340, buildings=9, manager="Susan Bryce", phase="Academy"),
    "Wallacehall":    dict(pupils=980, buildings=7, manager="Gordon Tait", phase="Academy"),
}

# risk profile: (overdue_count, soon_count, health, status, incidents)
PROFILE = {
    "Stranraer":     (3, 3, 58, "critical", 3),
    "Lockerbie":     (3, 2, 61, "critical", 2),
    "Wallacehall":   (1, 3, 74, "attention", 1),
    "Moffat":        (1, 2, 77, "attention", 1),
    "Castle Douglas":(1, 2, 79, "attention", 1),
    "Heathhall":     (0, 2, 86, "healthy", 0),
    "Kirkcudbright": (0, 1, 90, "healthy", 0),
    "St Andrew's":   (0, 1, 92, "healthy", 0),
}

IMPORTANT = ["fire risk", "fire door", "fire alarm", "legionella", "emergency light",
             "sprinkler", "hydrant", "gas", "fixed wire", "water", "lift", "pressure"]

rng = random.Random(42)
school_order = sorted(by_school.keys())  # deterministic
schools, comp_tasks = [], []
sid_map = {}
ct = 0

for i, name in enumerate(school_order):
    sid = f"s{i+1}"
    sid_map[name] = sid
    meta = META[name]
    od, soon, health, status, incidents = PROFILE[name]
    tasks = by_school[name]
    stat_tasks = [t for t in tasks if t["statutory"]]
    # pick "important" statutory tasks for overdue
    def score(t):
        s = (t["system"] + " " + t["task"]).lower()
        return sum(1 for k in IMPORTANT if k in s)
    pool = sorted(stat_tasks, key=lambda t: (-score(t), t["task"]))
    chosen_refs = set()
    def take(n, pool):
        out = []
        if n <= 0:
            return out
        for t in pool:
            key = t["system"] + t["task"]
            if key in chosen_refs:
                continue
            chosen_refs.add(key)
            out.append(t)
            if len(out) == n:
                break
        return out
    overdue_tasks = take(od, pool)
    soon_tasks = take(soon, pool[len(overdue_tasks):] + stat_tasks)
    # ok filler — varied systems
    rest = [t for t in tasks if (t["system"]+t["task"]) not in chosen_refs]
    rng.shuffle(rest)
    ok_tasks = take(5, rest)

    def add(t, urgency):
        global ct
        ct += 1
        if urgency == "overdue":
            d = -rng.randint(1, 9); lbl = f"Overdue by {-d} day" + ("s" if -d > 1 else "")
        elif urgency == "critical":
            d = 1; lbl = "Due tomorrow"
        elif urgency == "soon":
            d = rng.randint(3, 14); lbl = f"Due in {d} days"
        else:
            d = rng.randint(21, 95); lbl = f"Due in {d} days"
        comp_tasks.append({
            "id": f"c{ct}", "schoolId": sid, "category": t["system"],
            "title": t["task"], "frequency": t["frequency"], "dueLabel": lbl,
            "daysOffset": d, "urgency": urgency, "responsible": t["assignment"],
        })

    for j, t in enumerate(overdue_tasks):
        add(t, "overdue")
    for j, t in enumerate(soon_tasks):
        add(t, "critical" if j == 0 and status == "critical" else "soon")
    for t in ok_tasks:
        add(t, "ok")

    schools.append({
        "id": sid, "name": f"{name} {'Academy' if meta['phase']=='Academy' else ('School' if meta['phase']=='All-through' else 'Primary')}",
        "region": "Dumfries & Galloway",
        "address": f"{name}, Dumfries & Galloway",
        "pupils": meta["pupils"], "buildings": meta["buildings"],
        "healthScore": health, "status": status, "manager": meta["manager"],
        "openIncidents": incidents,
        "overdueTasks": len(overdue_tasks),
        "slaAtRisk": 0,
        "taskTotal": len(tasks),
        "statutoryTotal": sum(1 for t in tasks if t["statutory"]),
    })

S = sid_map

contractor_visits = [
    dict(id="v1", schoolId=S["Stranraer"], contractor="APS Safety Systems", trade="Fire Safety",
         purpose="Fire alarm installation service & test", whenLabel="Tomorrow · 09:00",
         hoursOffset=18, notified=False, status="scheduled"),
    dict(id="v2", schoolId=S["Lockerbie"], contractor="British Engineering", trade="Statutory Inspection",
         purpose="Pressure system insurance inspection", whenLabel="Today · 13:30",
         hoursOffset=3, notified=True, status="scheduled"),
    dict(id="v3", schoolId=S["Stranraer"], contractor="Thyssenkrupp", trade="Lifts",
         purpose="Passenger lift LOLER examination", whenLabel="Thu · 08:30",
         hoursOffset=60, notified=False, status="scheduled"),
    dict(id="v4", schoolId=S["Wallacehall"], contractor="Halliday Lighting", trade="Electrical",
         purpose="Emergency lighting annual discharge test", whenLabel="Fri · 10:00",
         hoursOffset=84, notified=True, status="scheduled"),
    dict(id="v5", schoolId=S["Moffat"], contractor="SMS", trade="Water Hygiene",
         purpose="Legionella monthly monitoring & temps", whenLabel="Next Mon · 09:30",
         hoursOffset=140, notified=True, status="scheduled"),
    dict(id="v6", schoolId=S["Castle Douglas"], contractor="Johnson Controls", trade="Controls/BMS",
         purpose="BMS controls planned maintenance", whenLabel="Next Tue · 11:00",
         hoursOffset=160, notified=True, status="scheduled"),
]

tickets = [
    dict(id="HD-5012", schoolId=S["Stranraer"], title="No heating — Maths & Science block",
         priority="P1", category="Boilers/Heat Generators", raisedLabel="Raised 20h ago",
         slaLabel="SLA breach in 4h", slaHoursLeft=4, status="in-progress", assignedTo="British Engineering"),
    dict(id="HD-4998", schoolId=S["Lockerbie"], title="Fire alarm panel fault — repeated",
         priority="P1", category="Fire Alarm/Protection/Security Systems", raisedLabel="Raised 2d ago",
         slaLabel="SLA breached 7h ago", slaHoursLeft=-7, status="awaiting-parts", assignedTo="APS Safety Systems"),
    dict(id="HD-5020", schoolId=S["Wallacehall"], title="Lift out of service — main building",
         priority="P2", category="Lifts", raisedLabel="Raised 1d ago",
         slaLabel="SLA in 9h", slaHoursLeft=9, status="open", assignedTo="Thyssenkrupp"),
    dict(id="HD-5031", schoolId=S["Stranraer"], title="Water leak — changing rooms",
         priority="P2", category="Sanitary/Waste Water Plumbing", raisedLabel="Raised 6h ago",
         slaLabel="SLA in 2d", slaHoursLeft=48, status="open", assignedTo="March Engineering"),
    dict(id="HD-5004", schoolId=S["Moffat"], title="Flickering lighting — Block B corridor",
         priority="P3", category="Electrics in Buildings", raisedLabel="Raised 2d ago",
         slaLabel="SLA in 3d", slaHoursLeft=72, status="open", assignedTo="DMI"),
    dict(id="HD-5040", schoolId=S["Lockerbie"], title="Faulty fire door closer — Sports Hall",
         priority="P3", category="Building Fabric", raisedLabel="Raised 9h ago",
         slaLabel="SLA in 28h", slaHoursLeft=28, status="open", assignedTo="Amey"),
]

# set slaAtRisk per school
for sc in schools:
    sc["slaAtRisk"] = sum(1 for t in tickets if t["schoolId"] == sc["id"] and t["slaHoursLeft"] <= 12)

def name_of(sid):
    return next(s["name"] for s in schools if s["id"] == sid)

alerts = [
    dict(id="a1", type="contractor", severity="warning",
         title="Unannounced contractor visit tomorrow",
         detail=f"APS Safety Systems is booked for a fire alarm service at {name_of(S['Stranraer'])} at 09:00 — the site team has NOT been notified.",
         schoolId=S["Stranraer"], timeLabel="3m ago"),
    dict(id="a2", type="sla", severity="critical",
         title="P1 SLA breach imminent",
         detail="Ticket HD-5012 (no heating, Maths & Science block) breaches its SLA in 4 hours. Recommend escalating to British Engineering now.",
         schoolId=S["Stranraer"], timeLabel="12m ago"),
    dict(id="a3", type="escalation", severity="critical",
         title="Repeat fire alarm fault",
         detail=f"HD-4998 at {name_of(S['Lockerbie'])} is the 3rd fire alarm panel fault in 60 days and has already breached SLA — recommend a permanent engineering fix.",
         schoolId=S["Lockerbie"], timeLabel="1h ago"),
    dict(id="a4", type="compliance", severity="critical",
         title="Statutory compliance overdue",
         detail=f"{name_of(S['Stranraer'])} has overdue statutory PPM tasks (fire/water). Overdue statutory work is a legal and insurance risk.",
         schoolId=S["Stranraer"], timeLabel="2h ago"),
    dict(id="a5", type="contractor", severity="warning",
         title="LOLER lift exam — no site notice",
         detail=f"Thyssenkrupp arrives Thursday 08:30 at {name_of(S['Stranraer'])} for a passenger-lift LOLER exam. Site team not yet notified.",
         schoolId=S["Stranraer"], timeLabel="4h ago"),
    dict(id="a6", type="incident", severity="info",
         title="Insurance inspection today",
         detail=f"British Engineering arrives at {name_of(S['Lockerbie'])} at 13:30 for a pressure-system insurance inspection. Site team notified.",
         schoolId=S["Lockerbie"], timeLabel="5h ago"),
]

# ---- emit TypeScript ----
HEADER = '''// Caretaker AI — data layer.
// Built from the customer's real Amey PPM Schedule 2026-27 (8 Dumfries &
// Galloway schools). Compliance tasks, contractors, frequencies and statutory
// flags are REAL. The "live" status layer (overdue/SLA/alerts) and pupil/manager
// figures are synthesised for the demo. Regenerate with scripts/gen_data.py.

export type Urgency = "overdue" | "critical" | "soon" | "ok";
export type SchoolStatus = "healthy" | "attention" | "critical";

export interface School {
  id: string; name: string; region: string; address: string;
  pupils: number; buildings: number; healthScore: number; status: SchoolStatus;
  manager: string; openIncidents: number; overdueTasks: number; slaAtRisk: number;
  taskTotal: number; statutoryTotal: number;
}
export interface ComplianceTask {
  id: string; schoolId: string; category: string; title: string; frequency: string;
  dueLabel: string; daysOffset: number; urgency: Urgency; responsible: string;
}
export interface ContractorVisit {
  id: string; schoolId: string; contractor: string; trade: string; purpose: string;
  whenLabel: string; hoursOffset: number; notified: boolean;
  status: "scheduled" | "in-progress" | "completed";
}
export interface Ticket {
  id: string; schoolId: string; title: string; priority: "P1" | "P2" | "P3" | "P4";
  category: string; raisedLabel: string; slaLabel: string; slaHoursLeft: number;
  status: "open" | "in-progress" | "awaiting-parts" | "resolved"; assignedTo: string;
}
export interface Alert {
  id: string; type: "contractor" | "compliance" | "sla" | "incident" | "escalation";
  severity: "info" | "warning" | "critical"; title: string; detail: string;
  schoolId: string; timeLabel: string;
}

export const REGISTER_TOTAL = %d;
export const REGISTER_STATUTORY = %d;

export const schools: School[] = %s;
export const complianceTasks: ComplianceTask[] = %s;
export const contractorVisits: ContractorVisit[] = %s;
export const tickets: Ticket[] = %s;
export const alerts: Alert[] = %s;
''' % (reg_total, reg_stat,
       json.dumps(schools, indent=2, ensure_ascii=False),
       json.dumps(comp_tasks, indent=2, ensure_ascii=False),
       json.dumps(contractor_visits, indent=2, ensure_ascii=False),
       json.dumps(tickets, indent=2, ensure_ascii=False),
       json.dumps(alerts, indent=2, ensure_ascii=False))

FOOTER = '''
// ---- Helpers -------------------------------------------------------------

export const schoolName = (id: string) =>
  schools.find((s) => s.id === id)?.name ?? "Unknown site";

export function portfolioStats() {
  const totalSchools = schools.length;
  const avgHealth = Math.round(
    schools.reduce((a, s) => a + s.healthScore, 0) / totalSchools
  );
  const openIncidents = schools.reduce((a, s) => a + s.openIncidents, 0);
  const overdueCompliance = complianceTasks.filter((t) => t.urgency === "overdue").length;
  const slaAtRisk = tickets.filter((t) => t.slaHoursLeft <= 12).length;
  const upcomingVisits = contractorVisits.filter((v) => v.status === "scheduled").length;
  const unnotifiedVisits = contractorVisits.filter(
    (v) => !v.notified && v.status === "scheduled"
  ).length;
  return {
    totalSchools, avgHealth, openIncidents, overdueCompliance, slaAtRisk,
    upcomingVisits, unnotifiedVisits,
    totalPupils: schools.reduce((a, s) => a + s.pupils, 0),
    registerTotal: REGISTER_TOTAL,
    registerStatutory: REGISTER_STATUTORY,
  };
}

export function buildAiContext(): string {
  const stats = portfolioStats();
  const lines: string[] = [];
  lines.push(`PORTFOLIO: ${stats.totalSchools} schools in Dumfries & Galloway, ${stats.totalPupils} pupils. The full Amey PPM register holds ${REGISTER_TOTAL} planned maintenance tasks (${REGISTER_STATUTORY} statutory). Average compliance health ${stats.avgHealth}%.`);
  lines.push(`Open incidents: ${stats.openIncidents}. Overdue compliance tasks: ${stats.overdueCompliance}. SLA tickets at risk: ${stats.slaAtRisk}. Upcoming contractor visits: ${stats.upcomingVisits} (${stats.unnotifiedVisits} with NO site notification).`);
  lines.push("\\nSCHOOLS:");
  for (const s of schools) {
    lines.push(`- ${s.name} (${s.region}) — health ${s.healthScore}% [${s.status}], manager ${s.manager}, ${s.taskTotal} PPM tasks (${s.statutoryTotal} statutory), ${s.openIncidents} open incidents, ${s.overdueTasks} overdue.`);
  }
  lines.push("\\nNOTABLE / OVERDUE COMPLIANCE TASKS:");
  for (const t of complianceTasks.filter((t) => t.urgency !== "ok")) {
    lines.push(`- [${schoolName(t.schoolId)}] ${t.title} (${t.category}, ${t.frequency}) — ${t.dueLabel}. Responsible: ${t.responsible}.`);
  }
  lines.push("\\nCONTRACTOR VISITS:");
  for (const v of contractorVisits) {
    lines.push(`- [${schoolName(v.schoolId)}] ${v.contractor} (${v.trade}) — ${v.purpose}, ${v.whenLabel}. Site notified: ${v.notified ? "yes" : "NO"}.`);
  }
  lines.push("\\nHELP DESK TICKETS:");
  for (const t of tickets) {
    lines.push(`- ${t.id} [${schoolName(t.schoolId)}] ${t.title} (${t.priority}, ${t.status}) — ${t.slaLabel}. Assigned: ${t.assignedTo}.`);
  }
  return lines.join("\\n");
}
'''

with open(OUT, "w", encoding="utf-8") as f:
    f.write(HEADER + FOOTER)

print("WROTE", OUT)
print("schools:", len(schools), "| compliance tasks:", len(comp_tasks),
      "| register total:", reg_total, "statutory:", reg_stat)
for s in schools:
    print(f"  {s['id']} {s['name']}: health {s['healthScore']} {s['status']} "
          f"({s['taskTotal']} tasks, {s['overdueTasks']} overdue shown)")
