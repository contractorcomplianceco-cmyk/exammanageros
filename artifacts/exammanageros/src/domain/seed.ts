import type {
  DomainState, Client, Candidate, ExamRecord, ExamRequirement, ExamProvider,
  RelatedApplication, TranscriptRecord, StudyPrepRecord, Task, Escalation,
  ClientUpdateDraft, AuditEvent, DocumentAttachmentPlaceholder,
} from "./types";

const NOW = "2026-07-05T09:00:00.000Z";
const d = (s: string) => `2026-${s}T00:00:00.000Z`;

const providers: ExamProvider[] = [
  { id: "prov-nascla", providerName: "NASCLA", website: "nascla.org", schedulingMethod: "PSI proctored", transcriptMethod: "Official transcript via NASCLA / PSI", supportNotes: "Accredited exam recognized by VA, MD, OH and others." },
  { id: "prov-psi", providerName: "PSI", website: "psiexams.com", schedulingMethod: "Online / test center", transcriptMethod: "Score report + official transcript request", supportNotes: "Primary provider for most state trade exams." },
  { id: "prov-pearson", providerName: "Pearson VUE", website: "pearsonvue.com", schedulingMethod: "Test center", transcriptMethod: "Score report portal", supportNotes: "Used for select state boards." },
  { id: "prov-prometric", providerName: "Prometric", website: "prometric.com", schedulingMethod: "Test center", transcriptMethod: "Official transcript by mail", supportNotes: "Slower transcript turnaround." },
];

const clients: Client[] = [
  { id: "cli-1", name: "Pinnacle Mechanical", entityName: "Pinnacle Mechanical LLC", accountManager: "Rose", contactName: "Austin Reynolds", contactEmail: "a.reynolds@pinnaclemech.com", riskLevel: "High", createdAt: d("01-04"), updatedAt: NOW },
  { id: "cli-2", name: "Blue Ridge Partners", entityName: "Blue Ridge Partners Inc", accountManager: "Carmen", contactName: "Denise Falk", contactEmail: "denise@blueridgepartners.com", riskLevel: "Low", createdAt: d("01-12"), updatedAt: NOW },
  { id: "cli-3", name: "Summit Builders", entityName: "Summit Builders LLC", accountManager: "Emily", contactName: "Marcus Vance", contactEmail: "mvance@summitbuilders.com", riskLevel: "Medium", createdAt: d("02-02"), updatedAt: NOW },
  { id: "cli-4", name: "Coastal Plumbing Pros", entityName: "Coastal Plumbing Pros LLC", accountManager: "Skylar", contactName: "Renee Ortiz", contactEmail: "renee@coastalplumbing.com", riskLevel: "Low", createdAt: d("02-18"), updatedAt: NOW },
  { id: "cli-5", name: "Imperial Electric", entityName: "Imperial Electric Co", accountManager: "Alyssa", contactName: "Grant Whitaker", contactEmail: "grant@imperialelectric.com", riskLevel: "Medium", createdAt: d("03-01"), updatedAt: NOW },
  { id: "cli-6", name: "Cornerstone Roofing", entityName: "Cornerstone Roofing LLC", accountManager: "Christin", contactName: "Paula Nguyen", contactEmail: "paula@cornerstoneroof.com", riskLevel: "High", createdAt: d("03-14"), updatedAt: NOW },
  { id: "cli-7", name: "Evergreen HVAC", entityName: "Evergreen HVAC Services", accountManager: "Carmen", contactName: "Tyler Boone", contactEmail: "tyler@evergreenhvac.com", riskLevel: "Low", createdAt: d("04-05"), updatedAt: NOW },
  { id: "cli-8", name: "Liberty Concrete", entityName: "Liberty Concrete Group", accountManager: "Rose", contactName: "Sonia Reyes", contactEmail: "sonia@libertyconcrete.com", riskLevel: "Medium", createdAt: d("04-22"), updatedAt: NOW },
];

