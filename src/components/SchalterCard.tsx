import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

type Props = {
  nr: number
  title: string
  description: string
  children?: ReactNode
  buttonLabel?: string
  onRun: () => void
}

export function SchalterCard({ nr, title, description, children, buttonLabel = "Ausführen", onRun }: Props) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center p-0 text-xs">
            {nr}
          </Badge>
          <CardTitle className="text-[15px]">{title}</CardTitle>
        </div>
        <CardDescription className="text-[13px] mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0 mt-auto">
        {children}
        <Button variant="destructive" className="w-full" onClick={onRun}>
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
