using System;
using System.Collections.Generic;
using System.Linq;

// ════════════════════════════════════════════════════════════════
//  STORED PROCEDURES — VOM MELDEAMT ZUM MEISTER
//
//  Hallo! 👋
//
//  Das hier ist ein kleines Programm das dir zeigt was eine
//  "Stored Procedure" eigentlich ist. Du musst NICHTS
//  installieren.
//
//  So geht's:
//    1. Öffne https://dotnetfiddle.net im Browser
//    2. Lösch den Text der dort steht
//    3. Kopier ALLES hier rein (Strg+A, Strg+C, Strg+V)
//    4. Klick auf den grünen ▶ Run Knopf
//    5. Schau unten auf die Ausgabe
//
//  Viel Spaß! 🎓
// ════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────
//  DAS ARCHIV — unsere "Datenbank"
//
//  Stell dir vor: das ist der Aktenschrank im Keller vom
//  Personalamt. Da liegen alle Mitarbeiter-Akten drin.
//  DU darfst da nicht rein. Nur der Beamte darf das.
// ────────────────────────────────────────────────────────────────

var mitarbeiter = new List<Mitarbeiter>
{
    new("Maria",    "Huber",    "HR",           new(2019,  3, 15), 3200m, true),
    new("Franz",    "Gruber",   "HR",           new(2021,  7,  1), 2900m, true),
    new("Anna",     "Steiner",  "Buchhaltung",  new(2018,  1, 10), 3500m, true),
    new("Johann",   "Wimmer",   "IT",           new(2020,  9, 22), 4100m, true),
    new("Theresia", "Pichler",  "HR",           new(2023,  2, 14), 2700m, true),
    new("Leopold",  "Eder",     "Buchhaltung",  new(2017,  5,  3), 3800m, true),
    new("Helga",    "Moser",    "IT",           new(2022, 11,  8), 3900m, false),
    new("Karl",     "Bauer",    "HR",           new(2024,  6, 30), 2600m, true),
    new("Elfriede", "Koller",   "Buchhaltung",  new(2016,  8, 12), 4200m, true),
    new("Gertrude", "Hofer",    "IT",           new(2025,  1, 15), 3600m, true),
    new("Rudolf",   "Berger",   "HR",           new(2020,  4,  1), 3100m, false),
    new("Ingeborg", "Wolf",     "Buchhaltung",  new(2022,  3, 20), 3300m, true),
};

// ════════════════════════════════════════════════════════════════
//  WIE IM MELDEAMT: Du gehst zum Schalter, sagst was du
//  brauchst, und der Beamte erledigt das für dich.
//
//  Du gehst NICHT ins Archiv. Du SIEHST das Archiv nicht.
//  Du sagst nur: "Ich brauch die Liste von HR" — fertig.
//
//  Jeder Schalter unten = eine Stored Procedure.
// ════════════════════════════════════════════════════════════════

Trennlinie();
Console.WriteLine("  🏛️  WILLKOMMEN AM PERSONALAMT");
Console.WriteLine("  Heute zeigen wir dir 7 Schalter.");
Console.WriteLine("  Jeder Schalter = eine Stored Procedure.");
Trennlinie();

// ── SCHALTER 1 ──────────────────────────────────────────────
// Du sagst: "Ich brauch alle aus der HR."
// Der Beamte sucht im Archiv und gibt dir die Liste.
// Du hast das Archiv nie gesehen.

Schalter(1, "Wer arbeitet in HR?",
    "Du sagst: 'Abteilung: HR bitte.'");

MitarbeiterNachAbteilung(mitarbeiter, "HR");

// ── SCHALTER 2 ──────────────────────────────────────────────
// Du sagst: "Wer wurde seit 2022 eingestellt?"
// Andere Frage, anderer Schalter, selbes Archiv.

Schalter(2, "Eingestellt seit 2022?",
    "Du sagst: 'Alle neuen seit 2022 bitte.'");

EingestelltSeit(mitarbeiter, new DateTime(2022, 1, 1));