const candidates: Candidate[] = [
  { id: "cand-1", clientId: "cli-1", fullName: "Austin Reynolds", email: "a.reynolds@pinnaclemech.com", phone: "(404) 555-4671", role: "Owner / Qualifier", qualifierType: "Primary qualifier", statesAssociated: ["VA", "MD", "OH", "GA"], notes: "Pursuing multi-state reciprocity via NASCLA.", createdAt: d("01-04"), updatedAt: NOW },
  { id: "cand-2", clientId: "cli-2", fullName: "Denise Falk", email: "denise@blueridgepartners.com", phone: "(276) 555-2210", role: "Qualifier", qualifierType: "Employee qualifier", statesAssociated: ["VA"], notes: "", createdAt: d("01-12"), updatedAt: NOW },
  { id: "cand-3", clientId: "cli-3", fullName: "Marcus Vance", email: "mvance@summitbuilders.com", phone: "(813) 555-9033", role: "Owner", qualifierType: "Primary qualifier", statesAssociated: ["FL"], notes: "Readiness not yet confirmed.", createdAt: d("02-02"), updatedAt: NOW },
  { id: "cand-4", clientId: "cli-4", fullName: "Renee Ortiz", email: "renee@coastalplumbing.com", phone: "(843) 555-1187", role: "Qualifier", qualifierType: "Employee qualifier", statesAssociated: ["SC"], notes: "", createdAt: d("02-18"), updatedAt: NOW },
  { id: "cand-5", clientId: "cli-5", fullName: "Grant Whitaker", email: "grant@imperialelectric.com", phone: "(614) 555-7742", role: "Master Electrician", qualifierType: "Primary qualifier", statesAssociated: ["OH"], notes: "", createdAt: d("03-01"), updatedAt: NOW },
  { id: "cand-6", clientId: "cli-6", fullName: "Paula Nguyen", email: "paula@cornerstoneroof.com", phone: "(919) 555-6650", role: "Owner / Qualifier", qualifierType: "Primary qualifier", statesAssociated: ["NC", "SC", "TN"], notes: "High-risk: multiple applications blocked.", createdAt: d("03-14"), updatedAt: NOW },
  { id: "cand-7", clientId: "cli-7", fullName: "Tyler Boone", email: "tyler@evergreenhvac.com", phone: "(423) 555-3390", role: "Qualifier", qualifierType: "Employee qualifier", statesAssociated: ["TN"], notes: "Requirement still under review.", createdAt: d("04-05"), updatedAt: NOW },
  { id: "cand-8", clientId: "cli-8", fullName: "Sonia Reyes", email: "sonia@libertyconcrete.com", phone: "(210) 555-8811", role: "Owner", qualifierType: "Primary qualifier", statesAssociated: ["TX"], notes: "Prior cycle closed.", createdAt: d("04-22"), updatedAt: NOW },
];

