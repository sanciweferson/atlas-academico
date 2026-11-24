"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Clock3, X } from "lucide-react"

type Props = { id: string; value: string; onChange: (time: string) => void }
const pad = (value: number) => String(value).padStart(2, "0")
const hours = Array.from({ length: 24 }, (_, i) => pad(i))
const minutes = Array.from({ length: 60 }, (_, i) => pad(i))

export default function AtlasTimePicker({ id, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState("09")
  const [minute, setMinute] = useState("00")

  const setOpenWithValue = (next: boolean) => {
    if (next) {
      const current = /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : "09:00"
      setHour(current.slice(0, 2))
      setMinute(current.slice(3, 5))
    }
    setOpen(next)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpenWithValue}>
      <Dialog.Trigger asChild>
        <button id={id} type="button" className="field atlas-v31-time-trigger" aria-label={`Horário selecionado: ${value || "nenhum"}. Escolher horário`}>
          <Clock3 size={19} aria-hidden="true" />
          <span>{value || "Escolher horário"}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="atlas-v31-dialog-overlay" />
        <Dialog.Content className="atlas-v31-dialog-content atlas-v31-time-modal" aria-describedby="atlas-v31-time-help">
          <div className="atlas-v31-time-heading">
            <Dialog.Title>Escolher horário</Dialog.Title>
            <Dialog.Close className="atlas-v31-time-close" aria-label="Fechar seletor de horário"><X size={21}/></Dialog.Close>
          </div>
          <Dialog.Description id="atlas-v31-time-help" className="atlas-v31-dialog-description">
            Defina a hora e os minutos no formato de 24 horas.
          </Dialog.Description>
          <div className="atlas-v31-time-fields">
            <label htmlFor="atlas-v31-hour">Horas (00–23)
              <select className="field" id="atlas-v31-hour" value={hour} onChange={(e) => setHour(e.target.value)}>
                {hours.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </label>
            <span aria-hidden="true" className="atlas-v31-time-colon">:</span>
            <label htmlFor="atlas-v31-minute">Minutos (00–59)
              <select className="field" id="atlas-v31-minute" value={minute} onChange={(e) => setMinute(e.target.value)}>
                {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
          </div>
          <p className="atlas-v31-time-result">Horário: <strong>{hour}:{minute}</strong></p>
          <div className="atlas-v31-dialog-actions">
            <Dialog.Close asChild><button type="button" className="btn-secondary">Cancelar</button></Dialog.Close>
            <button type="button" className="btn" onClick={() => { onChange(`${hour}:${minute}`); setOpen(false) }}>Confirmar horário</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
