export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("scheduled") && !s.includes("not")) return "bg-green-100 text-green-700 border-green-200";
  if (s.includes("approved") || s.includes("passed") || s.includes("complete")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (s.includes("at risk")) return "bg-rose-100 text-rose-700 border-rose-200";
  if (s.includes("failed") || s.includes("canceled") || s.includes("no show") || s.includes("blocked")) return "bg-red-100 text-red-700 border-red-200";
  if (s.includes("retake")) return "bg-orange-100 text-orange-700 border-orange-200";
  if (s.includes("waiting on exam date") || s.includes("exam coming up")) return "bg-orange-100 text-orange-700 border-orange-200";
  if (s.includes("prep in progress") || s.includes("waiting on client date") || s.includes("ready to schedule")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (s.includes("in progress") || s.includes("in review")) return "bg-teal-100 text-teal-700 border-teal-200";
  if (s.includes("waiting on prep docs") || s.includes("waiting on docs") || s.includes("waiting on pass sheet")) return "bg-purple-100 text-purple-700 border-purple-200";
  if (s.includes("pre-approval") || s.includes("board approval")) return "bg-violet-100 text-violet-700 border-violet-200";
  if (s.includes("new") || s.includes("invoice paid")) return "bg-indigo-100 text-indigo-700 border-indigo-200";
  if (s.includes("needs review") || s.includes("waiting on exam") || s.includes("waiting on pre-approval")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (s.includes("ready for") || s.includes("processing updated")) return "bg-cyan-100 text-cyan-700 border-cyan-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export function getRiskColor(risk: string): string {
  if (risk === "High") return "bg-rose-100 text-rose-700 border-rose-200";
  if (risk === "Medium") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

export function getResponseColor(r: string): string {
  if (r === "Not Responding") return "bg-rose-100 text-rose-700 border-rose-200";
  if (r === "Slow") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}