const exams: ExamRecord[] = [
  // 1. NASCLA blocking VA, MD, OH — passed, transcript ordered not yet received
  {
    id: "exam-1", clientId: "cli-1", candidateId: "cand-1", relatedApplicationIds: ["app-va", "app-md", "app-oh"],
    examName: "NASCLA Accredited Examination for Commercial General Building Contractors", examType: "General Contractor (NASCLA)",
    jurisdiction: "Multi-state", state: "VA", boardAgency: "NASCLA / State Boards", provider: "NASCLA",
    status: "Transcript ordered", eligibilityStatus: "Eligible", studyStatus: "Ready", registrationStatus: "Completed",
    scheduledDate: d("06-10"), scheduledTime: "9:00 AM EDT", testingLocation: "PSI Test Center — Richmond, VA",
    completedDate: d("06-10"), resultStatus: "Passed", transcriptStatus: "Ordered", transcriptRequired: true,
    applicationBlocked: true, owner: "Rose", reviewer: "Rose", nextAction: "Confirm transcript received by boards",
    dueDate: d("07-12"), riskLevel: "High", blocker: "VA/MD/OH reciprocity applications waiting on official transcript",
    clientVisibleStatus: "Transcript ordered", internalNotes: "Passed NASCLA. Transcript ordered 06-28; follow up with boards.", createdAt: d("05-01"), updatedAt: NOW,
  },
  // 2. Eligible but not scheduled
  {
    id: "exam-2", clientId: "cli-2", candidateId: "cand-2", relatedApplicationIds: ["app-2"],
    examName: "Virginia Class A Contractor Exam", examType: "State GC Exam", jurisdiction: "Virginia", state: "VA",
    boardAgency: "VA DPOR", provider: "PSI", status: "Eligible to schedule", eligibilityStatus: "Eligible",
    studyStatus: "Ready", registrationStatus: "Not started", scheduledDate: null, scheduledTime: null, testingLocation: null,
    completedDate: null, resultStatus: "Not taken", transcriptStatus: "Not required", transcriptRequired: false,
    applicationBlocked: true, owner: "Carmen", reviewer: "Rose", nextAction: "Register and schedule exam",
    dueDate: d("07-20"), riskLevel: "Medium", blocker: "Not scheduled despite eligibility confirmed",
    clientVisibleStatus: "Ready to schedule", internalNotes: "Eligibility confirmed 06-20. Awaiting scheduling.", createdAt: d("05-20"), updatedAt: NOW,
  },
  // 3. Scheduled, readiness not confirmed
  {
    id: "exam-3", clientId: "cli-3", candidateId: "cand-3", relatedApplicationIds: ["app-3"],
    examName: "Florida Certified General Contractor Exam", examType: "State GC Exam", jurisdiction: "Florida", state: "FL",
    boardAgency: "FL DBPR", provider: "Pearson VUE", status: "Scheduled", eligibilityStatus: "Eligible",
    studyStatus: "Readiness pending", registrationStatus: "Scheduled", scheduledDate: d("07-14"), scheduledTime: "1:00 PM EDT",
    testingLocation: "Pearson VUE — Tampa, FL", completedDate: null, resultStatus: "Not taken", transcriptStatus: "Not required",
    transcriptRequired: false, applicationBlocked: true, owner: "Emily", reviewer: "Rose", nextAction: "Confirm candidate readiness before exam",
    dueDate: d("07-12"), riskLevel: "High", blocker: "Study readiness not confirmed before scheduled date",
    clientVisibleStatus: "Exam scheduled", internalNotes: "Exam in 9 days but readiness not confirmed.", createdAt: d("05-25"), updatedAt: NOW,
  },
  // 4. Passed but transcript not ordered
  {
    id: "exam-4", clientId: "cli-4", candidateId: "cand-4", relatedApplicationIds: ["app-4"],
    examName: "South Carolina Plumbing Contractor Exam", examType: "Trade Exam", jurisdiction: "South Carolina", state: "SC",
    boardAgency: "SC LLR", provider: "PSI", status: "Transcript needs to be ordered", eligibilityStatus: "Eligible",
    studyStatus: "Ready", registrationStatus: "Completed", scheduledDate: d("06-24"), scheduledTime: "10:00 AM EDT",
    testingLocation: "PSI — Charleston, SC", completedDate: d("06-24"), resultStatus: "Passed", transcriptStatus: "Needs to be ordered",
    transcriptRequired: true, applicationBlocked: true, owner: "Skylar", reviewer: "Rose", nextAction: "Ask client to order official transcript",
    dueDate: d("07-08"), riskLevel: "Medium", blocker: "Passed but transcript not yet ordered", clientVisibleStatus: "Transcript pending",
    internalNotes: "Passed 06-24. Transcript required before license issuance.", createdAt: d("05-30"), updatedAt: NOW,
  },
  // 5. Transcript ordered but not received
  {
    id: "exam-5", clientId: "cli-5", candidateId: "cand-5", relatedApplicationIds: ["app-5"],
    examName: "Ohio Electrical Contractor Exam", examType: "Trade Exam", jurisdiction: "Ohio", state: "OH",
    boardAgency: "OH CIC", provider: "PSI", status: "Transcript ordered", eligibilityStatus: "Eligible", studyStatus: "Ready",
    registrationStatus: "Completed", scheduledDate: d("06-05"), scheduledTime: "9:00 AM EDT", testingLocation: "PSI — Columbus, OH",
    completedDate: d("06-05"), resultStatus: "Passed", transcriptStatus: "Ordered", transcriptRequired: true,
    applicationBlocked: true, owner: "Alyssa", reviewer: "Rose", nextAction: "Follow up: transcript not received by board",
    dueDate: d("07-06"), riskLevel: "Medium", blocker: "Transcript ordered 06-12 but not received by board", clientVisibleStatus: "Transcript ordered",
    internalNotes: "Transcript pending too long — escalate if not received this week.", createdAt: d("05-10"), updatedAt: NOW,
  },
  // 6. Failed, retake needed
  {
    id: "exam-6", clientId: "cli-6", candidateId: "cand-6", relatedApplicationIds: ["app-6a", "app-6b"],
    examName: "North Carolina General Contractor Exam", examType: "State GC Exam", jurisdiction: "North Carolina", state: "NC",
    boardAgency: "NC Licensing Board", provider: "PSI", status: "Failed - retake needed", eligibilityStatus: "Eligible",
    studyStatus: "Not ready", registrationStatus: "Completed", scheduledDate: d("06-18"), scheduledTime: "8:30 AM EDT",
    testingLocation: "PSI — Raleigh, NC", completedDate: d("06-18"), resultStatus: "Failed", transcriptStatus: "Not required",
    transcriptRequired: false, applicationBlocked: true, owner: "Christin", reviewer: "Rose", nextAction: "Build retake plan and confirm retake-eligible date",
    dueDate: d("07-10"), riskLevel: "High", blocker: "Failed exam; two applications blocked pending retake", clientVisibleStatus: "Retake planning required",
    internalNotes: "Failed by 4 points. Retake waiting period 30 days.", createdAt: d("05-05"), updatedAt: NOW,
  },
  // 7. Application ready to proceed after transcript received
  {
    id: "exam-7", clientId: "cli-7", candidateId: "cand-7", relatedApplicationIds: ["app-7"],
    examName: "Tennessee HVAC Contractor Exam", examType: "Trade Exam", jurisdiction: "Tennessee", state: "TN",
    boardAgency: "TN Board for Licensing Contractors", provider: "PSI", status: "Transcript received", eligibilityStatus: "Eligible",
    studyStatus: "Ready", registrationStatus: "Completed", scheduledDate: d("05-28"), scheduledTime: "11:00 AM CDT",
    testingLocation: "PSI — Nashville, TN", completedDate: d("05-28"), resultStatus: "Passed", transcriptStatus: "Received by board",
    transcriptRequired: true, applicationBlocked: false, owner: "Carmen", reviewer: "Rose", nextAction: "Mark related application unblocked and notify owner",
    dueDate: d("07-07"), riskLevel: "Low", blocker: "", clientVisibleStatus: "Transcript received",
    internalNotes: "Transcript received by board 06-30. Application can proceed.", createdAt: d("04-20"), updatedAt: NOW,
  },
  // 8. High-risk client with multiple blocked applications (Pinnacle also, but use Cornerstone as second high-risk exam)
  {
    id: "exam-8", clientId: "cli-6", candidateId: "cand-6", relatedApplicationIds: ["app-8a", "app-8b"],
    examName: "NASCLA Accredited Examination (Retake track)", examType: "General Contractor (NASCLA)", jurisdiction: "Multi-state", state: "SC",
    boardAgency: "NASCLA / State Boards", provider: "NASCLA", status: "Escalated", eligibilityStatus: "Missing information",
    studyStatus: "Materials needed", registrationStatus: "Not started", scheduledDate: null, scheduledTime: null, testingLocation: null,
    completedDate: null, resultStatus: "Not taken", transcriptStatus: "Needs to be ordered", transcriptRequired: true,
    applicationBlocked: true, owner: "Christin", reviewer: "Rose", nextAction: "Resolve eligibility documentation; two states blocked",
    dueDate: d("07-09"), riskLevel: "High", blocker: "Missing experience verification; SC + TN applications blocked", clientVisibleStatus: "Internal review needed before client update",
    internalNotes: "Escalated to Rose — high-value client, multiple blocked applications.", createdAt: d("05-15"), updatedAt: NOW,
  },
  // 9. Exam requirement under review
  {
    id: "exam-9", clientId: "cli-7", candidateId: "cand-7", relatedApplicationIds: [],
    examName: "Tennessee Limited License Electrician (requirement TBD)", examType: "Trade Exam (under review)", jurisdiction: "Tennessee", state: "TN",
    boardAgency: "TN Board for Licensing Contractors", provider: "PSI", status: "Exam required", eligibilityStatus: "Under review",
    studyStatus: "Not started", registrationStatus: "Not started", scheduledDate: null, scheduledTime: null, testingLocation: null,
    completedDate: null, resultStatus: "Not taken", transcriptStatus: "Not confirmed", transcriptRequired: false,
    applicationBlocked: false, owner: "Carmen", reviewer: "Rose", nextAction: "Confirm whether exam is actually required for this classification",
    dueDate: d("07-18"), riskLevel: "Low", blocker: "Requirement not yet confirmed", clientVisibleStatus: "Exam requirement under review",
    internalNotes: "Checking board rules to confirm exam requirement.", createdAt: d("06-10"), updatedAt: NOW,
  },
  // 10. Closed record with full audit history
  {
    id: "exam-10", clientId: "cli-8", candidateId: "cand-8", relatedApplicationIds: ["app-10"],
    examName: "Texas Concrete Contractor Registration Exam", examType: "Trade Exam", jurisdiction: "Texas", state: "TX",
    boardAgency: "TDLR", provider: "Prometric", status: "Closed", eligibilityStatus: "Eligible", studyStatus: "Ready",
    registrationStatus: "Completed", scheduledDate: d("04-10"), scheduledTime: "9:00 AM CDT", testingLocation: "Prometric — San Antonio, TX",
    completedDate: d("04-10"), resultStatus: "Passed", transcriptStatus: "Received by board", transcriptRequired: true,
    applicationBlocked: false, owner: "Rose", reviewer: "Rose", nextAction: "None — record closed",
    dueDate: null, riskLevel: "Low", blocker: "", clientVisibleStatus: "Application can proceed",
    internalNotes: "Full lifecycle complete. Application unblocked and issued.", createdAt: d("03-01"), updatedAt: d("05-02"),
  },
];

