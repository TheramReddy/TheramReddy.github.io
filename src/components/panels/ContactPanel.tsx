import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, Check } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/arc/dialog/dialog'
import { Input } from '@/components/arc/input/input'
import { Button } from '@/components/arc/button/button'
import { DatePicker } from '@/components/arc/date-picker/date-picker'
import { FileDropzone } from '@/components/arc/file-dropzone/file-dropzone'
import { CONFETTI } from '@/components/layout/confetti'
import '@/components/arc/foundation.css'

type Errors = { name?: string; phone?: string; email?: string }

export function ContactPanel({ open }: { open: boolean }) {
  const navigate = useNavigate()
  const [date, setDate] = useState<Date>()
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const onModalChange = (next: boolean) => {
    if (next) return
    navigate('/')
    setTimeout(() => { setSent(false); setErrors({}); setDate(undefined); setFiles([]) }, 300)
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const next: Errors = {}
    if (!name) next.name = 'Please enter your name.'
    if (phone.replace(/\D/g, '').length < 7) next.phone = 'Please enter a valid phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
  }

  return (
    <Dialog open={open} onOpenChange={onModalChange}>
      <DialogContent
        className="arc contact-modal"
        title={sent ? 'Message received' : 'Let’s talk'}
        description={sent ? undefined : 'Tell me who you are, pick a day for a call, and attach anything about your design idea.'}
      >
        {sent ? (
          <div className="contact-done">
            <div className="contact-burst" aria-hidden="true">
              {CONFETTI.map((st, i) => <i key={i} style={st} />)}
            </div>
            <span className="contact-done-icon"><Check size={22} strokeWidth={2} aria-hidden="true" /></span>
            <p>Thanks, I’ll be in touch{date ? ` around ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` : ''}.</p>
            <Button variant="secondary" onClick={() => onModalChange(false)}>Close</Button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="contact-row">
              <div className="icon-field">
                <User size={16} strokeWidth={1.75} aria-hidden="true" />
                <Input label="Name" name="name" placeholder="Your name" autoComplete="name" error={errors.name} />
              </div>
              <div className="icon-field">
                <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                <Input label="Phone" name="phone" type="tel" placeholder="Phone number" autoComplete="tel" error={errors.phone} />
              </div>
            </div>
            <div className="icon-field">
              <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
              <Input label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email} />
            </div>
            <DatePicker label="Preferred date" placeholder="Pick a date" value={date} onChange={setDate} minDate={new Date()} />
            <FileDropzone
              label="Design ideas & documents"
              description="Drop files here or choose from your device"
              maxFiles={5}
              onFilesChange={setFiles}
            />
            <div className="contact-actions">
              <Button type="button" variant="ghost" onClick={() => onModalChange(false)}>Cancel</Button>
              <Button type="submit">Send</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
