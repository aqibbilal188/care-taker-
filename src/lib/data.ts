// Caretaker AI — data layer.
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

export const REGISTER_TOTAL = 748;
export const REGISTER_STATUTORY = 379;

export const schools: School[] = [
  {
    "id": "s1",
    "name": "Castle Douglas Primary",
    "region": "Dumfries & Galloway",
    "address": "Castle Douglas, Dumfries & Galloway",
    "pupils": 430,
    "buildings": 4,
    "healthScore": 79,
    "status": "attention",
    "manager": "Fiona Bell",
    "openIncidents": 1,
    "overdueTasks": 1,
    "slaAtRisk": 0,
    "taskTotal": 91,
    "statutoryTotal": 45
  },
  {
    "id": "s2",
    "name": "Heathhall Primary",
    "region": "Dumfries & Galloway",
    "address": "Heathhall, Dumfries & Galloway",
    "pupils": 290,
    "buildings": 3,
    "healthScore": 86,
    "status": "healthy",
    "manager": "Andrew Reid",
    "openIncidents": 0,
    "overdueTasks": 0,
    "slaAtRisk": 0,
    "taskTotal": 88,
    "statutoryTotal": 42
  },
  {
    "id": "s3",
    "name": "Kirkcudbright Primary",
    "region": "Dumfries & Galloway",
    "address": "Kirkcudbright, Dumfries & Galloway",
    "pupils": 510,
    "buildings": 4,
    "healthScore": 90,
    "status": "healthy",
    "manager": "Morag Sinclair",
    "openIncidents": 0,
    "overdueTasks": 0,
    "slaAtRisk": 0,
    "taskTotal": 86,
    "statutoryTotal": 41
  },
  {
    "id": "s4",
    "name": "Lockerbie Academy",
    "region": "Dumfries & Galloway",
    "address": "Lockerbie, Dumfries & Galloway",
    "pupils": 1180,
    "buildings": 8,
    "healthScore": 61,
    "status": "critical",
    "manager": "Derek Hamilton",
    "openIncidents": 2,
    "overdueTasks": 3,
    "slaAtRisk": 1,
    "taskTotal": 101,
    "statutoryTotal": 54
  },
  {
    "id": "s5",
    "name": "Moffat School",
    "region": "Dumfries & Galloway",
    "address": "Moffat, Dumfries & Galloway",
    "pupils": 620,
    "buildings": 5,
    "healthScore": 77,
    "status": "attention",
    "manager": "Claire Watson",
    "openIncidents": 1,
    "overdueTasks": 1,
    "slaAtRisk": 0,
    "taskTotal": 95,
    "statutoryTotal": 49
  },
  {
    "id": "s6",
    "name": "St Andrew's Primary",
    "region": "Dumfries & Galloway",
    "address": "St Andrew's, Dumfries & Galloway",
    "pupils": 240,
    "buildings": 3,
    "healthScore": 92,
    "status": "healthy",
    "manager": "Paul McKenna",
    "openIncidents": 0,
    "overdueTasks": 0,
    "slaAtRisk": 0,
    "taskTotal": 85,
    "statutoryTotal": 40
  },
  {
    "id": "s7",
    "name": "Stranraer Academy",
    "region": "Dumfries & Galloway",
    "address": "Stranraer, Dumfries & Galloway",
    "pupils": 1340,
    "buildings": 9,
    "healthScore": 58,
    "status": "critical",
    "manager": "Susan Bryce",
    "openIncidents": 3,
    "overdueTasks": 3,
    "slaAtRisk": 1,
    "taskTotal": 102,
    "statutoryTotal": 55
  },
  {
    "id": "s8",
    "name": "Wallacehall Academy",
    "region": "Dumfries & Galloway",
    "address": "Wallacehall, Dumfries & Galloway",
    "pupils": 980,
    "buildings": 7,
    "healthScore": 74,
    "status": "attention",
    "manager": "Gordon Tait",
    "openIncidents": 1,
    "overdueTasks": 1,
    "slaAtRisk": 1,
    "taskTotal": 100,
    "statutoryTotal": 53
  }
];
export const complianceTasks: ComplianceTask[] = [
  {
    "id": "c1",
    "schoolId": "s1",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Overdue by 6 days",
    "daysOffset": -6,
    "urgency": "overdue",
    "responsible": "Amey SSO"
  },
  {
    "id": "c2",
    "schoolId": "s1",
    "category": "Hot Water Supply",
    "title": "Pressure System - Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 3 days",
    "daysOffset": 3,
    "urgency": "soon",
    "responsible": "AGM"
  },
  {
    "id": "c3",
    "schoolId": "s1",
    "category": "Hot Water Supply",
    "title": "Pressure Vessels Insurance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 6 days",
    "daysOffset": 6,
    "urgency": "soon",
    "responsible": "British Engineering"
  },
  {
    "id": "c4",
    "schoolId": "s1",
    "category": "Electrics in Buildings",
    "title": "Lightning Protection",
    "frequency": "Annual",
    "dueLabel": "Due in 25 days",
    "daysOffset": 25,
    "urgency": "ok",
    "responsible": "APS Safety Systems"
  },
  {
    "id": "c5",
    "schoolId": "s1",
    "category": "Power Supply",
    "title": "Earthing",
    "frequency": "Annual",
    "dueLabel": "Due in 61 days",
    "daysOffset": 61,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c6",
    "schoolId": "s1",
    "category": "Power Supply",
    "title": "Armoured Cables and Conduits",
    "frequency": "Annual",
    "dueLabel": "Due in 72 days",
    "daysOffset": 72,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c7",
    "schoolId": "s1",
    "category": "Boilers/Heat Generators",
    "title": "Gas Fired Condensing Boiler",
    "frequency": "Annual",
    "dueLabel": "Due in 55 days",
    "daysOffset": 55,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c8",
    "schoolId": "s1",
    "category": "Control Panels and Controllers",
    "title": "Emergency Stop Buttons",
    "frequency": "Quarterly",
    "dueLabel": "Due in 29 days",
    "daysOffset": 29,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c9",
    "schoolId": "s2",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Due in 4 days",
    "daysOffset": 4,
    "urgency": "soon",
    "responsible": "Amey SSO"
  },
  {
    "id": "c10",
    "schoolId": "s2",
    "category": "Hot Water Supply",
    "title": "Pressure System - Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 11 days",
    "daysOffset": 11,
    "urgency": "soon",
    "responsible": "AGM"
  },
  {
    "id": "c11",
    "schoolId": "s2",
    "category": "Building Fabric",
    "title": "Fire Doors",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 37 days",
    "daysOffset": 37,
    "urgency": "ok",
    "responsible": "Amey"
  },
  {
    "id": "c12",
    "schoolId": "s2",
    "category": "Electrics in Buildings",
    "title": "Lightning Protection",
    "frequency": "Annual",
    "dueLabel": "Due in 37 days",
    "daysOffset": 37,
    "urgency": "ok",
    "responsible": "APS Safety Systems"
  },
  {
    "id": "c13",
    "schoolId": "s2",
    "category": "Building Fabric",
    "title": "Fixed Access Ladders and Stairs",
    "frequency": "Annual",
    "dueLabel": "Due in 81 days",
    "daysOffset": 81,
    "urgency": "ok",
    "responsible": "APS Safety Systems"
  },
  {
    "id": "c14",
    "schoolId": "s2",
    "category": "Control Panels and Controllers",
    "title": "Electrical Services (excluding Electrical Controllers and Pneumatic Relays)",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 91 days",
    "daysOffset": 91,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c15",
    "schoolId": "s2",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Blankets",
    "frequency": "Weekly",
    "dueLabel": "Due in 42 days",
    "daysOffset": 42,
    "urgency": "ok",
    "responsible": "Amey SSO"
  },
  {
    "id": "c16",
    "schoolId": "s3",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Due in 5 days",
    "daysOffset": 5,
    "urgency": "soon",
    "responsible": "Amey SSO"
  },
  {
    "id": "c17",
    "schoolId": "s3",
    "category": "Power Supply",
    "title": "Three Phase Circuits",
    "frequency": "Annual",
    "dueLabel": "Due in 73 days",
    "daysOffset": 73,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c18",
    "schoolId": "s3",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinklers",
    "frequency": "Quarterly",
    "dueLabel": "Due in 83 days",
    "daysOffset": 83,
    "urgency": "ok",
    "responsible": "PFM"
  },
  {
    "id": "c19",
    "schoolId": "s3",
    "category": "Power Supply",
    "title": "Power Distribution Units",
    "frequency": "Annual",
    "dueLabel": "Due in 82 days",
    "daysOffset": 82,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c20",
    "schoolId": "s3",
    "category": "Building Fabric",
    "title": "Roller Shutter Doors",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 48 days",
    "daysOffset": 48,
    "urgency": "ok",
    "responsible": "Ascot"
  },
  {
    "id": "c21",
    "schoolId": "s3",
    "category": "Electrics in Buildings",
    "title": "Timeclock - External Lights",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 72 days",
    "daysOffset": 72,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c22",
    "schoolId": "s4",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Overdue by 2 days",
    "daysOffset": -2,
    "urgency": "overdue",
    "responsible": "Amey SSO"
  },
  {
    "id": "c23",
    "schoolId": "s4",
    "category": "Hot Water Supply",
    "title": "Pressure System - Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Overdue by 2 days",
    "daysOffset": -2,
    "urgency": "overdue",
    "responsible": "AGM"
  },
  {
    "id": "c24",
    "schoolId": "s4",
    "category": "Hot Water Supply",
    "title": "Pressure Vessels Insurance Inspection",
    "frequency": "Annual",
    "dueLabel": "Overdue by 9 days",
    "daysOffset": -9,
    "urgency": "overdue",
    "responsible": "British Engineering"
  },
  {
    "id": "c25",
    "schoolId": "s4",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinkler Systrem - Weekly",
    "frequency": "Weekly",
    "dueLabel": "Due tomorrow",
    "daysOffset": 1,
    "urgency": "critical",
    "responsible": "Amey SSO"
  },
  {
    "id": "c26",
    "schoolId": "s4",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinkler Tanks",
    "frequency": "Annual",
    "dueLabel": "Due in 5 days",
    "daysOffset": 5,
    "urgency": "soon",
    "responsible": "PFM"
  },
  {
    "id": "c27",
    "schoolId": "s4",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Blankets",
    "frequency": "Annual",
    "dueLabel": "Due in 55 days",
    "daysOffset": 55,
    "urgency": "ok",
    "responsible": "PFM"
  },
  {
    "id": "c28",
    "schoolId": "s4",
    "category": "Building Fabric",
    "title": "Building Fabric - Internal",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 57 days",
    "daysOffset": 57,
    "urgency": "ok",
    "responsible": "Amey"
  },
  {
    "id": "c29",
    "schoolId": "s4",
    "category": "Fume and Dust Extract",
    "title": "Fume & Dust Extract Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 47 days",
    "daysOffset": 47,
    "urgency": "ok",
    "responsible": "MEL"
  },
  {
    "id": "c30",
    "schoolId": "s4",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Emergency Assistance Alarm",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 64 days",
    "daysOffset": 64,
    "urgency": "ok",
    "responsible": "DMI"
  },
  {
    "id": "c31",
    "schoolId": "s4",
    "category": "Ductwork",
    "title": "Fire Dampers",
    "frequency": "Annual",
    "dueLabel": "Due in 47 days",
    "daysOffset": 47,
    "urgency": "ok",
    "responsible": "H&V"
  },
  {
    "id": "c32",
    "schoolId": "s5",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Overdue by 1 day",
    "daysOffset": -1,
    "urgency": "overdue",
    "responsible": "Amey SSO"
  },
  {
    "id": "c33",
    "schoolId": "s5",
    "category": "Hot Water Supply",
    "title": "Pressure System - Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 4 days",
    "daysOffset": 4,
    "urgency": "soon",
    "responsible": "AGM"
  },
  {
    "id": "c34",
    "schoolId": "s5",
    "category": "Hot Water Supply",
    "title": "Pressure Vessels Insurance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 12 days",
    "daysOffset": 12,
    "urgency": "soon",
    "responsible": "British Engineering"
  },
  {
    "id": "c35",
    "schoolId": "s5",
    "category": "Power Supply",
    "title": "Fixed Wire Testing",
    "frequency": "Annual",
    "dueLabel": "Due in 76 days",
    "daysOffset": 76,
    "urgency": "ok",
    "responsible": "March Engineering"
  },
  {
    "id": "c36",
    "schoolId": "s5",
    "category": "Building Fabric",
    "title": "Firestopping and Passive Fire Protection",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 65 days",
    "daysOffset": 65,
    "urgency": "ok",
    "responsible": "Amey"
  },
  {
    "id": "c37",
    "schoolId": "s5",
    "category": "Power Supply",
    "title": "Distribution Boards & RCD",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 61 days",
    "daysOffset": 61,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c38",
    "schoolId": "s5",
    "category": "Power Supply",
    "title": "Main Switch Panel at Supply Intake",
    "frequency": "Annual",
    "dueLabel": "Due in 76 days",
    "daysOffset": 76,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c39",
    "schoolId": "s5",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinkler Tanks",
    "frequency": "Annual",
    "dueLabel": "Due in 86 days",
    "daysOffset": 86,
    "urgency": "ok",
    "responsible": "PFM"
  },
  {
    "id": "c40",
    "schoolId": "s6",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Due in 14 days",
    "daysOffset": 14,
    "urgency": "soon",
    "responsible": "Amey SSO"
  },
  {
    "id": "c41",
    "schoolId": "s6",
    "category": "Building Fabric",
    "title": "Building Fabric - External",
    "frequency": "Annual",
    "dueLabel": "Due in 70 days",
    "daysOffset": 70,
    "urgency": "ok",
    "responsible": "Amey"
  },
  {
    "id": "c42",
    "schoolId": "s6",
    "category": "Pipework Systems",
    "title": "General",
    "frequency": "Annual",
    "dueLabel": "Due in 84 days",
    "daysOffset": 84,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c43",
    "schoolId": "s6",
    "category": "Hot Water Supply",
    "title": "Expansion Vessels",
    "frequency": "Quarterly",
    "dueLabel": "Due in 72 days",
    "daysOffset": 72,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c44",
    "schoolId": "s6",
    "category": "Building Fabric",
    "title": "Windows Internal and External",
    "frequency": "Annual",
    "dueLabel": "Due in 52 days",
    "daysOffset": 52,
    "urgency": "ok",
    "responsible": "Amey"
  },
  {
    "id": "c45",
    "schoolId": "s6",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinkler Tanks",
    "frequency": "Annual",
    "dueLabel": "Due in 39 days",
    "daysOffset": 39,
    "urgency": "ok",
    "responsible": "PFM"
  },
  {
    "id": "c46",
    "schoolId": "s7",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Overdue by 2 days",
    "daysOffset": -2,
    "urgency": "overdue",
    "responsible": "Amey SSO"
  },
  {
    "id": "c47",
    "schoolId": "s7",
    "category": "Hot Water Supply",
    "title": "Pressure System - Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Overdue by 7 days",
    "daysOffset": -7,
    "urgency": "overdue",
    "responsible": "AGM"
  },
  {
    "id": "c48",
    "schoolId": "s7",
    "category": "Hot Water Supply",
    "title": "Pressure Vessels Insurance Inspection",
    "frequency": "Annual",
    "dueLabel": "Overdue by 3 days",
    "daysOffset": -3,
    "urgency": "overdue",
    "responsible": "British Engineering"
  },
  {
    "id": "c49",
    "schoolId": "s7",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinkler Systrem - Weekly",
    "frequency": "Weekly",
    "dueLabel": "Due tomorrow",
    "daysOffset": 1,
    "urgency": "critical",
    "responsible": "Amey SSO"
  },
  {
    "id": "c50",
    "schoolId": "s7",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinkler Tanks",
    "frequency": "Annual",
    "dueLabel": "Due in 10 days",
    "daysOffset": 10,
    "urgency": "soon",
    "responsible": "PFM"
  },
  {
    "id": "c51",
    "schoolId": "s7",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinklers",
    "frequency": "Quarterly",
    "dueLabel": "Due in 5 days",
    "daysOffset": 5,
    "urgency": "soon",
    "responsible": "PFM"
  },
  {
    "id": "c52",
    "schoolId": "s7",
    "category": "Air Conditioning",
    "title": "Air Conditioning",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 27 days",
    "daysOffset": 27,
    "urgency": "ok",
    "responsible": "Johnson Controls"
  },
  {
    "id": "c53",
    "schoolId": "s7",
    "category": "Patient Hoists and Elevated Beds",
    "title": "Patient Hoist Maintenance",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 54 days",
    "daysOffset": 54,
    "urgency": "ok",
    "responsible": "W Munro"
  },
  {
    "id": "c54",
    "schoolId": "s7",
    "category": "Control Panels and Controllers",
    "title": "Lamps, Meters, Alarms etc",
    "frequency": "Annual",
    "dueLabel": "Due in 69 days",
    "daysOffset": 69,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c55",
    "schoolId": "s7",
    "category": "Swimming Pools",
    "title": "Swimming Pools - Water Quality",
    "frequency": "Monthly",
    "dueLabel": "Due in 62 days",
    "daysOffset": 62,
    "urgency": "ok",
    "responsible": "Caledonian"
  },
  {
    "id": "c56",
    "schoolId": "s7",
    "category": "Power Supply",
    "title": "Distribution Boards & RCD",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 48 days",
    "daysOffset": 48,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c57",
    "schoolId": "s8",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Fire Hydrants",
    "frequency": "Annual",
    "dueLabel": "Overdue by 6 days",
    "daysOffset": -6,
    "urgency": "overdue",
    "responsible": "Amey SSO"
  },
  {
    "id": "c58",
    "schoolId": "s8",
    "category": "Hot Water Supply",
    "title": "Pressure System - Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 3 days",
    "daysOffset": 3,
    "urgency": "soon",
    "responsible": "AGM"
  },
  {
    "id": "c59",
    "schoolId": "s8",
    "category": "Hot Water Supply",
    "title": "Pressure Vessels Insurance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 10 days",
    "daysOffset": 10,
    "urgency": "soon",
    "responsible": "British Engineering"
  },
  {
    "id": "c60",
    "schoolId": "s8",
    "category": "Fire Alarm/Protection/Security Systems",
    "title": "Sprinkler Systrem - Weekly",
    "frequency": "Weekly",
    "dueLabel": "Due in 8 days",
    "daysOffset": 8,
    "urgency": "soon",
    "responsible": "Amey SSO"
  },
  {
    "id": "c61",
    "schoolId": "s8",
    "category": "Fume and Dust Extract",
    "title": "Fume & Dust Extract Maintenance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 44 days",
    "daysOffset": 44,
    "urgency": "ok",
    "responsible": "MEL"
  },
  {
    "id": "c62",
    "schoolId": "s8",
    "category": "Water Treatment",
    "title": "Cold Water Storage Tanks",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 83 days",
    "daysOffset": 83,
    "urgency": "ok",
    "responsible": "SMS"
  },
  {
    "id": "c63",
    "schoolId": "s8",
    "category": "Building Fabric",
    "title": "Roller Shutter Insurance Inspection",
    "frequency": "Annual",
    "dueLabel": "Due in 48 days",
    "daysOffset": 48,
    "urgency": "ok",
    "responsible": "British Engineering"
  },
  {
    "id": "c64",
    "schoolId": "s8",
    "category": "Grilles and Diffusers",
    "title": "Grilles and Diffusers",
    "frequency": "Annual",
    "dueLabel": "Due in 66 days",
    "daysOffset": 66,
    "urgency": "ok",
    "responsible": "March"
  },
  {
    "id": "c65",
    "schoolId": "s8",
    "category": "Patient Hoists and Elevated Beds",
    "title": "Patient Hoist Maintenance",
    "frequency": "6-Monthly",
    "dueLabel": "Due in 54 days",
    "daysOffset": 54,
    "urgency": "ok",
    "responsible": "W Munro"
  }
];
export const contractorVisits: ContractorVisit[] = [
  {
    "id": "v1",
    "schoolId": "s7",
    "contractor": "APS Safety Systems",
    "trade": "Fire Safety",
    "purpose": "Fire alarm installation service & test",
    "whenLabel": "Tomorrow · 09:00",
    "hoursOffset": 18,
    "notified": false,
    "status": "scheduled"
  },
  {
    "id": "v2",
    "schoolId": "s4",
    "contractor": "British Engineering",
    "trade": "Statutory Inspection",
    "purpose": "Pressure system insurance inspection",
    "whenLabel": "Today · 13:30",
    "hoursOffset": 3,
    "notified": true,
    "status": "scheduled"
  },
  {
    "id": "v3",
    "schoolId": "s7",
    "contractor": "Thyssenkrupp",
    "trade": "Lifts",
    "purpose": "Passenger lift LOLER examination",
    "whenLabel": "Thu · 08:30",
    "hoursOffset": 60,
    "notified": false,
    "status": "scheduled"
  },
  {
    "id": "v4",
    "schoolId": "s8",
    "contractor": "Halliday Lighting",
    "trade": "Electrical",
    "purpose": "Emergency lighting annual discharge test",
    "whenLabel": "Fri · 10:00",
    "hoursOffset": 84,
    "notified": true,
    "status": "scheduled"
  },
  {
    "id": "v5",
    "schoolId": "s5",
    "contractor": "SMS",
    "trade": "Water Hygiene",
    "purpose": "Legionella monthly monitoring & temps",
    "whenLabel": "Next Mon · 09:30",
    "hoursOffset": 140,
    "notified": true,
    "status": "scheduled"
  },
  {
    "id": "v6",
    "schoolId": "s1",
    "contractor": "Johnson Controls",
    "trade": "Controls/BMS",
    "purpose": "BMS controls planned maintenance",
    "whenLabel": "Next Tue · 11:00",
    "hoursOffset": 160,
    "notified": true,
    "status": "scheduled"
  }
];
export const tickets: Ticket[] = [
  {
    "id": "HD-5012",
    "schoolId": "s7",
    "title": "No heating — Maths & Science block",
    "priority": "P1",
    "category": "Boilers/Heat Generators",
    "raisedLabel": "Raised 20h ago",
    "slaLabel": "SLA breach in 4h",
    "slaHoursLeft": 4,
    "status": "in-progress",
    "assignedTo": "British Engineering"
  },
  {
    "id": "HD-4998",
    "schoolId": "s4",
    "title": "Fire alarm panel fault — repeated",
    "priority": "P1",
    "category": "Fire Alarm/Protection/Security Systems",
    "raisedLabel": "Raised 2d ago",
    "slaLabel": "SLA breached 7h ago",
    "slaHoursLeft": -7,
    "status": "awaiting-parts",
    "assignedTo": "APS Safety Systems"
  },
  {
    "id": "HD-5020",
    "schoolId": "s8",
    "title": "Lift out of service — main building",
    "priority": "P2",
    "category": "Lifts",
    "raisedLabel": "Raised 1d ago",
    "slaLabel": "SLA in 9h",
    "slaHoursLeft": 9,
    "status": "open",
    "assignedTo": "Thyssenkrupp"
  },
  {
    "id": "HD-5031",
    "schoolId": "s7",
    "title": "Water leak — changing rooms",
    "priority": "P2",
    "category": "Sanitary/Waste Water Plumbing",
    "raisedLabel": "Raised 6h ago",
    "slaLabel": "SLA in 2d",
    "slaHoursLeft": 48,
    "status": "open",
    "assignedTo": "March Engineering"
  },
  {
    "id": "HD-5004",
    "schoolId": "s5",
    "title": "Flickering lighting — Block B corridor",
    "priority": "P3",
    "category": "Electrics in Buildings",
    "raisedLabel": "Raised 2d ago",
    "slaLabel": "SLA in 3d",
    "slaHoursLeft": 72,
    "status": "open",
    "assignedTo": "DMI"
  },
  {
    "id": "HD-5040",
    "schoolId": "s4",
    "title": "Faulty fire door closer — Sports Hall",
    "priority": "P3",
    "category": "Building Fabric",
    "raisedLabel": "Raised 9h ago",
    "slaLabel": "SLA in 28h",
    "slaHoursLeft": 28,
    "status": "open",
    "assignedTo": "Amey"
  }
];
export const alerts: Alert[] = [
  {
    "id": "a1",
    "type": "contractor",
    "severity": "warning",
    "title": "Unannounced contractor visit tomorrow",
    "detail": "APS Safety Systems is booked for a fire alarm service at Stranraer Academy at 09:00 — the site team has NOT been notified.",
    "schoolId": "s7",
    "timeLabel": "3m ago"
  },
  {
    "id": "a2",
    "type": "sla",
    "severity": "critical",
    "title": "P1 SLA breach imminent",
    "detail": "Ticket HD-5012 (no heating, Maths & Science block) breaches its SLA in 4 hours. Recommend escalating to British Engineering now.",
    "schoolId": "s7",
    "timeLabel": "12m ago"
  },
  {
    "id": "a3",
    "type": "escalation",
    "severity": "critical",
    "title": "Repeat fire alarm fault",
    "detail": "HD-4998 at Lockerbie Academy is the 3rd fire alarm panel fault in 60 days and has already breached SLA — recommend a permanent engineering fix.",
    "schoolId": "s4",
    "timeLabel": "1h ago"
  },
  {
    "id": "a4",
    "type": "compliance",
    "severity": "critical",
    "title": "Statutory compliance overdue",
    "detail": "Stranraer Academy has overdue statutory PPM tasks (fire/water). Overdue statutory work is a legal and insurance risk.",
    "schoolId": "s7",
    "timeLabel": "2h ago"
  },
  {
    "id": "a5",
    "type": "contractor",
    "severity": "warning",
    "title": "LOLER lift exam — no site notice",
    "detail": "Thyssenkrupp arrives Thursday 08:30 at Stranraer Academy for a passenger-lift LOLER exam. Site team not yet notified.",
    "schoolId": "s7",
    "timeLabel": "4h ago"
  },
  {
    "id": "a6",
    "type": "incident",
    "severity": "info",
    "title": "Insurance inspection today",
    "detail": "British Engineering arrives at Lockerbie Academy at 13:30 for a pressure-system insurance inspection. Site team notified.",
    "schoolId": "s4",
    "timeLabel": "5h ago"
  }
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
  lines.push("\nSCHOOLS:");
  for (const s of schools) {
    lines.push(`- ${s.name} (${s.region}) — health ${s.healthScore}% [${s.status}], manager ${s.manager}, ${s.taskTotal} PPM tasks (${s.statutoryTotal} statutory), ${s.openIncidents} open incidents, ${s.overdueTasks} overdue.`);
  }
  lines.push("\nNOTABLE / OVERDUE COMPLIANCE TASKS:");
  for (const t of complianceTasks.filter((t) => t.urgency !== "ok")) {
    lines.push(`- [${schoolName(t.schoolId)}] ${t.title} (${t.category}, ${t.frequency}) — ${t.dueLabel}. Responsible: ${t.responsible}.`);
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
