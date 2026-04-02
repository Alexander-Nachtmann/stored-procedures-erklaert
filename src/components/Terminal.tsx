import { useEffect, useRef } from "react"

export type TerminalLine = {
  text: string
  type?: "heading" | "ok" | "err" | "muted" | "sep" | "label"
}

const typeColors: Record<string, string> = {
  heading: "text-amber-400 font-bold",
  ok: "text-emerald-400",
  err: "text-red-400",
  muted: "text-stone-500",
  sep: "text-stone-700",
  label: "text-stone-400",
}

export function Terminal({ lines }: { lines: TerminalLine[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" })
  }, [lines])

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Ausgabe — was der Beamte zurückgibt
      </p>
      <div
        ref={ref}
        className="bg-stone-950 rounded-xl p-5 font-mono text-[13px] leading-7 text-stone-300 max-h-[420px] overflow-y-auto shadow-lg"
      >
        {lines.length === 0 ? (
          <span className="text-stone-600 italic">Klick auf einen Schalter um loszulegen ...</span>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`min-h-[1.4em] animate-in fade-in duration-200 ${typeColors[line.type ?? ""] ?? ""}`}>
              {line.text}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