const applications: RelatedApplication[] = [
  { id: "app-va", clientId: "cli-1", examId: "exam-1", applicationName: "Virginia Class A Reciprocity", applicationNumber: "VA-2026-4471", state: "VA", licenseClassification: "Class A GC", applicationStatus: "Blocked - awaiting transcript", blockedByExam: false, blockedByTranscript: true, dependencyType: "Reciprocity via NASCLA", whatCanProceedAfterPass: "Application review begins", whatCanProceedAfterTranscript: "License issuance", owner: "Rose", nextStepAfterUnblocked: "Submit to VA DPOR" },
  { id: "app-md", clientId: "cli-1", examId: "exam-1", applicationName: "Maryland MHIC Reciprocity", applicationNumber: "MD-2026-2210", state: "MD", licenseClassification: "MHIC", applicationStatus: "Blocked - awaiting transcript", blockedByExam: false, blockedByTranscript: true, dependencyType: "Reciprocity via NASCLA", whatCanProceedAfterPass: "Board pre-review", whatCanProceedAfterTranscript: "Final approval", owner: "Rose", nextStepAfterUnblocked: "Submit to MD board" },
  { id: "app-oh", clientId: "cli-1", examId: "exam-1", applicationName: "Ohio Commercial GC Reciprocity", applicationNumber: "OH-2026-8830", state: "OH", licenseClassification: "Commercial GC", applicationStatus: "Blocked - awaiting transcript", blockedByExam: false, blockedByTranscript: true, dependencyType: "Reciprocity via NASCLA", whatCanProceedAfterPass: "Application accepted", whatCanProceedAfterTranscript: "License issuance", owner: "Rose", nextStepAfterUnblocked: "Submit to OH CIC" },
  { id: "app-2", clientId: "cli-2", examId: "exam-2", applicationName: "Virginia Class A Contractor", applicationNumber: "VA-2026-5590", state: "VA", licenseClassification: "Class A GC", applicationStatus: "Blocked - exam not taken", blockedByExam: true, blockedByTranscript: false, dependencyType: "Direct exam requirement", whatCanProceedAfterPass: "Application submission", whatCanProceedAfterTranscript: "N/A", owner: "Carmen", nextStepAfterUnblocked: "Submit application" },
  { id: "app-3", clientId: "cli-3", examId: "exam-3", applicationName: "Florida Certified GC", applicationNumber: "FL-2026-3321", state: "FL", licenseClassification: "Certified GC", applicationStatus: "Blocked - exam scheduled", blockedByExam: true, blockedByTranscript: false, dependencyType: "Direct exam requirement", whatCanProceedAfterPass: "Application review", whatCanProceedAfterTranscript: "N/A", owner: "Emily", nextStepAfterUnblocked: "Submit application" },
  { id: "app-4", clientId: "cli-4", examId: "exam-4", applicationName: "SC Plumbing Contractor License", applicationNumber: "SC-2026-1120", state: "SC", licenseClassification: "Plumbing Contractor", applicationStatus: "Blocked - awaiting transcript", blockedByExam: false, blockedByTranscript: true, dependencyType: "Direct exam requirement", whatCanProceedAfterPass: "Board review", whatCanProceedAfterTranscript: "License issuance", owner: "Skylar", nextStepAfterUnblocked: "Submit to SC LLR" },
  { id: "app-5", clientId: "cli-5", examId: "exam-5", applicationName: "Ohio Electrical Contractor License", applicationNumber: "OH-2026-7788", state: "OH", licenseClassification: "Electrical Contractor", applicationStatus: "Blocked - awaiting transcript", blockedByExam: false, blockedByTranscript: true, dependencyType: "Direct exam requirement", whatCanProceedAfterPass: "Board review", whatCanProceedAfterTranscript: "License issuance", owner: "Alyssa", nextStepAfterUnblocked: "Submit to OH CIC" },
  { id: "app-6a", clientId: "cli-6", examId: "exam-6", applicationName: "NC General Contractor License", applicationNumber: "NC-2026-9010", state: "NC", licenseClassification: "GC (Limited)", applicationStatus: "Blocked - retake needed", blockedByExam: true, blockedByTranscript: false, dependencyType: "Direct exam requirement", whatCanProceedAfterPass: "Application review", whatCanProceedAfterTranscript: "N/A", owner: "Christin", nextStepAfterUnblocked: "Submit application" },
  { id: "app-6b", clientId: "cli-6", examId: "exam-6", applicationName: "SC GC Reciprocity", applicationNumber: "SC-2026-9011", state: "SC", licenseClassification: "GC", applicationStatus: "Blocked - retake needed", blockedByExam: true, blockedByTranscript: false, dependencyType: "Reciprocity", whatCanProceedAfterPass: "Reciprocity review", whatCanProceedAfterTranscript: "N/A", owner: "Christin", nextStepAfterUnblocked: "Submit reciprocity packet" },
  { id: "app-7", clientId: "cli-7", examId: "exam-7", applicationName: "Tennessee HVAC Contractor License", applicationNumber: "TN-2026-4402", state: "TN", licenseClassification: "HVAC Contractor", applicationStatus: "Ready to proceed", blockedByExam: false, blockedByTranscript: false, dependencyType: "Direct exam requirement", whatCanProceedAfterPass: "Board review", whatCanProceedAfterTranscript: "License issuance", owner: "Carmen", nextStepAfterUnblocked: "Submit to TN board" },
  { id: "app-8a", clientId: "cli-6", examId: "exam-8", applicationName: "SC GC Reciprocity (NASCLA)", applicationNumber: "SC-2026-9500", state: "SC", licenseClassification: "GC", applicationStatus: "Blocked - eligibility issue", blockedByExam: true, blockedByTranscript: true, dependencyType: "Reciprocity via NASCLA", whatCanProceedAfterPass: "Reciprocity review", whatCanProceedAfterTranscript: "License issuance", owner: "Christin", nextStepAfterUnblocked: "Submit reciprocity packet" },
  { id: "app-8b", clientId: "cli-6", examId: "exam-8", applicationName: "TN GC Reciprocity (NASCLA)", applicationNumber: "TN-2026-9501", state: "TN", licenseClassification: "GC", applicationStatus: "Blocked - eligibility issue", blockedByExam: true, blockedByTranscript: true, dependencyType: "Reciprocity via NASCLA", whatCanProceedAfterPass: "Reciprocity review", whatCanProceedAfterTranscript: "License issuance", owner: "Christin", nextStepAfterUnblocked: "Submit reciprocity packet" },
  { id: "app-10", clientId: "cli-8", examId: "exam-10", applicationName: "Texas Concrete Contractor Registration", applicationNumber: "TX-2026-1000", state: "TX", licenseClassification: "Concrete Contractor", applicationStatus: "Approved - issued", blockedByExam: false, blockedByTranscript: false, dependencyType: "Direct exam requirement", whatCanProceedAfterPass: "Registration issued", whatCanProceedAfterTranscript: "Complete", owner: "Rose", nextStepAfterUnblocked: "None" },
];

