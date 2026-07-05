export interface ExamRow {
  id: string;
  client: string;
  state: string;
  license: string;
  examType: string;
  status: string;
  appStatus: string;
  scheduledDate: string;
  deadline: string;
  vendor: string;
  owner: string;
  ownerName: string;
  preApproval: boolean;
  prepStatus: string;
  risk: "Low" | "Medium" | "High";
  clientResponse: "Responsive" | "Slow" | "Not Responding";
  contact: string;
  email: string;
  phone: string;
  applicant: string;
  examCost: string;
  retestCost: string;
  confirmation: string;
  location: string;
  passingScore: string;
  timeline: { date: string; text: string }[];
  nextSteps: string[];
  notes: { author: string; date: string; text: string }[];
}

export const MOCK_EXAM_QUEUE: ExamRow[] = [
  {
    id: "1",
    client: "Blue Ridge Partners",
    state: "TX",
    license: "Asbestos Abatement",
    examType: "Project Management",
    status: "Prep In Progress",
    appStatus: "Waiting on Exam",
    scheduledDate: "May 28, 2024",
    deadline: "Jun 05, 2024",
    vendor: "PSI",
    owner: "RT",
    ownerName: "Rose Taylor",
    preApproval: false,
    prepStatus: "In Progress",
    risk: "Medium",
    clientResponse: "Responsive",
    contact: "Marcus Bell",
    email: "m.bell@blueridgepartners.com",
    phone: "(512) 555-2210",
    applicant: "Marcus Bell",
    examCost: "$249",
    retestCost: "$249",
    confirmation: "—",
    location: "Austin, TX Test Center",
    passingScore: "70%",
    timeline: [
      { date: "May 10, 2024", text: "Invoice paid — record created" },
      { date: "May 15, 2024", text: "Prep materials sent" },
      { date: "May 28, 2024", text: "Target exam date" },
    ],
    nextSteps: ["Confirm prep completion", "Request date preferences"],
    notes: [
      { author: "Rose Taylor", date: "May 15, 2024", text: "Client engaged, prep underway." },
    ],
  },
  {
    id: "2",
    client: "Summit Builders LLC",
    state: "FL",
    license: "General Contractor",
    examType: "Business & Finance",
    status: "Waiting on Exam Date",
    appStatus: "In Progress",
    scheduledDate: "May 30, 2024",
    deadline: "Jun 08, 2024",
    vendor: "Pearson VUE",
    owner: "LK",
    ownerName: "Skylar Kent",
    preApproval: false,
    prepStatus: "Delivered",
    risk: "Low",
    clientResponse: "Slow",
    contact: "Danielle Ortiz",
    email: "d.ortiz@summitbuilders.com",
    phone: "(305) 555-8842",
    applicant: "Danielle Ortiz",
    examCost: "$135",
    retestCost: "$135",
    confirmation: "—",
    location: "Miami, FL Test Center",
    passingScore: "75%",
    timeline: [
      { date: "May 12, 2024", text: "Invoice paid — record created" },
      { date: "May 20, 2024", text: "Date preference request sent" },
    ],
    nextSteps: ["Follow up on date preferences", "Book exam once confirmed"],
    notes: [
      { author: "Skylar Kent", date: "May 21, 2024", text: "Awaiting client date reply." },
    ],
  },
  {
    id: "3",
    client: "Pinnacle Mechanical",
    state: "GA",
    license: "Mechanical Contractor",
    examType: "Mechanical Trade",
    status: "Scheduled",
    appStatus: "Approved",
    scheduledDate: "Jun 01, 2024",
    deadline: "Jun 10, 2024",
    vendor: "PSI",
    owner: "PS",
    ownerName: "Priya Shah",
    preApproval: true,
    prepStatus: "Delivered",
    risk: "Low",
    clientResponse: "Responsive",
    contact: "Austin Reynolds",
    email: "a.reynolds@pinnaclemech.com",
    phone: "(404) 555-4671",
    applicant: "Austin Reynolds",
    examCost: "$189",
    retestCost: "$189",
    confirmation: "78634122",
    location: "Atlanta, GA Test Center",
    passingScore: "70%",
    timeline: [
      { date: "May 12, 2024", text: "Exam scheduled" },
      { date: "May 18, 2024", text: "Prep docs submitted" },
      { date: "May 24, 2024", text: "Payment confirmed" },
      { date: "Jun 01, 2024", text: "Exam day" },
    ],
    nextSteps: ["Confirm exam location", "Send day-before reminder", "Post-exam follow-up"],
    notes: [
      { author: "Priya Shah", date: "May 24, 2024", text: "All set. Confirmation received from PSI." },
    ],
  },
  {
    id: "4",
    client: "Lone Star Renovations",
    state: "TX",
    license: "Residential Builder",
    examType: "Contractor Law",
    status: "Waiting on Prep Docs",
    appStatus: "Approved",
    scheduledDate: "Jun 02, 2024",
    deadline: "Jun 12, 2024",
    vendor: "PSI",
    owner: "TE",
    ownerName: "Emily Tran",
    preApproval: false,
    prepStatus: "Not Delivered",
    risk: "Medium",
    clientResponse: "Slow",
    contact: "Rachel Kim",
    email: "r.kim@lonestarreno.com",
    phone: "(214) 555-1190",
    applicant: "Rachel Kim",
    examCost: "$110",
    retestCost: "$110",
    confirmation: "—",
    location: "Dallas, TX Test Center",
    passingScore: "70%",
    timeline: [
      { date: "May 16, 2024", text: "Invoice paid — record created" },
      { date: "May 22, 2024", text: "Prep docs requested" },
    ],
    nextSteps: ["Chase prep documents", "Deliver prep once received"],
    notes: [
      { author: "Emily Tran", date: "May 23, 2024", text: "Prep docs still outstanding." },
    ],
  },
  {
    id: "5",
    client: "Coastal Plumbing Pros",
    state: "SC",
    license: "Plumbing Contractor",
    examType: "Plumbing Trade",
    status: "At Risk",
    appStatus: "In Review",
    scheduledDate: "Not Scheduled",
    deadline: "May 19, 2024",
    vendor: "Pearson VUE",
    owner: "EL",
    ownerName: "Alyssa Lopez",
    preApproval: false,
    prepStatus: "Delivered",
    risk: "High",
    clientResponse: "Not Responding",
    contact: "Trevor Nguyen",
    email: "t.nguyen@coastalplumbing.com",
    phone: "(843) 555-3320",
    applicant: "Trevor Nguyen",
    examCost: "$142",
    retestCost: "$142",
    confirmation: "—",
    location: "Charleston, SC Test Center",
    passingScore: "72%",
    timeline: [
      { date: "May 02, 2024", text: "Invoice paid — record created" },
      { date: "May 09, 2024", text: "Reminder sent — no response" },
    ],
    nextSteps: ["Escalate — deadline passed", "Attempt phone contact"],
    notes: [
      { author: "Alyssa Lopez", date: "May 15, 2024", text: "No client contact after 3 attempts. Flagged urgent." },
    ],
  },
  {
    id: "6",
    client: "Imperial Industrial",
    state: "OH",
    license: "HVAC Contractor",
    examType: "HVAC Trade",
    status: "Scheduled",
    appStatus: "Approved",
    scheduledDate: "May 24, 2024",
    deadline: "Jun 01, 2024",
    vendor: "PSI",
    owner: "ME",
    ownerName: "Carmen Ellis",
    preApproval: true,
    prepStatus: "Delivered",
    risk: "Low",
    clientResponse: "Responsive",
    contact: "Gwen Foster",
    email: "g.foster@imperialind.com",
    phone: "(614) 555-7781",
    applicant: "Gwen Foster",
    examCost: "$175",
    retestCost: "$175",
    confirmation: "55129034",
    location: "Columbus, OH Test Center",
    passingScore: "70%",
    timeline: [
      { date: "May 05, 2024", text: "Board approval received" },
      { date: "May 10, 2024", text: "Exam scheduled" },
      { date: "May 24, 2024", text: "Exam day" },
    ],
    nextSteps: ["Await pass sheet", "Update Application Processing"],
    notes: [
      { author: "Carmen Ellis", date: "May 24, 2024", text: "Exam completed. Awaiting pass sheet upload." },
    ],
  },
  {
    id: "7",
    client: "Evergreen Roofing",
    state: "TN",
    license: "Roofing Contractor",
    examType: "Trade Knowledge",
    status: "Prep In Progress",
    appStatus: "Waiting on Docs",
    scheduledDate: "May 26, 2024",
    deadline: "Jun 04, 2024",
    vendor: "PSI",
    owner: "KC",
    ownerName: "Christin Park",
    preApproval: false,
    prepStatus: "In Progress",
    risk: "Medium",
    clientResponse: "Responsive",
    contact: "Devon Ward",
    email: "d.ward@evergreenroof.com",
    phone: "(615) 555-6602",
    applicant: "Devon Ward",
    examCost: "$128",
    retestCost: "$128",
    confirmation: "—",
    location: "Nashville, TN Test Center",
    passingScore: "70%",
    timeline: [
      { date: "May 14, 2024", text: "Invoice paid — record created" },
      { date: "May 19, 2024", text: "Prep materials sent" },
    ],
    nextSteps: ["Collect remaining docs", "Confirm exam readiness"],
    notes: [
      { author: "Christin Park", date: "May 20, 2024", text: "Waiting on supporting documents." },
    ],
  },
  {
    id: "8",
    client: "Clearview Development",
    state: "NC",
    license: "General Contractor",
    examType: "Business & Finance",
    status: "Waiting on Exam Date",
    appStatus: "In Progress",
    scheduledDate: "Jun 06, 2024",
    deadline: "Jun 16, 2024",
    vendor: "Pearson VUE",
    owner: "TE",
    ownerName: "Emily Tran",
    preApproval: false,
    prepStatus: "Delivered",
    risk: "Low",
    clientResponse: "Slow",
    contact: "Sasha Miller",
    email: "s.miller@clearviewdev.com",
    phone: "(919) 555-4408",
    applicant: "Sasha Miller",
    examCost: "$135",
    retestCost: "$135",
    confirmation: "—",
    location: "Raleigh, NC Test Center",
    passingScore: "75%",
    timeline: [
      { date: "May 18, 2024", text: "Invoice paid — record created" },
      { date: "May 25, 2024", text: "Date preference request sent" },
    ],
    nextSteps: ["Follow up on date preferences", "Book exam once confirmed"],
    notes: [
      { author: "Emily Tran", date: "May 26, 2024", text: "Client reviewing available dates." },
    ],
  },
];

