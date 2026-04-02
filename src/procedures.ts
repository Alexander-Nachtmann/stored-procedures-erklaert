import type { TerminalLine } from "./components/Terminal"
import type { Mitarbeiter } from "./data"
import { dienstjahre, fmtDate, fmtEuro } from "./data"

function heading(text: string): TerminalLine { return { text, type: "heading" } }
function ok(text: string): TerminalLine { return { text, type: "ok" } }
function err(text: string): TerminalLine { return { text, type: "err" } }
function muted(text: string): TerminalLine { return { text, type: "muted" } }
function sep(): TerminalLine { return { text: "─".repeat(52), type: "sep" } }
function label(text: string): TerminalLine { return { text, type: "label" } }
function line(text: string): TerminalLine { return { text } }
function blank(): TerminalLine { return { text: "" } }

function pad(s: string, n: number) { return s.padEnd(n) }
function padr(s: string, n: number) { return s.padStart(n) }

export function runMitarbeiterNachAbteilung(archiv: Mitarbeiter[], abteilung: string): TerminalLine[] {
  const out: TerminalLine[] = [blank(), heading(`  SCHALTER 1 — Mitarbeiter in ${abteilung}`), sep()]
  const result = archiv.filter(m => m.abteilung === abteilung && m.aktiv).sort((a, b) => a.nachname.localeCompare(b.nachname))
  for (const m of result) {
    out.push(line(`  ${pad(m.vorname, 12)} ${pad(m.nachname, 12)} seit ${fmtDate(m.eintritt)}  (${dienstjahre(m)} Jahre)`))
  }
  out.push(blank(), muted(`  ${result.length} aktive Mitarbeiter in ${abteilung}`), sep())
  return out
}

export function runEingestelltSeit(archiv: Mitarbeiter[], jahr: number): TerminalLine[] {
  const seit = new Date(`${jahr}-01-01`)
  const out: TerminalLine[] = [blank(), heading(`  SCHALTER 2 — Eingestellt seit ${jahr}`), sep()]
  const result = archiv.filter(m => new Date(m.eintritt) >= seit).sort((a, b) => new Date(a.eintritt).getTime() - new Date(b.eintritt).getTime())
  for (const m of result) {
    out.push(line(`  ${pad(m.vorname, 12)} ${pad(m.nachname, 12)} ${pad(m.abteilung, 14)} ${fmtDate(m.eintritt)}`))
  }
  out.push(blank(), muted(`  ${result.length} Personen seit 01.01.${jahr} eingestellt`), sep())
  return out
}

export function runGehaltsübersicht(archiv: Mitarbeiter[]): TerminalLine[] {
  const out: TerminalLine[] = [blank(), heading("  SCHALTER 3 — Gehaltsübersicht pro Abteilung"), sep()]
  const abteilungen = [...new Set(archiv.map(m => m.abteilung))].sort()
  let gesamt = 0
  for (const abt of abteilungen) {
    const gruppe = archiv.filter(m => m.abteilung === abt && m.aktiv)
    if (gruppe.length === 0) continue
    const sum = gruppe.reduce((s, m) => s + m.gehalt, 0)
    const avg = sum / gruppe.length
    gesamt += sum
    out.push(label(`  ${abt}`))
    out.push(line(`    Köpfe:          ${gruppe.length}`))
    out.push(line(`    Durchschnitt:   € ${fmtEuro(avg)}`))
    out.push(line(`    Monatskosten:   € ${fmtEuro(sum)}`))
    out.push(line(`    Jahreskosten:   € ${fmtEuro(sum * 14)}  (14 Gehälter)`))
    out.push(blank())
  }
  out.push(muted(`  Gesamtkosten/Jahr: € ${fmtEuro(gesamt * 14)}`), sep())
  return out
}

