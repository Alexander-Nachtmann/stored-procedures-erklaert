export type Mitarbeiter = {
  vorname: string
  nachname: string
  abteilung: string
  eintritt: string
  gehalt: number
  aktiv: boolean
}

export const initialMitarbeiter: Mitarbeiter[] = [
  { vorname: "Maria",    nachname: "Huber",   abteilung: "HR",          eintritt: "2019-03-15", gehalt: 3200, aktiv: true },
  { vorname: "Franz",    nachname: "Gruber",  abteilung: "HR",          eintritt: "2021-07-01", gehalt: 2900, aktiv: true },
  { vorname: "Anna",     nachname: "Steiner", abteilung: "Buchhaltung", eintritt: "2018-01-10", gehalt: 3500, aktiv: true },
  { vorname: "Johann",   nachname: "Wimmer",  abteilung: "IT",          eintritt: "2020-09-22", gehalt: 4100, aktiv: true },
  { vorname: "Theresia", nachname: "Pichler", abteilung: "HR",          eintritt: "2023-02-14", gehalt: 2700, aktiv: true },
  { vorname: "Leopold",  nachname: "Eder",    abteilung: "Buchhaltung", eintritt: "2017-05-03", gehalt: 3800, aktiv: true },
  { vorname: "Helga",    nachname: "Moser",   abteilung: "IT",          eintritt: "2022-11-08", gehalt: 3900, aktiv: false },
  { vorname: "Karl",     nachname: "Bauer",   abteilung: "HR",          eintritt: "2024-06-30", gehalt: 2600, aktiv: true },
  { vorname: "Elfriede", nachname: "Koller",  abteilung: "Buchhaltung", eintritt: "2016-08-12", gehalt: 4200, aktiv: true },
  { vorname: "Gertrude", nachname: "Hofer",   abteilung: "IT",          eintritt: "2025-01-15", gehalt: 3600, aktiv: true },
  { vorname: "Rudolf",   nachname: "Berger",  abteilung: "HR",          eintritt: "2020-04-01", gehalt: 3100, aktiv: false },
  { vorname: "Ingeborg", nachname: "Wolf",    abteilung: "Buchhaltung", eintritt: "2022-03-20", gehalt: 3300, aktiv: true },
]

export const abteilungen = ["HR", "Buchhaltung", "IT"] as const

export function dienstjahre(m: Mitarbeiter): number {
  const heute = new Date()
  const eintritt = new Date(m.eintritt)
  let j = heute.getFullYear() - eintritt.getFullYear()
  const test = new Date(eintritt)
  test.setFullYear(test.getFullYear() + j)
  if (test > heute) j--
  return j
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function fmtEuro(n: number): string {
  return n.toLocaleString("de-AT", { maximumFractionDigits: 0 })
}
