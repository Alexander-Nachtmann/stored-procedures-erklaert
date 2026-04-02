import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SchalterCard } from "@/components/SchalterCard"
import { Terminal, type TerminalLine } from "@/components/Terminal"
import { initialMitarbeiter, abteilungen, type Mitarbeiter } from "./data"
import {
  runMitarbeiterNachAbteilung, runEingestelltSeit, runGehaltsübersicht,
  runNeuenMitarbeiter, runBlödsinn, runJubilare, runPersonalreport,
} from "./procedures"
import Aurora from "@/components/Aurora"
import GradientText from "@/components/GradientText"
import CountUp from "@/components/CountUp"
import ClickSpark from "@/components/ClickSpark"

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
    <ClickSpark sparkColor="#dc2626" sparkSize={12} sparkRadius={20} sparkCount={10}>
      <div className="min-h-screen">
        {/* Hero with Aurora background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Aurora
              colorStops={["#dc2626", "#7c3aed", "#dc2626"]}
              amplitude={0.8}
              blend={0.6}
              speed={0.5}
            />
          </div>
          <header className="relative z-10 text-center py-16 px-4">
            <GradientText
              colors={["#ffffff", "#fca5a5", "#ffffff", "#c4b5fd", "#ffffff"]}
              animationSpeed={6}
              className="text-4xl sm:text-5xl font-bold tracking-tight"
            >
              Personalamt
            </GradientText>
            <p className="text-white/70 max-w-lg mx-auto text-[15px] mt-4">
              Stell dir das Meldeamt vor. Du gehst zum Schalter, sagst was du brauchst,
              und der Beamte erledigt alles. Du gehst nie ins Archiv.
            </p>
          </header>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Analogy */}
          <Card>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 text-center">
              {([["Du", "Die Benutzerin"], ["Schalter", "Der Knopf im System"], ["Beamter", "Die Stored Procedure"], ["Archiv", "Die Datenbank"]] as const).map(([title, sub]) => (
                <div key={title}>
                  <p className="text-lg font-bold">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Animated Stats */}
          <div className="flex gap-3 flex-wrap">
            <Card className="px-5 py-3">
              <p className="text-2xl font-bold">
                <CountUp to={mitarbeiter.length} duration={1.5} separator="." />
              </p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Im Archiv</p>
            </Card>
            <Card className="px-5 py-3">
              <p className="text-2xl font-bold">
                <CountUp to={aktive.length} duration={1.5} separator="." />
              </p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Aktiv</p>
            </Card>
            <Card className="px-5 py-3">
              <p className="text-2xl font-bold">
                <CountUp to={queryCount} duration={0.8} />
              </p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Abfragen</p>
            </Card>
          </div>

          <Separator />

          {/* Schalter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SchalterCard nr={1} title="Mitarbeiter nach Abteilung" description="Du sagst welche Abteilung, der Beamte holt die Liste." onRun={() => append(runMitarbeiterNachAbteilung(mitarbeiter, s1Abt))}>
              <Select value={s1Abt} onValueChange={v => v && setS1Abt(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {abteilungen.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </SchalterCard>

            <SchalterCard nr={2} title="Eingestellt seit ..." description="Wer wurde nach einem bestimmten Datum eingestellt?" onRun={() => append(runEingestelltSeit(mitarbeiter, parseInt(s2Jahr) || 2022))}>
              <Input type="number" value={s2Jahr} onChange={e => setS2Jahr(e.target.value)} min={2015} max={2026} />
            </SchalterCard>

            <SchalterCard nr={3} title="Gehaltsübersicht" description="Wie beim Finanzamt: du fragst, die rechnen. Pro Abteilung, mit 14 Gehältern." onRun={() => append(runGehaltsübersicht(mitarbeiter))} />

            <SchalterCard nr={4} title="Neue/n Mitarbeiter/in anlegen" description="Du gibst das Formular ab. Der Beamte prüft, DANN erst wird der Akt angelegt." buttonLabel="Anlegen" onRun={() => {
              const result = runNeuenMitarbeiter(mitarbeiter, s4Vorname, s4Nachname, s4Abt, parseFloat(s4Gehalt) || 0)
              append(result.lines)
              if (result.success && result.mitarbeiter) {
                setMitarbeiter(prev => [...prev, result.mitarbeiter!])
              }
            }}>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Vorname" value={s4Vorname} onChange={e => setS4Vorname(e.target.value)} />
                <Input placeholder="Nachname" value={s4Nachname} onChange={e => setS4Nachname(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={s4Abt} onValueChange={v => v && setS4Abt(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {abteilungen.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Gehalt" value={s4Gehalt} onChange={e => setS4Gehalt(e.target.value)} min={0} step={50} />
              </div>
            </SchalterCard>

            <SchalterCard nr={5} title="Blödsinn eingeben" description={'Was passiert bei ungültigen Daten? Der Beamte sagt "Na!" — das ist Sicherheit.'} buttonLabel="3x Blödsinn versuchen" onRun={() => append(runBlödsinn())} />

            <SchalterCard nr={6} title="Dienstjubiläen" description="Wer ist schon lange dabei? Der Beamte rechnet die Jahre aus." onRun={() => append(runJubilare(mitarbeiter, parseInt(s6Jahre) || 5))}>
              <Input type="number" value={s6Jahre} onChange={e => setS6Jahre(e.target.value)} min={1} max={20} />
            </SchalterCard>

            <SchalterCard nr={7} title="Kompletter Personalreport" description="Ein Knopf, ein Bericht. Jedes Monat gleich. Wie in Workday oder SAP." buttonLabel="Report erstellen" onRun={() => append(runPersonalreport(mitarbeiter))} />
          </div>

          {/* Terminal */}
          <Terminal lines={lines} />
          <Button variant="outline" size="sm" onClick={() => setLines([])}>
            Ausgabe leeren
          </Button>

          {/* Footer */}
          <footer className="text-center text-xs text-muted-foreground pt-4 pb-8 space-y-1">
            <GradientText
              colors={["#dc2626", "#7c3aed", "#dc2626"]}
              animationSpeed={4}
              className="text-sm font-medium"
            >
              Du hast gerade Stored Procedures benutzt.
            </GradientText>
            <p>Jedes Mal wenn du in Workday, SAP oder BambooHR auf "Report erstellen" klickst — passiert genau das.</p>
          </footer>
        </div>
      </div>
    </ClickSpark>
  )
}
