import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { initialKandidaten, initialBewertungen, statusWerte, bewertungsTypen, fmtDate, fmtScore, avgScore, type Kandidat, type Bewertung } from "./data"
import CountUp from "@/components/CountUp"
import ShinyText from "@/components/ShinyText"
import LightPillar from "@/components/LightPillar"

const statusFarben: Record<string, string> = {
  Screening: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Interview: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Angebot:   "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Abgesagt:  "bg-stone-100 text-stone-500 hover:bg-stone-100",
}

const scoreDimensionen = ["Fachlich", "Kommunikation", "Kulturfit", "Motivation"] as const
const th = "text-[11px] font-semibold text-[#999] uppercase tracking-wider"

function scoreFarbe(s: number): string {
  if (s <= 2) return "text-red-600 font-medium"
  if (s === 3) return "text-amber-600 font-medium"
  if (s === 4) return "text-emerald-600 font-medium"
  return "text-green-700 font-bold"
}

function SpBadge({ n, farbe }: { n: number; farbe: string }) {
  return <Badge variant="outline" className={`text-[10px] font-mono ${farbe}`}>SP {n}</Badge>
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="secondary" className={`text-[10px] ${statusFarben[status] ?? ""}`}>{status}</Badge>
}

export default function App() {
  const [kandidaten] = useState<Kandidat[]>([...initialKandidaten])
  const [bewertungen, setBewertungen] = useState<Bewertung[]>([...initialBewertungen])
  const [filter, setFilter] = useState("Alle")
  const [selKandidat, setSelKandidat] = useState("")
  const [selRunde, setSelRunde] = useState("")
  const [selTyp, setSelTyp] = useState("")
  const [scores, setScores] = useState(["", "", "", ""])
  const [kommentar, setKommentar] = useState("")
  const [meldung, setMeldung] = useState<{ text: string; ok: boolean } | null>(null)

  const gefiltert = filter === "Alle" ? kandidaten : kandidaten.filter(k => k.status === filter)

  const ranking = kandidaten
    .map(k => {
      const kb = bewertungen.filter(b => b.kandidatId === k.id)
      return kb.length === 0 ? null : { kandidat: k, runden: kb.length, avg: avgScore(kb) }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.avg - a.avg)

  function setScore(i: number, v: string) {
    setScores(prev => { const n = [...prev]; n[i] = v; return n })
  }

  function bewertungAnlegen() {
    if (!selKandidat) { setMeldung({ text: "Kandidat muss ausgewahlt werden.", ok: false }); return }
    const nums = scores.map(Number)
    if (nums.some(s => isNaN(s) || s < 1 || s > 5)) {
      setMeldung({ text: "Alle Scores mussen zwischen 1 und 5 liegen.", ok: false }); return
    }
    setBewertungen(prev => [...prev, {
      id: crypto.randomUUID(), kandidatId: selKandidat,
      runde: selRunde || "1", typ: selTyp || bewertungsTypen[0],
      fachlich: nums[0], kommunikation: nums[1], kulturfit: nums[2], motivation: nums[3],
      kommentar: kommentar.trim(), datum: new Date().toISOString().slice(0, 10),
    }])
    const name = kandidaten.find(k => k.id === selKandidat)?.name ?? "Kandidat"
    setMeldung({ text: `Bewertung fur ${name} gespeichert.`, ok: true })
    setScores(["", "", "", ""]); setKommentar("")
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="relative overflow-hidden bg-white border-b">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <LightPillar topColor="#7c3aed" bottomColor="#2563eb" intensity={0.6} rotationSpeed={0.3} quality="low" pillarWidth={0.8} glowAmount={0.4} />
        </div>
        <div className="relative max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight"><ShinyText text="Interview-Protokoll" speed={4} color="#1a1a1a" shineColor="#7c3aed" /></h1>
            <p className="text-sm text-[#666] mt-0.5">Stored Procedures — interaktiv erklärt</p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-2xl font-bold tabular-nums text-[#1a1a1a]"><CountUp to={kandidaten.length} duration={1.2} /></p><p className="text-[10px] text-[#999] uppercase tracking-wider">Kandidaten</p></div>
            <div><p className="text-2xl font-bold tabular-nums text-emerald-600"><CountUp to={bewertungen.length} duration={1.2} /></p><p className="text-[10px] text-[#999] uppercase tracking-wider">Bewertungen</p></div>
          </div>
        </div>
      </header>

      <div className="bg-[#fff8e1] border-b border-[#ffe082] px-6 py-2.5">
        <p className="max-w-6xl mx-auto text-sm text-[#5d4037]">
          <strong>So funktioniert's:</strong> Jeder Filter und Button ist eine Stored Procedure -- sie holt, pruft oder berechnet Daten im Hintergrund.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {/* SP 1 -- Filter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#666] flex items-center gap-2">
                  <SpBadge n={1} farbe="bg-emerald-50 text-emerald-700 border-emerald-200" />
                  Nach Status filtern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filter} onValueChange={v => v && setFilter(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alle">Alle Status</SelectItem>
                    {statusWerte.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* SP 2 -- Bewertung */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#666] flex items-center gap-2">
                  <SpBadge n={2} farbe="bg-blue-50 text-blue-700 border-blue-200" />
                  Neue Bewertung erfassen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-[#999]">Kandidat</Label>
                  <Select value={selKandidat} onValueChange={v => v && setSelKandidat(v)}>
                    <SelectTrigger><SelectValue placeholder="Kandidat wahlen..." /></SelectTrigger>
                    <SelectContent>
                      {kandidaten.map(k => <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-[#999]">Runde</Label>
                    <Select value={selRunde} onValueChange={v => v && setSelRunde(v)}>
                      <SelectTrigger><SelectValue placeholder="Runde" /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map(n => <SelectItem key={n} value={String(n)}>Runde {n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-[#999]">Typ</Label>
                    <Select value={selTyp} onValueChange={v => v && setSelTyp(v)}>
                      <SelectTrigger><SelectValue placeholder="Typ" /></SelectTrigger>
                      <SelectContent>
                        {bewertungsTypen.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {scoreDimensionen.map((dim, i) => (
                    <div key={dim}>
                      <Label className="text-xs text-[#999]">{dim} (1-5)</Label>
                      <Input type="number" min={1} max={5} value={scores[i]} onChange={e => setScore(i, e.target.value)} placeholder="3" />
                    </div>
                  ))}
                </div>
                <div>
                  <Label className="text-xs text-[#999]">Kommentar</Label>
                  <Input value={kommentar} onChange={e => setKommentar(e.target.value)} placeholder="Optionale Anmerkung..." />
                </div>
                <Button onClick={bewertungAnlegen} className="w-full">Bewertung speichern</Button>
                {meldung && (
                  <p className={`text-xs font-medium ${meldung.ok ? "text-emerald-600" : "text-red-500"}`}>
                    {meldung.ok ? "+" : "x"} {meldung.text}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {/* Candidates table */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#666]">
                  Kandidaten {filter !== "Alle" && <Badge variant="secondary" className="ml-2 text-xs">{filter}</Badge>}
                </CardTitle>
                <span className="text-xs text-[#999] tabular-nums">{gefiltert.length} Zeilen</span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto max-h-[340px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[#f8f9fa] z-10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className={th}>Name</TableHead>
                        <TableHead className={th}>Rolle</TableHead>
                        <TableHead className={`${th} text-right`}>Beworben</TableHead>
                        <TableHead className={`${th} text-center`}>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gefiltert.map(k => (
                        <TableRow key={k.id} className="text-sm">
                          <TableCell className="font-medium">{k.name}</TableCell>
                          <TableCell className="text-[#666]">{k.rolle}</TableCell>
                          <TableCell className="text-right tabular-nums text-[#666]">{fmtDate(k.beworbenAm)}</TableCell>
                          <TableCell className="text-center"><StatusBadge status={k.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* SP 3 -- Ranking */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#666] flex items-center gap-2">
                  <SpBadge n={3} farbe="bg-amber-50 text-amber-700 border-amber-200" />
                  Kandidaten-Ranking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className={`${th} text-right w-[60px]`}>Rang</TableHead>
                      <TableHead className={th}>Name</TableHead>
                      <TableHead className={th}>Rolle</TableHead>
                      <TableHead className={`${th} text-right`}>Runden</TableHead>
                      <TableHead className={`${th} text-right`}>Avg Score</TableHead>
                      <TableHead className={`${th} text-center`}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ranking.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-[#999] py-6">Noch keine Bewertungen vorhanden.</TableCell>
                      </TableRow>
                    ) : ranking.map((r, i) => (
                      <TableRow key={r.kandidat.id} className="text-sm">
                        <TableCell className="text-right tabular-nums font-bold text-[#999]">{i + 1}</TableCell>
                        <TableCell className="font-medium">{r.kandidat.name}</TableCell>
                        <TableCell className="text-[#666]">{r.kandidat.rolle}</TableCell>
                        <TableCell className="text-right tabular-nums">{r.runden}</TableCell>
                        <TableCell className={`text-right tabular-nums ${scoreFarbe(Math.round(r.avg))}`}>{fmtScore(r.avg)}</TableCell>
                        <TableCell className="text-center"><StatusBadge status={r.kandidat.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />
        <footer className="text-center text-xs text-[#999] py-4 space-y-1">
          <p className="font-medium"><ShinyText text="Du hast gerade 3 Stored Procedures benutzt." speed={5} color="#666" shineColor="#16a34a" /></p>
          <p>SP 1 = Filter nach Status, SP 2 = Bewertung mit Validierung, SP 3 = Ranking-Berechnung. Genau so funktioniert das in echten HR-Systemen.</p>
        </footer>
      </main>
    </div>
  )
}