const mkTranscript = (examId: string, candidateId: string, p: Partial<TranscriptRecord>): TranscriptRecord => ({
  id: `tr-${examId}`, examId, candidateId, transcriptRequired: true, transcriptStatus: "Needs to be ordered",
  orderedDate: null, provider: "PSI", deliveryMethod: "Electronic to board", sentToBoard: false, sentToState: false,
  receivedByBoard: false, receivedDate: null, confirmationNumber: "", followUpDueDate: null, issueNotes: "", ...p,
});

const transcripts: TranscriptRecord[] = [
  mkTranscript("exam-1", "cand-1", { provider: "NASCLA", transcriptStatus: "Ordered", orderedDate: d("06-28"), sentToBoard: true, followUpDueDate: d("07-12"), confirmationNumber: "NAS-TR-44815" }),
  mkTranscript("exam-4", "cand-4", { transcriptStatus: "Needs to be ordered", followUpDueDate: d("07-08") }),
  mkTranscript("exam-5", "cand-5", { transcriptStatus: "Ordered", orderedDate: d("06-12"), sentToBoard: true, followUpDueDate: d("07-06"), confirmationNumber: "PSI-TR-22190", issueNotes: "Pending too long — board has not confirmed receipt." }),
  mkTranscript("exam-7", "cand-7", { transcriptStatus: "Received by board", orderedDate: d("06-05"), receivedByBoard: true, receivedDate: d("06-30"), sentToBoard: true, sentToState: true, confirmationNumber: "PSI-TR-33110" }),
  mkTranscript("exam-8", "cand-6", { transcriptStatus: "Needs to be ordered" }),
  mkTranscript("exam-10", "cand-8", { provider: "Prometric", transcriptStatus: "Received by board", orderedDate: d("04-14"), receivedByBoard: true, receivedDate: d("04-25"), sentToBoard: true, sentToState: true, confirmationNumber: "PRO-TR-9001" }),
];