// ── SCHALTER 3 ──────────────────────────────────────────────
// Jetzt wird gerechnet. Du fragst nach Zahlen —
// der Beamte rechnet, du kriegst das Ergebnis.
// Wie beim Finanzamt: die rechnen, du unterschreibst.

Schalter(3, "Gehaltsübersicht pro Abteilung",
    "Wie beim Finanzamt: du fragst, die rechnen.");

GehaltsübersichtProAbteilung(mitarbeiter);

// ── SCHALTER 4 ──────────────────────────────────────────────
// Jetzt legst du jemanden NEU an. Du gibst die Daten ab,
// der Beamte PRÜFT alles, und DANN erst wird der Akt angelegt.

Schalter(4, "Neue Mitarbeiterin anlegen",
    "Du gibst das Formular ab. Der Beamte prüft.");

NeuenMitarbeiterAnlegen(mitarbeiter,
    "Margarethe", "Rauch", "HR", new(2026, 4, 1), 2850m);

// ── SCHALTER 5 ──────────────────────────────────────────────
// Was passiert bei Blödsinn? Der Beamte sagt "Na!"
// DAS ist Sicherheit. Die Procedure schützt die Daten.

Schalter(5, "Was wenn man Blödsinn eingibt?",
    "Drei Versuche, drei Mal 'Na!'");

NeuenMitarbeiterAnlegen(mitarbeiter,
    "", "Geist", "HR", new(2026, 1, 1), 2500m);

NeuenMitarbeiterAnlegen(mitarbeiter,
    "Test", "Tester", "HR", new(2026, 1, 1), -500m);

NeuenMitarbeiterAnlegen(mitarbeiter,
    "Maria", "Huber", "HR", new(2026, 1, 1), 3000m);

// ── SCHALTER 6 ──────────────────────────────────────────────
// Jubilare! Wer ist schon lange dabei?
// Du fragst, der Beamte rechnet die Jahre aus.

Schalter(6, "Dienstjubiläen — wer ist 5+ Jahre dabei?",
    "Du fragst: 'Wer feiert heuer Jubiläum?'");

Jubilare(mitarbeiter, jahre: 5);

// ── SCHALTER 7 ──────────────────────────────────────────────
// Der Chef-Schalter: Alle aktiven Mitarbeiter, schön sortiert,
// mit Dienstjahren. Ein Bericht auf Knopfdruck.

Schalter(7, "Kompletter Personalreport",
    "Ein Knopf, ein Bericht. Jedes Monat gleich.");

Personalreport(mitarbeiter);

// ════════════════════════════════════════════════════════════════
//  🎤 DAS WAR'S!
// ════════════════════════════════════════════════════════════════

Console.WriteLine();
Trennlinie();
Console.WriteLine("  🎓 GESCHAFFT!");
Console.WriteLine();
Console.WriteLine("  Du hast gerade 7 Stored Procedures benutzt.");
Console.WriteLine();
Console.WriteLine("  Jedes Mal wenn du in Workday, SAP oder BambooHR");
Console.WriteLine("  auf 'Report erstellen' klickst — passiert genau");
Console.WriteLine("  das was du gerade gesehen hast.");
Console.WriteLine();
Console.WriteLine("  Der Knopf = der Schalter");
Console.WriteLine("  Das System = der Beamte");
Console.WriteLine("  Die Datenbank = das Archiv");
Console.WriteLine("  Du = du. Und du machst das richtig. ✓");
Trennlinie();

// ════════════════════════════════════════════════════════════════
//
//  AB HIER: DER CODE "HINTER DEM SCHALTER"
//
//  Das sind die Beamten. Du musst das nicht verstehen.
//  Aber wenn du neugierig bist — schau ruhig rein.
//  Alles was mit // anfängt ist ein Kommentar für dich.
//
// ════════════════════════════════════════════════════════════════

// ── Procedure 1: Mitarbeiter nach Abteilung ─────────────────

