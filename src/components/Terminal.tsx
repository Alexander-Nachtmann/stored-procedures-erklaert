import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export type TerminalLine = {
  text: string
  type?: "heading" | "ok" | "err" | "muted" | "sep" | "label"
}

const styles: Record<string, string> = {
  heading: "text-amber-300 font-semibold",
  ok: "text-emerald-400",
  err: "text-red-400",
  muted: "text-white/25",
  sep: "text-white/10",
  label: "text-violet-300/80",
}

export function Terminal({ lines, onClear }: { lines: TerminalLine[]; onClear: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" })
  }, [lines])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] text-white/30 font-mono tracking-wide">ausgabe</span>
        </div>
        {lines.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-white/30 hover:text-white/60 hover:bg-white/5 text-xs h-7">
            Leeren
          </Button>
        )}
      </div>
      <div
        ref={ref}
        className="bg-[#0f0f11] border border-white/[0.06] rounded-xl p-6 font-mono text-sm leading-7 text-white/70 min-h-[200px] max-h-[500px] overflow-y-auto shadow-2xl shadow-black/50"
      >
        {lines.length === 0 ? (
          <span className="text-white/20">Klick auf einen Schalter um loszulegen ...</span>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`min-h-[1.75em] ${styles[line.type ?? ""] ?? ""}`}>
              {line.text || "\u00A0"}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
