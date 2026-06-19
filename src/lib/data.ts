// Caretaker AI — demo data layer.
// All dates are expressed as human labels + numeric offsets so the demo is
// deterministic (no hydration mismatches) yet always looks "live".

export type Urgency = "overdue" | "critical" | "soon" | "ok";
export type SchoolStatus = "healthy" | "attention" | "critical";

export interface School {
  id: string;
  name: string;
  region: string;
  address: string;
  pupils: number;
  buildings: number;
  healthScore: number; // 0-100
  status: SchoolStatus;
  manager: string;
  openIncidents: number;
  overdueTasks: number;
  slaAtRisk: number;
}

export interface ComplianceTask {
  id: string;
  schoolId: string;
  category: string;
  title: string;
  frequency: string;
  dueLabel: string;
  daysOffset: number; // negative = overdue
  urgency: Urgency;
  responsible: string;
}

export interface ContractorVisit {
  id: string;
  schoolId: string;
  contractor: string;
  trade: string;
  purpose: string;
  whenLabel: string;
  hoursOffset: number;
  notified: boolean;
  status: "scheduled" | "in-progress" | "completed";
}

export interface Ticket {
  id: string;
  schoolId: string;
  title: string;
  priority: "P1" | "P2" | "P3" | "P4";
  category: string;
  raisedLabel: string;
  slaLabel: string;
  slaHoursLeft: number; // negative = breached
  status: "open" | "in-progress" | "awaiting-parts" | "resolved";
  assignedTo: string;
}

export interface Alert {
  id: string;
  type: "contractor" | "compliance" | "sla" | "incident" | "escalation";
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
  schoolId: string;
  timeLabel: string;
}

export const schools: School[] = [
  {
    id: "s1",
    name: "Oakwood Academy",
    region: "North Cluster",
    address: "Oakwood Lane, Leeds LS6 2DB",
    pupils: 1180,
    buildings: 6,
    healthScore: 74,
    status: "attention",
    manager: "James Whitfield",
    openIncidents: 2,
    overdueTasks: 1,
    slaAtRisk: 1,
  },
  {
    id: "s2",
    name: "St. Mary's CofE Primary",
    region: "North Cluster",
    address: "Church Road, Harrogate HG1 4QE",
    pupils: 410,
    buildings: 3,
    healthScore: 91,
    status: "healthy",
    manager: "Priya Nair",
    openIncidents: 0,
    overdueTasks: 0,
    slaAtRisk: 0,
  },
  {
    id: "s3",
    name: "Riverside High",
    region: "South Cluster",
    address: "Mill Street, Sheffield S3 8LN",
    pupils: 1540,
    buildings: 9,
    healthScore: 56,
    status: "critical",
    manager: "Darren Cole",
    openIncidents: 3,
    overdueTasks: 3,
    slaAtRisk: 2,
  },
];

export const complianceTasks: ComplianceTask[] = [
  // Riverside High — the problem site
  {
    id: "c1",
    schoolId: "s3",
    category: "Fire Safety",
    title: "Annual Fire Risk Assessment",
    frequency: "Annual",
    dueLabel: "Overdue by 6 days",
    daysOffset: -6,
    urgency: "overdue",
    responsible: "Darren Cole",
  },
  {
    id: "c2",
    schoolId: "s3",
    category: "Water Hygiene",
    title: "Legionella Water Testing (L8)",
    frequency: "Monthly",
    dueLabel: "Due tomorrow",
    daysOffset: 1,
    urgency: "critical",
    responsible: "Aqua-Safe Ltd",
  },
  {
    id: "c3",
    schoolId: "s3",
    category: "Fire Safety",
    title: "Fire Hydrant Flow Inspection",
    frequency: "Annual",
    dueLabel: "Overdue by 2 days",
    daysOffset: -2,
    urgency: "overdue",
    responsible: "Pennine Fire Services",
  },
  {
    id: "c4",
    schoolId: "s3",
    category: "Electrical",
    title: "Emergency Lighting Function Test",
    frequency: "Monthly",
    dueLabel: "Overdue by 1 day",
    daysOffset: -1,
    urgency: "overdue",
    responsible: "Site Team",
  },
  {
    id: "c5",
    schoolId: "s3",
    category: "Electrical",
    title: "PAT Testing — Block C",
    frequency: "Annual",
    dueLabel: "Due in 9 days",
    daysOffset: 9,
    urgency: "soon",
    responsible: "VoltCheck UK",
  },
  // Oakwood Academy
  {
    id: "c6",
    schoolId: "s1",
    category: "Fire Safety",
    title: "Fire Alarm Weekly Test",
    frequency: "Weekly",
    dueLabel: "Due in 2 days",
    daysOffset: 2,
    urgency: "soon",
    responsible: "Site Team",
  },
  {
    id: "c7",
    schoolId: "s1",
    category: "Water Hygiene",
    title: "Cold Water Tank Inspection",
    frequency: "6-Monthly",
    dueLabel: "Overdue by 3 days",
    daysOffset: -3,
    urgency: "overdue",
    responsible: "Aqua-Safe Ltd",
  },
  {
    id: "c8",
    schoolId: "s1",
    category: "Gas Safety",
    title: "Commercial Gas Safety Check (CP12)",
    frequency: "Annual",
    dueLabel: "Due in 12 days",
    daysOffset: 12,
    urgency: "soon",
    responsible: "Northgas Compliance",
  },
  {
    id: "c9",
    schoolId: "s1",
    category: "Asbestos",
    title: "Asbestos Management Re-inspection",
    frequency: "Annual",
    dueLabel: "Due in 21 days",
    daysOffset: 21,
    urgency: "ok",
    responsible: "Sentinel Surveyors",
  },
  // St. Mary's — all healthy
  {
    id: "c10",
    schoolId: "s2",
    category: "Fire Safety",
    title: "Annual Fire Risk Assessment",
    frequency: "Annual",
    dueLabel: "Due in 44 days",
    daysOffset: 44,
    urgency: "ok",
    responsible: "Pennine Fire Services",
  },
  {
    id: "c11",
    schoolId: "s2",
    category: "Electrical",
    title: "Fixed Wire Testing (EICR)",
    frequency: "5-Yearly",
    dueLabel: "Due in 88 days",
    daysOffset: 88,
    urgency: "ok",
    responsible: "VoltCheck UK",
  },
  {
    id: "c12",
    schoolId: "s2",
    category: "Water Hygiene",
    title: "Legionella Water Testing (L8)",
    frequency: "Monthly",
    dueLabel: "Due in 16 days",
    daysOffset: 16,
    urgency: "ok",
    responsible: "Aqua-Safe Ltd",
  },
];