export const MOCK_RECORD_DETAIL = {
  clientName: "Pinnacle Mechanical",
  licenseName: "Mechanical Contractor License",
  state: "Georgia",
  status: "Scheduled",
  overview: {
    contact: "Austin Reynolds",
    email: "a.reynolds@pinnaclemech.com",
    phone: "(404) 555-4671",
    examStatus: "Scheduled",
    dateTime: "Jun 01, 2024, 9:00 AM EDT",
    exam: "Mechanical Trade",
    vendor: "PSI",
    confirmation: "78634122",
    appStatus: "Approved",
    timeline: [
      { date: "May 12, 2024", text: "Exam scheduled" },
      { date: "May 18, 2024", text: "Prep docs submitted" },
      { date: "May 24, 2024", text: "Payment confirmed" },
      { date: "Jun 01, 2024", text: "Exam day" },
    ],
    nextSteps: ["Confirm exam location", "Send day-before reminder", "Post-exam follow-up"],
  },
};

export const EXAM_STATUSES = [
  "New / Invoice Paid",
  "Needs Review",
  "Pre-Approval Required",
  "Waiting for Board Approval",
  "Ready to Schedule",
  "Waiting on Client Date Preference",
  "Scheduled",
  "Exam Coming Up",
  "Waiting on Pass Sheet",
  "Passed",
  "Failed",
  "Retake Needed",
  "Complete",
  "At Risk",
  "Canceled / No Show",
];