const mkStudy = (examId: string, p: Partial<StudyPrepRecord>): StudyPrepRecord => ({
  id: `sp-${examId}`, examId, studyMaterialsRequired: true, studyMaterialsOrdered: false, studyMaterialsReceived: false,
  studyProvider: "CCA Prep Library", prepCourseStatus: "Not started", candidateReadinessConfirmed: false,
  practiceExamCompleted: false, followUpNeeded: false, followUpDueDate: null, notes: "", ...p,
});

const studyPrep: StudyPrepRecord[] = [
  mkStudy("exam-1", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "Complete", candidateReadinessConfirmed: true, practiceExamCompleted: true }),
  mkStudy("exam-2", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "Complete", candidateReadinessConfirmed: true, practiceExamCompleted: true }),
  mkStudy("exam-3", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "In progress", candidateReadinessConfirmed: false, practiceExamCompleted: false, followUpNeeded: true, followUpDueDate: d("07-11"), notes: "Readiness not confirmed with 9 days to exam." }),
  mkStudy("exam-4", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "Complete", candidateReadinessConfirmed: true, practiceExamCompleted: true }),
  mkStudy("exam-5", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "Complete", candidateReadinessConfirmed: true, practiceExamCompleted: true }),
  mkStudy("exam-6", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "Needs re-prep", candidateReadinessConfirmed: false, practiceExamCompleted: false, followUpNeeded: true, notes: "Failed — additional prep required before retake." }),
  mkStudy("exam-7", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "Complete", candidateReadinessConfirmed: true, practiceExamCompleted: true }),
  mkStudy("exam-8", { studyMaterialsOrdered: false, studyMaterialsReceived: false, prepCourseStatus: "Not started", notes: "Blocked on eligibility before prep begins." }),
  mkStudy("exam-9", { studyMaterialsRequired: false, prepCourseStatus: "N/A until requirement confirmed" }),
  mkStudy("exam-10", { studyMaterialsOrdered: true, studyMaterialsReceived: true, prepCourseStatus: "Complete", candidateReadinessConfirmed: true, practiceExamCompleted: true }),
];

