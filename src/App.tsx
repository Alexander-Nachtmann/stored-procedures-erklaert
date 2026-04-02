import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { initialMitarbeiter, abteilungen, dienstjahre, fmtDate, fmtEuro, type Mitarbeiter } from "./data"

export default function App() {
  const [mitarbeiter, setMitarbeiter] = useState([...initialMitarbeiter])
  const [filter, setFilter] = useState("Alle")
  const [vorname, setVorname] = useState("")
  const [nachname, setNachname] = useState("")
  const [abt, setAbt] = useState("HR")
  const [gehalt, setGehalt] = useState("")
  const [meldung, setMeldung] = useState<{ text: string; ok: boolean } | null>(null)

  const gefiltert = filter === "Alle" ? mitarbeiter : mitarbeiter.filter(m => m.abteilung === filter)
  const aktive = mitarbeiter.filter(m => m.aktiv)

  function anlegen() {
    if (!vorname.trim()) { setMeldung({ text: "Vorname fehlt.", ok: false }); return }
    if (!nachname.trim()) { setMeldung({ text: "Nachname fehlt.", ok: false }); return }
    const g = parseFloat(gehalt) || 0
    if (g <= 0) { setMeldung({ text: `Gehalt € ${fmtEuro(g)}? Des geht ned.`, ok: false }); return }
    if (mitarbeiter.some(m => m.vorname === vorname && m.nachname === nachname)) {
      setMeldung({ text: `${vorname} ${nachname} gibt's schon.`, ok: false }); return
    }
    const neu: Mitarbeiter = { vorname, nachname, abteilung: abt, eintritt: new Date().toISOString().slice(0, 10), gehalt: g, aktiv: true }
    setMitarbeiter(prev => [...prev, neu])
    setMeldung({ text: `${vorname} ${nachname} angelegt.`, ok: true })
    setVorname(""); setNachname(""); setGehalt("")
  }

  // Gehaltsübersicht
  const gruppen = [...new Set(mitarbeiter.map(m => m.abteilung))].sort().map(abtName => {
    const leute = aktive.filter(m => m.abteilung === abtName)
    const sum = leute.reduce((s, m) => s + m.gehalt, 0)
    return { abtName, count: leute.length, avg: leute.length ? sum / leute.length : 0, sum, year: sum * 14 }
  })

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header — wie eine Excel-Titelleiste */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1a1a1a] tracking-tight">Personalamt</h1>
            <p className="text-sm text-[#666] mt-0.5">Stored Procedures — interaktiv erklärt</p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-2xl font-bold tabular-nums text-[#1a1a1a]">{mitarbeiter.length}</p><p className="text-[10px] text-[#999] uppercase tracking-wider">Gesamt</p></div>
            <div><p className="text-2xl font-bold tabular-nums text-emerald-600">{aktive.length}</p><p className="text-[10px] text-[#999] uppercase tracking-wider">Aktiv</p></div>
          </div>
        </div>
      </header>

      {/* Analogie-Leiste */}
      <div className="bg-[#fff8e1] border-b border-[#ffe082] px-6 py-2.5">
        <p className="max-w-6xl mx-auto text-sm text-[#5d4037]">
          <strong>So funktioniert's:</strong> Du = am Schalter. Filter/Buttons = Stored Procedures. Tabelle = das Archiv, das du nie direkt siehst.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Linke Spalte: Aktionen ── */}
          <div className="space-y-4">
            {/* Filter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#666] flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border-emerald-200">SP 1</Badge>
                  Nach Abteilung filtern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filter} onValueChange={v => v && setFilter(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alle">Alle Abteilungen</SelectItem>
                    {abteilungen.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Anlegen */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#666] flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700 border-blue-200">SP 2</Badge>
                  Neue/n Mitarbeiter/in
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-[#999]">Vorname</Label><Input value={vorname} onChange={e => setVorname(e.target.value)} placeholder="Maria" /></div>
                  <div><Label className="text-xs text-[#999]">Nachname</Label><Input value={nachname} onChange={e => setNachname(e.target.value)} placeholder="Huber" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-[#999]">Abteilung</Label>
                    <Select value={abt} onValueChange={v => v && setAbt(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{abteilungen.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs text-[#999]">Gehalt</Label><Input type="number" value={gehalt} onChange={e => setGehalt(e.target.value)} placeholder="3000" /></div>
                </div>
                <Button onClick={anlegen} className="w-full">Anlegen</Button>
                {meldung && (
                  <p className={`text-xs font-medium ${meldung.ok ? "text-emerald-600" : "text-red-500"}`}>
                    {meldung.ok ? "✓" : "✗"} {meldung.text}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Rechte Spalte: Tabelle ── */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#666]">
                  Mitarbeiter {filter !== "Alle" && <Badge variant="secondary" className="ml-2 text-xs">{filter}</Badge>}
                </CardTitle>
                <span className="text-xs text-[#999] tabular-nums">{gefiltert.length} Zeilen</span>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto max-h-[420px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[#f8f9fa] z-10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider w-[140px]">Vorname</TableHead>
                        <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider w-[140px]">Nachname</TableHead>
                        <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Abteilung</TableHead>
                        <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-right">Eintritt</TableHead>
                        <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-right">Jahre</TableHead>
                        <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-right">Gehalt</TableHead>
                        <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-center w-[60px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gefiltert.map((m, i) => (
                        <TableRow key={`${m.vorname}-${m.nachname}-${i}`} className="text-sm">
                          <TableCell className="font-medium">{m.vorname}</TableCell>
                          <TableCell>{m.nachname}</TableCell>
                          <TableCell className="text-[#666]">{m.abteilung}</TableCell>
                          <TableCell className="text-right tabular-nums text-[#666]">{fmtDate(m.eintritt)}</TableCell>
                          <TableCell className="text-right tabular-nums">{dienstjahre(m)}</TableCell>
                          <TableCell className="text-right tabular-nums font-medium">€ {fmtEuro(m.gehalt)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={m.aktiv ? "default" : "secondary"} className={`text-[10px] ${m.aktiv ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-stone-100 text-stone-500"}`}>
                              {m.aktiv ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Gehaltsübersicht */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#666] flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 text-amber-700 border-amber-200">SP 3</Badge>
                  Gehaltsübersicht
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Abteilung</TableHead>
                      <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-right">Köpfe</TableHead>
                      <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-right">∅ Gehalt</TableHead>
                      <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-right">Monat</TableHead>
                      <TableHead className="text-[11px] font-semibold text-[#999] uppercase tracking-wider text-right">Jahr (14x)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gruppen.map(g => (
                      <TableRow key={g.abtName} className="text-sm">
                        <TableCell className="font-medium">{g.abtName}</TableCell>
                        <TableCell className="text-right tabular-nums">{g.count}</TableCell>
                        <TableCell className="text-right tabular-nums">€ {fmtEuro(g.avg)}</TableCell>
                        <TableCell className="text-right tabular-nums">€ {fmtEuro(g.sum)}</TableCell>
                        <TableCell className="text-right tabular-nums font-medium">€ {fmtEuro(g.year)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="text-sm font-bold border-t-2">
                      <TableCell>Gesamt</TableCell>
                      <TableCell className="text-right tabular-nums">{gruppen.reduce((s, g) => s + g.count, 0)}</TableCell>
                      <TableCell className="text-right tabular-nums">€ {fmtEuro(gruppen.reduce((s, g) => s + g.avg, 0) / gruppen.length)}</TableCell>
                      <TableCell className="text-right tabular-nums">€ {fmtEuro(gruppen.reduce((s, g) => s + g.sum, 0))}</TableCell>
                      <TableCell className="text-right tabular-nums">€ {fmtEuro(gruppen.reduce((s, g) => s + g.year, 0))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <footer className="text-center text-xs text-[#999] py-4 space-y-1">
          <p className="font-medium text-[#666]">Du hast gerade 3 Stored Procedures benutzt.</p>
          <p>SP 1 = Filter, SP 2 = Anlegen mit Validierung, SP 3 = Gehaltsberechnung. Genau so funktioniert das in SAP, Workday und Co.</p>
        </footer>
      </main>
    </div>
  )
}