export const contractorVisits: ContractorVisit[] = [
  {
    id: "v1",
    schoolId: "s3",
    contractor: "Aqua-Safe Ltd",
    trade: "Water Hygiene",
    purpose: "Sprinkler & wet-riser inspection",
    whenLabel: "Tomorrow · 09:00",
    hoursOffset: 18,
    notified: false,
    status: "scheduled",
  },
  {
    id: "v2",
    schoolId: "s1",
    contractor: "Northgas Compliance",
    trade: "Gas Safety",
    purpose: "Boiler service — kitchen block",
    whenLabel: "Today · 14:30",
    hoursOffset: 3,
    notified: true,
    status: "scheduled",
  },
  {
    id: "v3",
    schoolId: "s3",
    contractor: "Pennine Fire Services",
    trade: "Fire Safety",
    purpose: "Fire hydrant flow test (overdue)",
    whenLabel: "Thu · 08:00",
    hoursOffset: 60,
    notified: false,
    status: "scheduled",
  },
  {
    id: "v4",
    schoolId: "s1",
    contractor: "VoltCheck UK",
    trade: "Electrical",
    purpose: "PAT testing — admin offices",
    whenLabel: "Fri · 10:00",
    hoursOffset: 84,
    notified: true,
    status: "scheduled",
  },
  {
    id: "v5",
    schoolId: "s2",
    contractor: "Sentinel Surveyors",
    trade: "Asbestos",
    purpose: "Re-inspection survey",
    whenLabel: "Next Mon · 09:30",
    hoursOffset: 140,
    notified: true,
    status: "scheduled",
  },
];

