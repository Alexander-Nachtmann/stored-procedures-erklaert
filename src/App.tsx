import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, type TerminalLine } from "@/components/Terminal"
import { initialMitarbeiter, abteilungen, type Mitarbeiter } from "./data"
import {
  runMitarbeiterNachAbteilung, runEingestelltSeit, runGehaltsübersicht,
  runNeuenMitarbeiter, runBlödsinn, runJubilare, runPersonalreport,
} from "./procedures"
import Aurora from "@/components/Aurora"
import GradientText from "@/components/GradientText"
import CountUp from "@/components/CountUp"

export default function App() {
  const [mitarbeiter, setMitarbeiter] = useState<Mitarbeiter[]>([...initialMitarbeiter])
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [queryCount, setQueryCount] = useState(0)

  const [s1Abt, setS1Abt] = useState("HR")
  const [s2Jahr, setS2Jahr] = useState("2022")
  const [s4Vorname, setS4Vorname] = useState("Margarethe")
  const [s4Nachname, setS4Nachname] = useState("Rauch")
  const [s4Abt, setS4Abt] = useState("HR")
  const [s4Gehalt, setS4Gehalt] = useState("2850")
  const [s6Jahre, setS6Jahre] = useState("5")

  function append(newLines: TerminalLine[]) {
    setLines(prev => [...prev, ...newLines])
    setQueryCount(c => c + 1)
  }

  const aktive = mitarbeiter.filter(m => m.aktiv)

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Aurora colorStops={["#7c3aed", "#dc2626", "#7c3aed"]} amplitude={0.6} blend={0.7} speed={0.3} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0b]" />
        <header className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
          <GradientText
            colors={["#ffffff", "#a78bfa", "#ffffff", "#fca5a5", "#ffffff"]}
            animationSpeed={8}
            className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight"
          >
            Personalamt
          </GradientText>
          <p className="text-white/50 max-w-md mx-auto text-base mt-5 leading-relaxed">
            Stell dir das Meldeamt vor. Du gehst zum Schalter, sagst was du brauchst — der Beamte erledigt den Rest.
          </p>
        </header>
      </div>

      <main className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 pb-20 space-y-10">
        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: mitarbeiter.length, label: "Im Archiv", color: "text-violet-400" },
            { value: aktive.length, label: "Aktiv", color: "text-emerald-400" },
            { value: queryCount, label: "Abfragen", color: "text-amber-400" },
          ].map(s => (
            <Card key={s.label} className="bg-white/[0.03] border-white/[0.06] backdrop-blur-xl">
              <CardContent className="p-5 text-center">
                <p className={`text-3xl font-bold tabular-nums ${s.color}`}>
                  <CountUp to={s.value} duration={1} />
                </p>
                <p className="text-[11px] text-white/40 uppercase tracking-widest mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Analogy ── */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 text-center">
            {([
              ["Du", "Die Benutzerin", "text-violet-400"],
              ["Schalter", "Der Knopf im System", "text-amber-400"],
              ["Beamter", "Die Stored Procedure", "text-emerald-400"],
              ["Archiv", "Die Datenbank", "text-red-400"],
            ] as const).map(([title, sub, color]) => (
              <div key={title}>
                <p className={`text-lg font-bold ${color}`}>{title}</p>
                <p className="text-xs text-white/40 mt-0.5">{sub}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator className="bg-white/[0.06]" />

        {/* ── Schalter ── */}
        <Tabs defaultValue="1" className="gap-4">
          <TabsList className="bg-white/[0.04] border border-white/[0.06] w-full flex-wrap h-auto p-1 gap-0.5">
            {[
              { v: "1", l: "Abteilung" },
              { v: "2", l: "Eingestellt" },
              { v: "3", l: "Gehälter" },
              { v: "4", l: "Anlegen" },
              { v: "5", l: "Blödsinn" },
              { v: "6", l: "Jubilare" },
              { v: "7", l: "Report" },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v} className="data-active:bg-white/10 data-active:text-white text-white/50 text-xs sm:text-sm px-3 py-1.5">
                <span className="text-violet-400 font-mono mr-1.5">{t.v}</span>{t.l}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4">
            <TabsContent value="1">
              <SchalterPanel title="Mitarbeiter nach Abteilung" description="Du sagst welche Abteilung, der Beamte holt die Liste." onRun={() => append(runMitarbeiterNachAbteilung(mitarbeiter, s1Abt))}>
                <Select value={s1Abt} onValueChange={v => v && setS1Abt(v)}>
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{abteilungen.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </SchalterPanel>
            </TabsContent>

            <TabsContent value="2">
              <SchalterPanel title="Eingestellt seit ..." description="Wer wurde nach einem bestimmten Datum eingestellt?" onRun={() => append(runEingestelltSeit(mitarbeiter, parseInt(s2Jahr) || 2022))}>
                <Input type="number" value={s2Jahr} onChange={e => setS2Jahr(e.target.value)} min={2015} max={2026} className="bg-white/[0.04] border-white/[0.08] text-white" />
              </SchalterPanel>
            </TabsContent>

            <TabsContent value="3">
              <SchalterPanel title="Gehaltsübersicht" description="Wie beim Finanzamt: du fragst, die rechnen. Pro Abteilung, mit 14 Gehältern." onRun={() => append(runGehaltsübersicht(mitarbeiter))} />
            </TabsContent>

            <TabsContent value="4">
              <SchalterPanel title="Neue/n Mitarbeiter/in anlegen" description="Du gibst das Formular ab. Der Beamte prüft, DANN erst wird der Akt angelegt." buttonLabel="Anlegen" onRun={() => {
                const result = runNeuenMitarbeiter(mitarbeiter, s4Vorname, s4Nachname, s4Abt, parseFloat(s4Gehalt) || 0)
                append(result.lines)
                if (result.success && result.mitarbeiter) setMitarbeiter(prev => [...prev, result.mitarbeiter!])
              }}>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Vorname" value={s4Vorname} onChange={e => setS4Vorname(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
                  <Input placeholder="Nachname" value={s4Nachname} onChange={e => setS4Nachname(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={s4Abt} onValueChange={v => v && setS4Abt(v)}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{abteilungen.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="number" placeholder="Gehalt" value={s4Gehalt} onChange={e => setS4Gehalt(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
                </div>
              </SchalterPanel>
            </TabsContent>

            <TabsContent value="5">
              <SchalterPanel title="Blödsinn eingeben" description='Was passiert bei ungültigen Daten? Der Beamte sagt "Na!" — das ist Sicherheit.' buttonLabel="3x Blödsinn versuchen" onRun={() => append(runBlödsinn())} />
            </TabsContent>

            <TabsContent value="6">
              <SchalterPanel title="Dienstjubiläen" description="Wer ist schon lange dabei? Der Beamte rechnet die Jahre aus." onRun={() => append(runJubilare(mitarbeiter, parseInt(s6Jahre) || 5))}>
                <Input type="number" value={s6Jahre} onChange={e => setS6Jahre(e.target.value)} min={1} max={20} className="bg-white/[0.04] border-white/[0.08] text-white" />
              </SchalterPanel>
            </TabsContent>

            <TabsContent value="7">
              <SchalterPanel title="Kompletter Personalreport" description="Ein Knopf, ein Bericht. Jedes Monat gleich. Wie in Workday oder SAP." buttonLabel="Report erstellen" onRun={() => append(runPersonalreport(mitarbeiter))} />
            </TabsContent>
          </div>
        </Tabs>

        {/* ── Terminal ── */}
        <Terminal lines={lines} onClear={() => setLines([])} />

        {/* ── Footer ── */}
        <footer className="text-center pt-6 pb-2 space-y-2">
          <GradientText colors={["#7c3aed", "#dc2626", "#7c3aed"]} animationSpeed={5} className="text-sm font-medium">
            Du hast gerade Stored Procedures benutzt.
          </GradientText>
          <p className="text-xs text-white/30">
            Jedes Mal wenn du in Workday, SAP oder BambooHR auf "Report erstellen" klickst — passiert genau das.
          </p>
        </footer>
      </main>
    </div>
  )
}

/* ── SchalterPanel ── */

import type { ReactNode } from "react"

function SchalterPanel({ title, description, children, buttonLabel = "Ausführen", onRun }: {
  title: string; description: string; children?: ReactNode; buttonLabel?: string; onRun: () => void
}) {
  return (
    <Card className="bg-white/[0.03] border-white/[0.06]">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
        <CardDescription className="text-white/40">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {children}
        <Button onClick={onRun} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white">
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