static void MitarbeiterNachAbteilung(List<Mitarbeiter> archiv, string abteilung)
{
    var ergebnis = archiv
        .Where(m => m.Abteilung == abteilung && m.Aktiv)
        .OrderBy(m => m.Nachname);

    foreach (var m in ergebnis)
    {
        var jahre = Dienstjahre(m);
        Console.WriteLine(
            $"    {m.Vorname,-12} {m.Nachname,-12} seit {m.Eintritt:dd.MM.yyyy}  ({jahre} Jahre)");
    }

    Console.WriteLine($"\n    → {ergebnis.Count()} aktive Mitarbeiter in {abteilung}");
}

// ── Procedure 2: Eingestellt seit Datum ─────────────────────

static void EingestelltSeit(List<Mitarbeiter> archiv, DateTime seit)
{
    var ergebnis = archiv
        .Where(m => m.Eintritt >= seit)
        .OrderBy(m => m.Eintritt);

    foreach (var m in ergebnis)
    {
        Console.WriteLine(
            $"    {m.Vorname,-12} {m.Nachname,-12} {m.Abteilung,-14} {m.Eintritt:dd.MM.yyyy}");
    }

    Console.WriteLine($"\n    → {ergebnis.Count()} Personen seit {seit:dd.MM.yyyy} eingestellt");
}

// ── Procedure 3: Gehaltsübersicht ───────────────────────────

static void GehaltsübersichtProAbteilung(List<Mitarbeiter> archiv)
{
    var gruppen = archiv
        .Where(m => m.Aktiv)
        .GroupBy(m => m.Abteilung)
        .OrderBy(g => g.Key);

    foreach (var g in gruppen)
    {
        var anzahl = g.Count();
        var schnitt = g.Average(m => m.Gehalt);
        var gesamt = g.Sum(m => m.Gehalt);

        Console.WriteLine($"    📁 {g.Key}");
        Console.WriteLine($"       Köpfe:          {anzahl}");
        Console.WriteLine($"       Durchschnitt:   € {schnitt:N0}");
        Console.WriteLine($"       Monatskosten:   € {gesamt:N0}");
        Console.WriteLine($"       Jahreskosten:   € {gesamt * 14:N0}  (14 Gehälter)");
        Console.WriteLine();
    }

    Console.WriteLine($"    → Gesamtkosten/Jahr: € {archiv.Where(m => m.Aktiv).Sum(m => m.Gehalt) * 14:N0}");
}

// ── Procedure 4 & 5: Neuen Mitarbeiter anlegen ──────────────

static void NeuenMitarbeiterAnlegen(
    List<Mitarbeiter> archiv,
    string vorname, string nachname,
    string abteilung, DateTime eintritt, decimal gehalt)
{
    // PRÜFUNG 1: Name muss ausgefüllt sein
    if (string.IsNullOrWhiteSpace(vorname))
    {
        Console.WriteLine("    ✗ ABGELEHNT: Vorname fehlt. Bitte Formular neu ausfüllen.");
        return;
    }

    // PRÜFUNG 2: Gehalt muss positiv sein
    if (gehalt <= 0)
    {
        Console.WriteLine($"    ✗ ABGELEHNT: Gehalt € {gehalt:N0}? Des geht ned.");
        return;
    }

    // PRÜFUNG 3: Kein Duplikat
    if (archiv.Any(m => m.Vorname == vorname && m.Nachname == nachname))
    {
        Console.WriteLine($"    ✗ ABGELEHNT: {vorname} {nachname} gibt's schon im System.");
        return;
    }

    // PRÜFUNG 4: Gültige Abteilung
    var gültigeAbteilungen = archiv.Select(m => m.Abteilung).Distinct().ToList();
    if (!gültigeAbteilungen.Contains(abteilung))
    {
        Console.WriteLine($"    ✗ ABGELEHNT: Abteilung '{abteilung}' existiert nicht.");
        Console.WriteLine($"      Gültig: {string.Join(", ", gültigeAbteilungen)}");
        return;
    }

    // Alles passt → anlegen
    archiv.Add(new(vorname, nachname, abteilung, eintritt, gehalt, true));
    Console.WriteLine($"    ✓ ANGELEGT: {vorname} {nachname}");
    Console.WriteLine($"      Abteilung: {abteilung}");
    Console.WriteLine($"      Eintritt:  {eintritt:dd.MM.yyyy}");
    Console.WriteLine($"      Gehalt:    € {gehalt:N0}");
}

