export type Kandidat = {
  id: string
  name: string
  rolle: string
  beworbenAm: string
  status: "Screening" | "Interview" | "Angebot" | "Abgesagt"
  erfahrungJahre: number
}

export type Bewertung = {
  id: string
  kandidatId: string
  runde: string
  typ: string
  fachlich: number
  kommunikation: number
  kulturfit: number
  motivation: number
  kommentar: string
  datum: string
}

export const initialKandidaten: Kandidat[] = [
  { id: "k1", name: "Maria Huber",      rolle: "Cloud Architect",    beworbenAm: "2026-02-10", status: "Interview",  erfahrungJahre: 8 },
  { id: "k2", name: "Franz Gruber",     rolle: "Backend Engineer",   beworbenAm: "2026-02-15", status: "Interview",  erfahrungJahre: 5 },
  { id: "k3", name: "Anna Steiner",     rolle: "Cloud Architect",    beworbenAm: "2026-02-18", status: "Screening",  erfahrungJahre: 3 },
  { id: "k4", name: "Johann Wimmer",    rolle: "Frontend Developer", beworbenAm: "2026-01-20", status: "Angebot",    erfahrungJahre: 6 },
  { id: "k5", name: "Theresia Pichler", rolle: "Backend Engineer",   beworbenAm: "2026-03-01", status: "Screening",  erfahrungJahre: 2 },
  { id: "k6", name: "Leopold Eder",     rolle: "DevOps Engineer",    beworbenAm: "2026-01-10", status: "Abgesagt",   erfahrungJahre: 10 },
  { id: "k7", name: "Karl Bauer",       rolle: "Cloud Architect",    beworbenAm: "2026-02-25", status: "Interview",  erfahrungJahre: 7 },
  { id: "k8", name: "Elfriede Koller",  rolle: "Frontend Developer", beworbenAm: "2026-03-05", status: "Screening",  erfahrungJahre: 4 },
]

export const initialBewertungen: Bewertung[] = [
  { id: "b1", kandidatId: "k1", runde: "1", typ: "Behavioral",    fachlich: 5, kommunikation: 5, kulturfit: 4, motivation: 4, kommentar: "Ausgezeichnete Kommunikation, sehr strukturiert.", datum: "2026-02-20" },
  { id: "b2", kandidatId: "k1", runde: "2", typ: "Technical",     fachlich: 5, kommunikation: 4, kulturfit: 4, motivation: 5, kommentar: "AWS + Azure Erfahrung beeindruckend.", datum: "2026-02-27" },
  { id: "b3", kandidatId: "k2", runde: "1", typ: "Behavioral",    fachlich: 4, kommunikation: 3, kulturfit: 5, motivation: 4, kommentar: "Teamplayer, gute Einstellung.", datum: "2026-02-22" },
  { id: "b4", kandidatId: "k2", runde: "2", typ: "System Design", fachlich: 3, kommunikation: 3, kulturfit: 4, motivation: 4, kommentar: "Microservices OK, Skalierung unklar.", datum: "2026-03-01" },
  { id: "b5", kandidatId: "k4", runde: "1", typ: "Technical",     fachlich: 4, kommunikation: 5, kulturfit: 5, motivation: 5, kommentar: "React + TypeScript top. Sofort einsetzbar.", datum: "2026-02-05" },
  { id: "b6", kandidatId: "k4", runde: "2", typ: "Behavioral",    fachlich: 4, kommunikation: 5, kulturfit: 5, motivation: 5, kommentar: "Perfekter Culture Fit. Angebot empfohlen.", datum: "2026-02-12" },
  { id: "b7", kandidatId: "k7", runde: "1", typ: "Technical",     fachlich: 5, kommunikation: 4, kulturfit: 3, motivation: 4, kommentar: "Starke Terraform-Kenntnisse, etwas reserviert.", datum: "2026-03-10" },
]

export const statusWerte = ["Screening", "Interview", "Angebot", "Abgesagt"] as const
export const bewertungsTypen = ["Behavioral", "Technical", "System Design"] as const

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function fmtScore(n: number): string {
  return n.toFixed(1)
}

export function avgScore(bs: Bewertung[]): number {
  if (bs.length === 0) return 0
  const total = bs.reduce((sum, b) => sum + (b.fachlich + b.kommunikation + b.kulturfit + b.motivation) / 4, 0)
  return total / bs.length
}