export const tickets: Ticket[] = [
  {
    id: "HD-4821",
    schoolId: "s3",
    title: "No heating — Science Block (Block C)",
    priority: "P1",
    category: "Heating / HVAC",
    raisedLabel: "Raised 20h ago",
    slaLabel: "SLA breach in 4h",
    slaHoursLeft: 4,
    status: "in-progress",
    assignedTo: "Northgas Compliance",
  },
  {
    id: "HD-4807",
    schoolId: "s3",
    title: "Leaking roof — Sports Hall",
    priority: "P2",
    category: "Building Fabric",
    raisedLabel: "Raised 3d ago",
    slaLabel: "SLA breached 6h ago",
    slaHoursLeft: -6,
    status: "awaiting-parts",
    assignedTo: "Apex Roofing",
  },
  {
    id: "HD-4815",
    schoolId: "s1",
    title: "Faulty fire door closer — Corridor 2",
    priority: "P2",
    category: "Fire Safety",
    raisedLabel: "Raised 1d ago",
    slaLabel: "SLA in 11h",
    slaHoursLeft: 11,
    status: "open",
    assignedTo: "Site Team",
  },
  {
    id: "HD-4830",
    schoolId: "s1",
    title: "Blocked drain — Kitchen",
    priority: "P3",
    category: "Plumbing",
    raisedLabel: "Raised 5h ago",
    slaLabel: "SLA in 2d",
    slaHoursLeft: 48,
    status: "open",
    assignedTo: "Drainflow Services",
  },
  {
    id: "HD-4799",
    schoolId: "s2",
    title: "Flickering lights — Classroom 4",
    priority: "P4",
    category: "Electrical",
    raisedLabel: "Raised 2d ago",
    slaLabel: "SLA in 4d",
    slaHoursLeft: 96,
    status: "open",
    assignedTo: "VoltCheck UK",
  },
  {
    id: "HD-4833",
    schoolId: "s3",
    title: "Broken window latch — Room 212",
    priority: "P3",
    category: "Building Fabric",
    raisedLabel: "Raised 8h ago",
    slaLabel: "SLA in 28h",
    slaHoursLeft: 28,
    status: "open",
    assignedTo: "Site Team",
  },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    type: "contractor",
    severity: "warning",
    title: "Unannounced contractor visit tomorrow",
    detail:
      "Aqua-Safe Ltd is booked for a sprinkler inspection at Riverside High at 09:00 — the site team has NOT been notified.",
    schoolId: "s3",
    timeLabel: "2m ago",
  },
  {
    id: "a2",
    type: "sla",
    severity: "critical",
    title: "P1 SLA breach imminent",
    detail:
      "Ticket HD-4821 (no heating, Science Block) breaches its SLA in 4 hours. Recommend escalating to Northgas now.",
    schoolId: "s3",
    timeLabel: "14m ago",
  },
  {
    id: "a3",
    type: "compliance",
    severity: "critical",
    title: "Fire Risk Assessment overdue",
    detail:
      "Riverside High's Annual Fire Risk Assessment is 6 days overdue — this is a legal compliance breach.",
    schoolId: "s3",
    timeLabel: "1h ago",
  },
  {
    id: "a4",
    type: "compliance",
    severity: "warning",
    title: "Water tank inspection overdue",
    detail:
      "Oakwood Academy's cold water tank inspection is 3 days overdue. Legionella risk rising.",
    schoolId: "s1",
    timeLabel: "3h ago",
  },
  {
    id: "a5",
    type: "escalation",
    severity: "warning",
    title: "Repeat fault detected",
    detail:
      "The Sports Hall roof leak (HD-4807) is the 3rd roofing ticket at Riverside High in 90 days — recommend a permanent fix.",
    schoolId: "s3",
    timeLabel: "5h ago",
  },
  {
    id: "a6",
    type: "incident",
    severity: "info",
    title: "Boiler service today",
    detail:
      "Northgas Compliance arrives at Oakwood Academy at 14:30 for the kitchen boiler service. Site team notified.",
    schoolId: "s1",
    timeLabel: "6h ago",
  },
];

// ---- Helpers -------------------------------------------------------------

export const schoolName = (id: string) =>
  schools.find((s) => s.id === id)?.name ?? "Unknown site";

export function portfolioStats() {
  const totalSchools = schools.length;
  const avgHealth = Math.round(
    schools.reduce((a, s) => a + s.healthScore, 0) / totalSchools
  );
  const openIncidents = schools.reduce((a, s) => a + s.openIncidents, 0);
  const overdueCompliance = complianceTasks.filter(
    (t) => t.urgency === "overdue"
  ).length;
  const slaAtRisk = tickets.filter(
    (t) => t.slaHoursLeft <= 12
  ).length;
  const upcomingVisits = contractorVisits.filter(
    (v) => v.status === "scheduled"
  ).length;
  const unnotifiedVisits = contractorVisits.filter(
    (v) => !v.notified && v.status === "scheduled"
  ).length;
  return {
    totalSchools,
    avgHealth,
    openIncidents,
    overdueCompliance,
    slaAtRisk,
    upcomingVisits,
    unnotifiedVisits,
    totalPupils: schools.reduce((a, s) => a + s.pupils, 0),
  };
}

// Compact knowledge string injected into the AI assistant's context.
export function buildAiContext(): string {
  const stats = portfolioStats();
  const lines: string[] = [];
  lines.push(`PORTFOLIO: ${stats.totalSchools} schools, ${stats.totalPupils} pupils, average compliance health ${stats.avgHealth}%.`);
  lines.push(`Open incidents: ${stats.openIncidents}. Overdue compliance tasks: ${stats.overdueCompliance}. SLA tickets at risk: ${stats.slaAtRisk}. Upcoming contractor visits: ${stats.upcomingVisits} (${stats.unnotifiedVisits} with NO site notification).`);
  lines.push("\nSCHOOLS:");
  for (const s of schools) {
    lines.push(`- ${s.name} (${s.region}) — health ${s.healthScore}% [${s.status}], manager ${s.manager}, ${s.openIncidents} open incidents, ${s.overdueTasks} overdue tasks.`);
  }
  lines.push("\nCOMPLIANCE TASKS:");
  for (const t of complianceTasks) {
    lines.push(`- [${schoolName(t.schoolId)}] ${t.title} (${t.frequency}) — ${t.dueLabel}. Responsible: ${t.responsible}.`);
  }
  lines.push("\nCONTRACTOR VISITS:");
  for (const v of contractorVisits) {
    lines.push(`- [${schoolName(v.schoolId)}] ${v.contractor} (${v.trade}) — ${v.purpose}, ${v.whenLabel}. Site notified: ${v.notified ? "yes" : "NO"}.`);
  }
  lines.push("\nHELP DESK TICKETS:");
  for (const t of tickets) {
    lines.push(`- ${t.id} [${schoolName(t.schoolId)}] ${t.title} (${t.priority}, ${t.status}) — ${t.slaLabel}. Assigned: ${t.assignedTo}.`);
  }
  return lines.join("\n");
}