const mkReq = (id: string, examId: string, name: string, type: string, status: ExamRequirement["status"], required = true, notes = ""): ExamRequirement =>
  ({ id, examId, requirementName: name, requirementType: type, required, status, source: "Board rule summary", notes });

const requirements: ExamRequirement[] = [
  mkReq("req-1a", "exam-1", "Experience verification (4 yrs)", "Experience", "Met"),
  mkReq("req-1b", "exam-1", "Government-issued ID", "ID", "Met"),
  mkReq("req-1c", "exam-1", "Provider account (PSI)", "Provider account", "Met"),
  mkReq("req-2a", "exam-2", "Approval to test letter", "Authorization", "Met"),
  mkReq("req-3a", "exam-3", "Experience verification", "Experience", "Met"),
  mkReq("req-8a", "exam-8", "Experience verification", "Experience", "Not met", true, "Missing 1 year of documented experience."),
  mkReq("req-8b", "exam-8", "Name match verification", "Identity", "Unknown"),
  mkReq("req-9a", "exam-9", "Confirm exam is required for classification", "Requirement check", "Unknown", true, "Board rules under review."),
];

const tasks: Task[] = [
  { id: "task-1", relatedType: "transcript", relatedId: "exam-1", title: "Confirm NASCLA transcript received by VA/MD/OH boards", type: "Confirm transcript received", owner: "Rose", dueDate: d("07-12"), priority: "High", status: "Open", notes: "Ordered 06-28.", createdAt: d("06-28"), updatedAt: NOW },
  { id: "task-2", relatedType: "exam", relatedId: "exam-2", title: "Register and schedule VA Class A exam", type: "Register for exam", owner: "Carmen", dueDate: d("07-20"), priority: "Medium", status: "Open", notes: "", createdAt: d("06-20"), updatedAt: NOW },
  { id: "task-3", relatedType: "exam", relatedId: "exam-3", title: "Confirm candidate readiness before FL exam", type: "Confirm candidate readiness", owner: "Emily", dueDate: d("07-11"), priority: "High", status: "Open", notes: "Exam 07-14.", createdAt: d("06-30"), updatedAt: NOW },
  { id: "task-4", relatedType: "transcript", relatedId: "exam-4", title: "Ask client to order official transcript (SC)", type: "Ask client/candidate to order transcript", owner: "Skylar", dueDate: d("07-08"), priority: "High", status: "Open", notes: "", createdAt: d("06-25"), updatedAt: NOW },
  { id: "task-5", relatedType: "transcript", relatedId: "exam-5", title: "Follow up: OH transcript not received", type: "Confirm transcript received", owner: "Alyssa", dueDate: d("07-06"), priority: "High", status: "Open", notes: "Pending too long.", createdAt: d("06-20"), updatedAt: NOW },
  { id: "task-6", relatedType: "exam", relatedId: "exam-6", title: "Create NC retake plan", type: "Create retake plan", owner: "Christin", dueDate: d("07-10"), priority: "High", status: "Open", notes: "30-day wait.", createdAt: d("06-19"), updatedAt: NOW },
  { id: "task-7", relatedType: "application", relatedId: "app-7", title: "Notify TN application owner — ready to proceed", type: "Notify application owner", owner: "Carmen", dueDate: d("07-07"), priority: "Medium", status: "Open", notes: "", createdAt: d("06-30"), updatedAt: NOW },
];

const escalations: Escalation[] = [
  { id: "esc-1", examId: "exam-8", reason: "Eligibility documentation missing on high-value client; two states blocked", severity: "High", owner: "Rose", dueDate: d("07-09"), decisionNeeded: "Whether to pursue alternate experience verification path", clientFacingRisk: "Delay to client licensing timeline", applicationBlockingRisk: "SC + TN reciprocity blocked", boardFacingRisk: "None yet", status: "Open", notes: "Escalated to Rose.", createdAt: d("06-22"), updatedAt: NOW },
  { id: "esc-2", examId: "exam-5", reason: "Transcript pending too long — board has not confirmed receipt", severity: "Medium", owner: "Alyssa", dueDate: d("07-06"), decisionNeeded: "Whether to re-order transcript", clientFacingRisk: "Licensing delay", applicationBlockingRisk: "OH application blocked", boardFacingRisk: "Follow-up call to board needed", status: "In review", notes: "", createdAt: d("06-27"), updatedAt: NOW },
];