// ── Procedure 6: Jubilare ───────────────────────────────────

static void Jubilare(List<Mitarbeiter> archiv, int jahre)
{
    var jubilare = archiv
        .Where(m => m.Aktiv && Dienstjahre(m) >= jahre)
        .OrderByDescending(m => Dienstjahre(m));

    foreach (var m in jubilare)
    {
        var dj = Dienstjahre(m);
        var stern = dj >= 8 ? " ⭐" : dj >= 5 ? " ✦" : "";
        Console.WriteLine(
            $"    {m.Vorname,-12} {m.Nachname,-12} {dj,2} Jahre  (seit {m.Eintritt:dd.MM.yyyy}){stern}");
    }

    Console.WriteLine($"\n    → {jubilare.Count()} Mitarbeiter mit {jahre}+ Dienstjahren");
}

// ── Procedure 7: Kompletter Personalreport ──────────────────

static void Personalreport(List<Mitarbeiter> archiv)
{
    var aktive = archiv.Where(m => m.Aktiv).ToList();
    var inaktive = archiv.Where(m => !m.Aktiv).ToList();

    Console.WriteLine($"    PERSONALREPORT — Stand {DateTime.Today:dd.MM.yyyy}");
    Console.WriteLine($"    {"",4}{"Vorname",-12} {"Nachname",-12} {"Abteilung",-14} {"Eintritt",10}  {"Jahre",5}  {"Gehalt",8}");
    Console.WriteLine($"    {"",4}{new string('─', 67)}");

    var nr = 1;
    foreach (var m in aktive.OrderBy(m => m.Abteilung).ThenBy(m => m.Nachname))
    {
        Console.WriteLine(
            $"    {nr,3}. {m.Vorname,-12} {m.Nachname,-12} {m.Abteilung,-14} {m.Eintritt:dd.MM.yyyy}  {Dienstjahre(m),5}  € {m.Gehalt,6:N0}");
        nr++;
    }

    Console.WriteLine($"    {"",4}{new string('─', 67)}");
    Console.WriteLine($"    Aktiv:      {aktive.Count}");
    Console.WriteLine($"    Inaktiv:    {inaktive.Count}");
    Console.WriteLine($"    Gesamt:     {archiv.Count}");
    Console.WriteLine($"    ∅ Gehalt:   € {aktive.Average(m => m.Gehalt):N0}");
    Console.WriteLine($"    ∅ Dienstj.: {aktive.Average(m => (double)Dienstjahre(m)):N1} Jahre");
}

// ── Hilfsfunktionen ─────────────────────────────────────────

static int Dienstjahre(Mitarbeiter m)
{
    var heute = DateTime.Today;
    var jahre = heute.Year - m.Eintritt.Year;
    if (m.Eintritt.Date > heute.AddYears(-jahre)) jahre--;
    return jahre;
}

static void Trennlinie()
{
    Console.WriteLine("  ══════════════════════════════════════════════════");
}

static void Schalter(int nr, string titel, string beschreibung)
{
    Console.WriteLine();
    Console.WriteLine($"  ── SCHALTER {nr} ─────────────────────────────────");
    Console.WriteLine($"  {titel}");
    Console.WriteLine($"  {beschreibung}");
    Console.WriteLine();
}

// ── Der Datensatz ───────────────────────────────────────────
// So schaut ein Mitarbeiter-Akt aus.

record Mitarbeiter(
    string Vorname,
    string Nachname,
    string Abteilung,
    DateTime Eintritt,
    decimal Gehalt,
    bool Aktiv);