export const APP_STATUSES = [
  "Not Started",
  "Waiting on Exam",
  "Waiting on Pre-Approval",
  "Ready for Application Processing",
  "Application Processing Updated",
  "Blocked",
  "Complete",
];

export const STATES = ["TX", "FL", "GA", "SC", "OH", "TN", "NC"];
export const VENDORS = ["PSI", "Pearson VUE", "Prometric"];
export const OWNERS = ["Skylar", "Carmen", "Rose", "Emily", "Alyssa", "Christin"];

export interface EmailDraft {
  id: string;
  client: string;
  record: string;
  type: string;
  status: "Needs Review" | "Approved" | "Ready to Send" | "Sent Placeholder";
  updated: string;
  preview: string;
}

export const MOCK_EMAIL_DRAFTS: EmailDraft[] = [
  { id: "e1", client: "Blue Ridge Partners", record: "Asbestos Abatement", type: "Welcome / Scheduling Started", status: "Needs Review", updated: "2h ago", preview: "Welcome to ExamManagerOS — we've begun scheduling your exam..." },
  { id: "e2", client: "Summit Builders LLC", record: "General Contractor", type: "Date Preference Request", status: "Approved", updated: "4h ago", preview: "Please share your preferred testing dates so we can book..." },
  { id: "e3", client: "Pinnacle Mechanical", record: "Mechanical Contractor", type: "Scheduled Exam Confirmation", status: "Ready to Send", updated: "6h ago", preview: "Your Mechanical Trade exam is confirmed for Jun 01, 2024..." },
  { id: "e4", client: "Lone Star Renovations", record: "Residential Builder", type: "Missing Response Follow-up", status: "Needs Review", updated: "1d ago", preview: "We haven't received your prep documents yet — a quick note..." },
  { id: "e5", client: "Coastal Plumbing Pros", record: "Plumbing Contractor", type: "Deadline Alert", status: "Approved", updated: "1d ago", preview: "Your exam deadline has passed. Please contact us urgently..." },
  { id: "e6", client: "Imperial Industrial", record: "HVAC Contractor", type: "Pass Sheet Request", status: "Sent Placeholder", updated: "2d ago", preview: "Please upload your exam pass sheet through the portal..." },
  { id: "e7", client: "Evergreen Roofing", record: "Roofing Contractor", type: "Exam Prep Delivery", status: "Approved", updated: "2d ago", preview: "Your exam prep materials are attached and ready..." },
  { id: "e8", client: "Clearview Development", record: "General Contractor", type: "Reminder", status: "Needs Review", updated: "3d ago", preview: "A friendly reminder to confirm your preferred exam dates..." },
];