export function runNeuenMitarbeiter(
  archiv: Mitarbeiter[],
  vorname: string, nachname: string, abteilung: string, gehalt: number
): { lines: TerminalLine[]; success: boolean; mitarbeiter?: Mitarbeiter } {
  const out: TerminalLine[] = [blank(), heading("  SCHALTER 4 — Neuen Mitarbeiter anlegen"), sep()]

  if (!vorname.trim()) {
    out.push(err("  ABGELEHNT: Vorname fehlt. Bitte Formular neu ausfüllen."), sep())
    return { lines: out, success: false }
  }
  if (!nachname.trim()) {
    out.push(err("  ABGELEHNT: Nachname fehlt."), sep())
    return { lines: out, success: false }
  }
  if (gehalt <= 0) {
    out.push(err(`  ABGELEHNT: Gehalt € ${fmtEuro(gehalt)}? Des geht ned.`), sep())
    return { lines: out, success: false }
  }
  if (archiv.some(m => m.vorname === vorname && m.nachname === nachname)) {
    out.push(err(`  ABGELEHNT: ${vorname} ${nachname} gibt's schon im System.`), sep())
    return { lines: out, success: false }
  }

  const heute = new Date().toISOString().slice(0, 10)
  const neu: Mitarbeiter = { vorname, nachname, abteilung, eintritt: heute, gehalt, aktiv: true }
  out.push(ok(`  ANGELEGT: ${vorname} ${nachname}`))
  out.push(line(`    Abteilung: ${abteilung}`))
  out.push(line(`    Eintritt:  ${fmtDate(heute)}`))
  out.push(line(`    Gehalt:    € ${fmtEuro(gehalt)}`))
  out.push(sep())
  return { lines: out, success: true, mitarbeiter: neu }
}

export function runBlödsinn(): TerminalLine[] {
  return [
    blank(), heading("  SCHALTER 5 — Blödsinn-Test (3 Versuche)"), sep(),
    label("  Versuch 1: Vorname leer"),
    err("  ABGELEHNT: Vorname fehlt. Bitte Formular neu ausfüllen."), blank(),
    label("  Versuch 2: Gehalt = -500"),
    err("  ABGELEHNT: Gehalt € -500? Des geht ned."), blank(),
    label("  Versuch 3: Maria Huber nochmal anlegen"),
    err("  ABGELEHNT: Maria Huber gibt's schon im System."), blank(),
    ok("  3/3 abgelehnt. Die Daten sind sicher."), sep(),
  ]
}

export function runJubilare(archiv: Mitarbeiter[], minJahre: number): TerminalLine[] {
  const out: TerminalLine[] = [blank(), heading(`  SCHALTER 6 — Jubilare (${minJahre}+ Jahre)`), sep()]
  const result = archiv.filter(m => m.aktiv && dienstjahre(m) >= minJahre).sort((a, b) => dienstjahre(b) - dienstjahre(a))
  for (const m of result) {
    const j = dienstjahre(m)
    const stern = j >= 8 ? " *" : ""
    out.push(line(`  ${pad(m.vorname, 12)} ${pad(m.nachname, 12)} ${padr(String(j), 2)} Jahre  (seit ${fmtDate(m.eintritt)})${stern}`))
  }
  out.push(blank(), muted(`  ${result.length} Mitarbeiter mit ${minJahre}+ Dienstjahren`), sep())
  return out
}

export function runPersonalreport(archiv: Mitarbeiter[]): TerminalLine[] {
  const aktive = archiv.filter(m => m.aktiv)
  const inaktive = archiv.filter(m => !m.aktiv)
  const heute = new Date().toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" })
  const out: TerminalLine[] = [blank(), heading(`  SCHALTER 7 — Personalreport vom ${heute}`), sep()]

  out.push(label(`      ${pad("Vorname", 12)} ${pad("Nachname", 12)} ${pad("Abteilung", 14)} ${"Eintritt"}   ${"Jahre"}  ${"Gehalt"}`))
  out.push({ text: "  " + "─".repeat(68), type: "sep" })

  const sorted = [...aktive].sort((a, b) => a.abteilung.localeCompare(b.abteilung) || a.nachname.localeCompare(b.nachname))
  sorted.forEach((m, i) => {
    out.push(line(`  ${padr(String(i + 1), 3)}. ${pad(m.vorname, 12)} ${pad(m.nachname, 12)} ${pad(m.abteilung, 14)} ${fmtDate(m.eintritt)}  ${padr(String(dienstjahre(m)), 5)}  € ${padr(fmtEuro(m.gehalt), 6)}`))
  })

  out.push({ text: "  " + "─".repeat(68), type: "sep" })
  out.push(line(`  Aktiv:      ${aktive.length}`))
  out.push(line(`  Inaktiv:    ${inaktive.length}`))
  out.push(line(`  Gesamt:     ${archiv.length}`))
  const avgGehalt = aktive.reduce((s, m) => s + m.gehalt, 0) / aktive.length
  const avgJahre = aktive.reduce((s, m) => s + dienstjahre(m), 0) / aktive.length
  out.push(line(`  ∅ Gehalt:   € ${fmtEuro(avgGehalt)}`))
  out.push(line(`  ∅ Dienstj.: ${avgJahre.toFixed(1)} Jahre`))
  out.push(sep())
  return out
}
