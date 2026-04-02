import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { initialKandidaten, initialBewertungen, statusWerte, bewertungsTypen, fmtDate, fmtScore, avgScore, type Kandidat, type Bewertung } from "../data"
import CountUp from "@/components/CountUp"
import ShinyText from "@/components/ShinyText"
import Particles from "@/components/Particles"

const statusStyle: Record<string, string> = {
  Screening: "bg-sky-50 text-sky-600 border-sky-200",
  Interview: "bg-violet-50 text-violet-600 border-violet-200",
  Angebot:   "bg-emerald-50 text-emerald-600 border-emerald-200",
  Abgesagt:  "bg-stone-50 text-stone-400 border-stone-200",
}

const scoreDimensionen = ["Fachlich", "Kommunikation", "Kulturfit", "Motivation"] as const
const thClass = "text-[10px] font-medium text-stone-400 uppercase tracking-widest"

function scoreFarbe(s: number): string {
  if (s <= 2) return "text-rose-500"
  if (s <= 3) return "text-amber-500"
  if (s <= 4) return "text-emerald-500 font-medium"
  return "text-emerald-600 font-bold"
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusStyle[status] ?? "bg-stone-50 text-stone-400 border-stone-200"}`}>
      {status}
    </span>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const colors = rank === 1 ? "bg-amber-50 text-amber-600 border-amber-200"
    : rank === 2 ? "bg-stone-50 text-stone-500 border-stone-200"
    : rank === 3 ? "bg-orange-50 text-orange-500 border-orange-200"
    : "bg-stone-50 text-stone-400 border-stone-100"
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${colors}`}>
      {rank}
    </span>
  )
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
    if (!selKandidat) { setMeldung({ text: "Bitte einen Kandidaten auswählen.", ok: false }); return }
    const nums = scores.map(Number)
    if (nums.some(s => isNaN(s) || s < 1 || s > 5)) {
      setMeldung({ text: "Alle Bewertungen müssen zwischen 1 und 5 liegen.", ok: false }); return
    }
    setBewertungen(prev => [...prev, {
      id: crypto.randomUUID(), kandidatId: selKandidat,
      runde: selRunde || "1", typ: selTyp || bewertungsTypen[0],
      fachlich: nums[0], kommunikation: nums[1], kulturfit: nums[2], motivation: nums[3],
      kommentar: kommentar.trim(), datum: new Date().toISOString().slice(0, 10),
    }])
    const name = kandidaten.find(k => k.id === selKandidat)?.name ?? "Kandidat"
    setMeldung({ text: `Bewertung für ${name} gespeichert.`, ok: true })
    setScores(["", "", "", ""]); setKommentar("")
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* -- Particles fixed background -- */}
      <div className="fixed inset-0 opacity-[0.12] pointer-events-none z-0">
        <Particles
          particleCount={30}
          particleColors={["#8b5cf6"]}
          particleBaseSize={30}
          particleSpread={10}
          speed={0.05}
          sizeRandomness={0.5}
          alphaParticles
          disableRotation={false}
        />
      </div>

      {/* -- Header -- */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-800">
              <ShinyText text="Interview-Protokoll" speed={5} color="#292524" shineColor="#8b5cf6" />
            </h1>
            <p className="text-[13px] text-stone-400 mt-1">Stored Procedures — interaktiv erklärt</p>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums text-stone-700"><CountUp to={kandidaten.length} duration={1.5} /></p>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Kandidaten</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums text-violet-500"><CountUp to={bewertungen.length} duration={1.5} /></p>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Bewertungen</p>
            </div>
          </div>
        </div>
      </header>

      {/* -- Info Bar -- */}
      <div className="relative z-10 bg-violet-50/60 border-b border-violet-100 px-6 py-3">
        <p className="max-w-6xl mx-auto text-[13px] text-violet-700/80">
          <span className="font-semibold">So funktioniert's:</span> Jeder Filter und Button ist eine Stored Procedure — sie holt, prüft oder berechnet Daten für dich im Hintergrund.
        </p>
      </div>

      {/* -- Main -- */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* -- Left: Actions -- */}
          <div className="space-y-5">
            {/* SP 1 */}
            <Card className="shadow-sm shadow-stone-200/50 border-stone-100 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-stone-600 flex items-center gap-2.5">
                  <Badge variant="outline" className="text-[10px] font-mono bg-emerald-50 text-emerald-600 border-emerald-200 rounded-full px-2.5">SP 1</Badge>
                  Nach Status filtern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filter} onValueChange={v => v && setFilter(v)}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alle">Alle Kandidaten</SelectItem>
                    {statusWerte.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* SP 2 */}
            <Card className="shadow-sm shadow-stone-200/50 border-stone-100 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-stone-600 flex items-center gap-2.5">
                  <Badge variant="outline" className="text-[10px] font-mono bg-violet-50 text-violet-600 border-violet-200 rounded-full px-2.5">SP 2</Badge>
                  Neue Bewertung erfassen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-stone-500 mb-1.5 block">Kandidat/in</Label>
                  <Select value={selKandidat} onValueChange={v => v && setSelKandidat(v)}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Bitte auswählen ..." /></SelectTrigger>
                    <SelectContent>
                      {kandidaten.map(k => <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-stone-500 mb-1.5 block">Runde</Label>
                    <Select value={selRunde} onValueChange={v => v && setSelRunde(v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder="Runde" /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map(n => <SelectItem key={n} value={String(n)}>Runde {n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-stone-500 mb-1.5 block">Typ</Label>
                    <Select value={selTyp} onValueChange={v => v && setSelTyp(v)}>
                      <SelectTrigger className="h-10"><SelectValue placeholder="Typ" /></SelectTrigger>
                      <SelectContent>
                        {bewertungsTypen.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {scoreDimensionen.map((dim, i) => (
                    <div key={dim}>
                      <Label className="text-xs font-medium text-stone-500 mb-1.5 block">{dim}</Label>
                      <Input type="number" min={1} max={5} value={scores[i]} onChange={e => setScore(i, e.target.value)} placeholder="1-5" className="h-10 tabular-nums" />
                    </div>
                  ))}
                </div>
                <div>
                  <Label className="text-xs font-medium text-stone-500 mb-1.5 block">Kommentar</Label>
                  <Input value={kommentar} onChange={e => setKommentar(e.target.value)} placeholder="Optionale Anmerkung ..." className="h-10" />
                </div>
                <Button onClick={bewertungAnlegen} className="w-full h-10 bg-violet-500 hover:bg-violet-600 text-white shadow-sm">
                  Bewertung speichern
                </Button>
                {meldung && (
                  <div className={`text-xs font-medium px-3 py-2 rounded-lg ${meldung.ok ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                    {meldung.ok ? "\u2713" : "\u2717"} {meldung.text}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* -- Right: Tables -- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidates */}
            <Card className="shadow-sm shadow-stone-200/50 border-stone-100">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                  Kandidaten
                  {filter !== "Alle" && <StatusBadge status={filter} />}
                </CardTitle>
                <span className="text-[11px] text-stone-400 tabular-nums">{gefiltert.length} Ergebnisse</span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto max-h-[360px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-stone-50/80 backdrop-blur-sm z-10">
                      <TableRow className="hover:bg-transparent border-b border-stone-100">
                        <TableHead className={thClass}>Name</TableHead>
                        <TableHead className={thClass}>Rolle</TableHead>
                        <TableHead className={`${thClass} text-right`}>Erfahrung</TableHead>
                        <TableHead className={`${thClass} text-right`}>Beworben</TableHead>
                        <TableHead className={`${thClass} text-center`}>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gefiltert.map(k => (
                        <TableRow key={k.id} className="text-[13px] hover:bg-violet-50/30 transition-colors">
                          <TableCell className="font-medium text-stone-700">{k.name}</TableCell>
                          <TableCell className="text-stone-500">{k.rolle}</TableCell>
                          <TableCell className="text-right tabular-nums text-stone-500">{k.erfahrungJahre} J.</TableCell>
                          <TableCell className="text-right tabular-nums text-stone-400">{fmtDate(k.beworbenAm)}</TableCell>
                          <TableCell className="text-center"><StatusBadge status={k.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* SP 3: Ranking */}
            <Card className="shadow-sm shadow-stone-200/50 border-stone-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-stone-600 flex items-center gap-2.5">
                  <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 text-amber-600 border-amber-200 rounded-full px-2.5">SP 3</Badge>
                  Kandidaten-Ranking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-stone-100">
                      <TableHead className={`${thClass} w-[52px] text-center`}>Rang</TableHead>
                      <TableHead className={thClass}>Name</TableHead>
                      <TableHead className={thClass}>Rolle</TableHead>
                      <TableHead className={`${thClass} text-right`}>Runden</TableHead>
                      <TableHead className={`${thClass} text-right`}>Schnitt</TableHead>
                      <TableHead className={`${thClass} text-center`}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ranking.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-[13px] text-stone-400 py-8">Noch keine Bewertungen vorhanden.</TableCell>
                      </TableRow>
                    ) : ranking.map((r, i) => (
                      <TableRow key={r.kandidat.id} className="text-[13px] hover:bg-amber-50/30 transition-colors">
                        <TableCell className="text-center"><RankBadge rank={i + 1} /></TableCell>
                        <TableCell className="font-medium text-stone-700">{r.kandidat.name}</TableCell>
                        <TableCell className="text-stone-500">{r.kandidat.rolle}</TableCell>
                        <TableCell className="text-right tabular-nums text-stone-500">{r.runden}</TableCell>
                        <TableCell className={`text-right tabular-nums text-lg ${scoreFarbe(Math.round(r.avg))}`}>{fmtScore(r.avg)}</TableCell>
                        <TableCell className="text-center"><StatusBadge status={r.kandidat.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* -- Footer -- */}
        <div className="text-center mt-12 mb-6 space-y-2">
          <p className="text-sm font-medium text-stone-500">
            <ShinyText text="Du hast gerade 3 Stored Procedures benutzt." speed={6} color="#78716c" shineColor="#8b5cf6" />
          </p>
          <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
            SP 1 filtert, SP 2 validiert und speichert, SP 3 berechnet das Ranking.
            Genau so funktioniert das in Workday, SAP und echten HR-Systemen.
          </p>
        </div>
      </main>
    </div>
  )
}