export const DRAFT_TYPES = [
  "Welcome / Exam Scheduling Started",
  "Exam Information",
  "Exam Prep Delivery",
  "Date Preference Request",
  "Scheduled Exam Confirmation",
  "Reminder",
  "Deadline Alert",
  "Missing Response Follow-up",
  "Pass Sheet Request",
  "Failed Exam / Retake Next Steps",
];

export interface DocItem {
  name: string;
  status: "Uploaded" | "Missing" | "Pending Review";
  required: boolean;
  date?: string;
}

export const MOCK_DOC_CLIENTS = [
  {
    client: "Pinnacle Mechanical",
    folder: "PM-GA-2024-118",
    docs: [
      { name: "Approval Letter", status: "Uploaded", required: true, date: "May 05, 2024" },
      { name: "Exam Confirmation", status: "Uploaded", required: true, date: "May 12, 2024" },
      { name: "Prep Completion", status: "Uploaded", required: false, date: "May 18, 2024" },
      { name: "Pass Sheet", status: "Pending Review", required: true, date: "Jun 01, 2024" },
    ] as DocItem[],
  },
  {
    client: "Coastal Plumbing Pros",
    folder: "CP-SC-2024-092",
    docs: [
      { name: "Application Form", status: "Uploaded", required: true, date: "May 02, 2024" },
      { name: "Exam Confirmation", status: "Missing", required: true },
      { name: "Pass Sheet", status: "Missing", required: true },
    ] as DocItem[],
  },
  {
    client: "Imperial Industrial",
    folder: "II-OH-2024-076",
    docs: [
      { name: "Approval Letter", status: "Uploaded", required: true, date: "May 05, 2024" },
      { name: "Exam Confirmation", status: "Uploaded", required: true, date: "May 10, 2024" },
      { name: "Pass Sheet", status: "Missing", required: true },
    ] as DocItem[],
  },
];