const clientUpdates: ClientUpdateDraft[] = [
  { id: "cu-1", examId: "exam-1", clientId: "cli-1", internalStatus: "Transcript ordered", proposedClientStatus: "Transcript ordered", draftMessage: "Your NASCLA exam has been passed and the official transcript has been ordered. VA, MD, and OH applications will proceed once the boards confirm receipt.", requestedBy: "Rose", reviewer: "", approvalStatus: "Submitted for review", approvedAt: null, publishedPreviewAt: null, notes: "" },
  { id: "cu-2", examId: "exam-7", clientId: "cli-7", internalStatus: "Transcript received", proposedClientStatus: "Transcript received", draftMessage: "Great news — your exam transcript has been received by the Tennessee board and your application can now proceed.", requestedBy: "Carmen", reviewer: "Rose", approvalStatus: "Approved locally", approvedAt: d("07-01"), publishedPreviewAt: null, notes: "Approved locally for ComplianceConnect preview." },
  { id: "cu-3", examId: "exam-3", clientId: "cli-3", internalStatus: "Scheduled", proposedClientStatus: "Exam scheduled", draftMessage: "Your Florida GC exam is scheduled for July 14. Please confirm you have completed your prep materials.", requestedBy: "Emily", reviewer: "", approvalStatus: "Draft", approvedAt: null, publishedPreviewAt: null, notes: "" },
];

const auditEvents: AuditEvent[] = [
  { id: "aud-10-1", timestamp: d("03-01"), user: "Rose", action: "Exam status changed", recordType: "exam", recordId: "exam-10", previousValue: "-", newValue: "Exam required", clientVisible: false, applicationImpacting: true, aiAssisted: false, notes: "Record created." },
  { id: "aud-10-2", timestamp: d("03-20"), user: "Rose", action: "Eligibility confirmed", recordType: "exam", recordId: "exam-10", previousValue: "Under review", newValue: "Eligible", clientVisible: false, applicationImpacting: false, aiAssisted: false, notes: "" },
  { id: "aud-10-3", timestamp: d("04-10"), user: "Rose", action: "Exam passed", recordType: "exam", recordId: "exam-10", previousValue: "Scheduled", newValue: "Passed", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "" },
  { id: "aud-10-4", timestamp: d("04-25"), user: "Rose", action: "Transcript received", recordType: "transcript", recordId: "exam-10", previousValue: "Ordered", newValue: "Received by board", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "" },
  { id: "aud-10-5", timestamp: d("05-02"), user: "Rose", action: "Application unblocked", recordType: "application", recordId: "app-10", previousValue: "Blocked", newValue: "Approved - issued", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "Record closed." },
  { id: "aud-1-1", timestamp: d("06-10"), user: "Rose", action: "Exam passed", recordType: "exam", recordId: "exam-1", previousValue: "Scheduled", newValue: "Passed", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "" },
  { id: "aud-1-2", timestamp: d("06-28"), user: "Rose", action: "Transcript ordered", recordType: "transcript", recordId: "exam-1", previousValue: "Needs to be ordered", newValue: "Ordered", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "" },
  { id: "aud-5-1", timestamp: d("06-05"), user: "Alyssa", action: "Exam passed", recordType: "exam", recordId: "exam-5", previousValue: "Scheduled", newValue: "Passed", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "" },
  { id: "aud-6-1", timestamp: d("06-18"), user: "Christin", action: "Exam failed", recordType: "exam", recordId: "exam-6", previousValue: "Scheduled", newValue: "Failed", clientVisible: true, applicationImpacting: true, aiAssisted: false, notes: "Retake needed." },
];

const documents: DocumentAttachmentPlaceholder[] = [
  { id: "doc-1", relatedType: "exam", relatedId: "exam-1", documentName: "NASCLA score report", documentType: "Score report", sourceSystem: "Doc Collection", status: "Preview only", notes: "" },
  { id: "doc-2", relatedType: "transcript", relatedId: "exam-1", documentName: "Official transcript request", documentType: "Transcript", sourceSystem: "WorkDrive", status: "Preview only", notes: "" },
  { id: "doc-3", relatedType: "exam", relatedId: "exam-8", documentName: "Experience verification letter", documentType: "Eligibility", sourceSystem: "Doc Collection", status: "Missing", notes: "Required to resolve eligibility." },
  { id: "doc-4", relatedType: "candidate", relatedId: "cand-1", documentName: "Government-issued ID", documentType: "ID", sourceSystem: "Doc Collection", status: "Received", notes: "" },
  { id: "doc-5", relatedType: "exam", relatedId: "exam-4", documentName: "PSI pass proof", documentType: "Score report", sourceSystem: "Doc Collection", status: "Received", notes: "" },
];

export function buildSeed(): DomainState {
  return {
    clients, candidates, exams, requirements, providers, applications,
    transcripts, studyPrep, tasks, escalations, clientUpdates, auditEvents, documents,
  };
}

type ExamRequirementStatus = ExamRequirement["status"];
export type { ExamRequirementStatus };