export interface AuditRule {
  license: string;
  state: string;
  requiredExams: string;
  preApproval: string;
  deadline: string;
  vendor: string;
  cost: string;
  passingScore: string;
  retestRule: string;
  waitingPeriod: string;
  passSheet: string;
}

export const MOCK_AUDIT_RULES: AuditRule[] = [
  { license: "Mechanical Contractor", state: "GA", requiredExams: "Mechanical Trade + Business & Law", preApproval: "Required", deadline: "90 days from approval", vendor: "PSI", cost: "$189", passingScore: "70%", retestRule: "Unlimited retakes", waitingPeriod: "24 hours", passSheet: "Required" },
  { license: "General Contractor", state: "FL", requiredExams: "Business & Finance + Trade", preApproval: "Not Required", deadline: "1 year from purchase", vendor: "Pearson VUE", cost: "$135", passingScore: "75%", retestRule: "3 attempts, then wait", waitingPeriod: "30 days after 3rd fail", passSheet: "Required" },
  { license: "Plumbing Contractor", state: "SC", requiredExams: "Plumbing Trade", preApproval: "Not Required", deadline: "6 months from purchase", vendor: "Pearson VUE", cost: "$142", passingScore: "72%", retestRule: "Unlimited retakes", waitingPeriod: "14 days", passSheet: "Required" },
  { license: "HVAC Contractor", state: "OH", requiredExams: "HVAC Trade + Law", preApproval: "Required", deadline: "60 days from approval", vendor: "PSI", cost: "$175", passingScore: "70%", retestRule: "Unlimited retakes", waitingPeriod: "24 hours", passSheet: "Required" },
];

export const MOCK_ANALYTICS = {
  monthly: [
    { month: "Jan", scheduled: 42, completed: 38, passed: 34 },
    { month: "Feb", scheduled: 48, completed: 45, passed: 40 },
    { month: "Mar", scheduled: 55, completed: 51, passed: 47 },
    { month: "Apr", scheduled: 61, completed: 58, passed: 52 },
    { month: "May", scheduled: 68, completed: 62, passed: 57 },
    { month: "Jun", scheduled: 54, completed: 40, passed: 37 },
  ],
  vendorSplit: [
    { name: "PSI", value: 58 },
    { name: "Pearson VUE", value: 32 },
    { name: "Prometric", value: 10 },
  ],
  schedulerWorkload: [
    { name: "Skylar", load: 24 },
    { name: "Carmen", load: 19 },
    { name: "Rose", load: 12 },
    { name: "Emily", load: 21 },
    { name: "Alyssa", load: 16 },
    { name: "Christin", load: 14 },
  ],
  passFail: [
    { name: "Passed", value: 84 },
    { name: "Failed", value: 11 },
    { name: "Retake", value: 5 },
  ],
};
