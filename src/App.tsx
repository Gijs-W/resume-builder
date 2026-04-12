import { useState, useRef, useEffect } from 'react'
import './App.css'

// ── Types ────────────────────────────────────────────────────
interface Personal {
  name: string
  picture: string
  photoWidth: number
  addressLabel: string
  address: string
  phoneLabel: string
  phone: string
  emailLabel: string
  email: string
  birthdateLabel: string
  birthdate: string
  genderLabel: string
  gender: string
  nationalityLabel: string
  nationality: string
}

interface WorkItem {
  id: string
  from: string
  to: string
  jobTitle: string
  company: string
  description: string
  pageBreakBefore?: boolean
}

interface EduItem {
  id: string
  from: string
  to: string
  studyTitle: string
  school: string
  description: string
  pageBreakBefore?: boolean
}

interface SkillItem {
  id: string
  name: string
}

interface ResumeData {
  personal: Personal
  summary: string
  workTitle: string
  eduTitle: string
  skillsTitle: string
  workPageBreak: boolean
  eduPageBreak: boolean
  skillsPageBreak: boolean
  work: WorkItem[]
  education: EduItem[]
  skills: SkillItem[]
}

// ── Defaults ─────────────────────────────────────────────────
const DEFAULT: ResumeData = {
  personal: {
    name: 'Full Name',
    picture: '',
    photoWidth: 96,
    addressLabel: 'Address',
    address: 'City, Country',
    phoneLabel: 'Phone',
    phone: '+00 000 000 0000',
    emailLabel: 'Email',
    email: 'email@example.com',
    birthdateLabel: 'Date of birth',
    birthdate: '01/01/1990',
    genderLabel: 'Gender',
    gender: 'Gender',
    nationalityLabel: 'Nationality',
    nationality: 'Nationality',
  },
  summary: '',
  workTitle: 'Work Experience',
  eduTitle: 'Education',
  skillsTitle: 'Skills',
  workPageBreak: false,
  eduPageBreak: false,
  skillsPageBreak: false,
  work: [
    {
      id: '1',
      from: '2020',
      to: 'Present',
      jobTitle: 'Job Title',
      company: 'Company Name',
      description: 'Brief description of your role and key achievements.',
    },
  ],
  education: [
    {
      id: '1',
      from: '2016',
      to: '2020',
      studyTitle: 'Bachelor of Science',
      school: 'University Name',
      description: '',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'TypeScript' },
    { id: '3', name: 'React' },
  ],
}

// ── Icons ─────────────────────────────────────────────────────
const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1a5 5 0 0 0-5 5c0 3.5 4.5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
  </svg>
)
const IconPhone = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58L3.654 1.328z" />
  </svg>
)
const IconEmail = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z" />
  </svg>
)
const IconCalendar = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
  </svg>
)
const IconPerson = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.029 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
  </svg>
)
const IconGlobe = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
  </svg>
)

// ── Helpers ──────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function load(): ResumeData {
  try {
    const s = localStorage.getItem('resume')
    if (s) {
      const p = JSON.parse(s)
      // Merge with defaults so new fields are populated for existing users
      return { ...DEFAULT, ...p, personal: { ...DEFAULT.personal, ...p.personal } }
    }
  } catch {}
  return DEFAULT
}

// ── Sub-components ────────────────────────────────────────────

function AutoTextarea({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  className?: string
  placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={className}
      placeholder={placeholder}
      rows={1}
    />
  )
}

function ContactRow({
  icon,
  label,
  value,
  onLabel,
  onValue,
  placeholder,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onLabel: (v: string) => void
  onValue: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="contact-row">
      <span className="contact-icon">{icon}</span>
      <input
        className="f contact-label"
        value={label}
        onChange={e => onLabel(e.target.value)}
      />
      <input
        className="f contact-value"
        value={value}
        onChange={e => onValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function PageBreakToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  if (active) {
    return (
      <div className="pb-line no-print">
        <span className="pb-label">Page break</span>
        <button className="pb-remove" onClick={onToggle} title="Remove page break">×</button>
      </div>
    )
  }
  return (
    <button className="pb-add no-print" onClick={onToggle} title="Add page break here">
      page break
    </button>
  )
}

function ResizablePhoto({
  src,
  width,
  onWidthChange,
  onUpload,
}: {
  src: string
  width: number
  onWidthChange: (w: number) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const startX = useRef(0)
  const startW = useRef(0)

  const onHandleDown = (e: React.MouseEvent) => {
    e.preventDefault()
    startX.current = e.clientX
    startW.current = width
    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX.current
      onWidthChange(Math.max(50, Math.min(200, startW.current + delta)))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className={`photo-container ${!src ? 'empty' : ''}`}
      style={{ width, height: width }}
    >
      <div className="photo-wrap no-print" onClick={() => inputRef.current?.click()}>
        {src ? (
          <>
            <img src={src} className="photo" alt="" />
            <span className="photo-overlay">Change photo</span>
          </>
        ) : (
          <span className="photo-placeholder">Click to add photo</span>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} />
      </div>
      {src && <img src={src} className="photo print-only" alt="" />}
      <div className="resize-handle no-print" onMouseDown={onHandleDown} />
    </div>
  )
}

// ── App ──────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState<ResumeData>(load)
  const [newSkill, setNewSkill] = useState('')
  const importRef = useRef<HTMLInputElement>(null)

  const onExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target!.result as string)
        setData({ ...DEFAULT, ...parsed, personal: { ...DEFAULT.personal, ...parsed.personal } })
      } catch {
        alert('Invalid JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const onClear = () => {
    if (confirm('Clear all resume data?')) setData(DEFAULT)
  }

  useEffect(() => {
    localStorage.setItem('resume', JSON.stringify(data))
  }, [data])

  const setPersonal = (field: keyof Personal, value: string) =>
    setData(d => ({ ...d, personal: { ...d.personal, [field]: value } }))

  const resizePhoto = (w: number) =>
    setData(d => ({ ...d, personal: { ...d.personal, photoWidth: w } }))

  const onPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPersonal('picture', ev.target!.result as string)
    reader.readAsDataURL(file)
  }

  const toggleSectionBreak = (key: 'workPageBreak' | 'eduPageBreak' | 'skillsPageBreak') =>
    setData(d => ({ ...d, [key]: !d[key] }))

  const toggleWorkBreak = (id: string) =>
    setData(d => ({
      ...d,
      work: d.work.map(w => (w.id === id ? { ...w, pageBreakBefore: !w.pageBreakBefore } : w)),
    }))

  const toggleEduBreak = (id: string) =>
    setData(d => ({
      ...d,
      education: d.education.map(e =>
        e.id === id ? { ...e, pageBreakBefore: !e.pageBreakBefore } : e,
      ),
    }))

  const setWork = (id: string, field: keyof WorkItem, value: string) =>
    setData(d => ({
      ...d,
      work: d.work.map(w => (w.id === id ? { ...w, [field]: value } : w)),
    }))

  const addWork = () =>
    setData(d => ({
      ...d,
      work: [...d.work, { id: uid(), from: '', to: '', jobTitle: '', company: '', description: '' }],
    }))

  const removeWork = (id: string) =>
    setData(d => ({ ...d, work: d.work.filter(w => w.id !== id) }))

  const setEdu = (id: string, field: keyof EduItem, value: string) =>
    setData(d => ({
      ...d,
      education: d.education.map(e => (e.id === id ? { ...e, [field]: value } : e)),
    }))

  const addEdu = () =>
    setData(d => ({
      ...d,
      education: [
        ...d.education,
        { id: uid(), from: '', to: '', studyTitle: '', school: '', description: '' },
      ],
    }))

  const removeEdu = (id: string) =>
    setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }))

  const addSkill = () => {
    const name = newSkill.trim()
    if (!name) return
    setData(d => ({ ...d, skills: [...d.skills, { id: uid(), name }] }))
    setNewSkill('')
  }

  const removeSkill = (id: string) =>
    setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }))

  const p = data.personal

  return (
    <>
    <div className="toolbar no-print">
      <div className="toolbar-group">
        <button className="toolbar-btn toolbar-danger" onClick={onClear}>Clear</button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => importRef.current?.click()}>Import JSON</button>
        <button className="toolbar-btn" onClick={onExport}>Export JSON</button>
        <input ref={importRef} type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
      </div>
      <div className="toolbar-group">
        <button className="toolbar-btn toolbar-primary" onClick={() => window.print()}>Save as PDF</button>
      </div>
    </div>
    <div className="page-bg">
      <div className="resume">

        {/* ── Personal ─────────────────────────────────── */}
        <header className="personal">
          <ResizablePhoto
            src={p.picture}
            width={p.photoWidth}
            onWidthChange={resizePhoto}
            onUpload={onPicture}
          />

          <div className="personal-info">
            <input
              className="f name"
              value={p.name}
              onChange={e => setPersonal('name', e.target.value)}
            />

            <div className="contact-group">
              <ContactRow
                icon={<IconPin />}
                label={p.addressLabel}
                value={p.address}
                onLabel={v => setPersonal('addressLabel', v)}
                onValue={v => setPersonal('address', v)}
              />
              <ContactRow
                icon={<IconPhone />}
                label={p.phoneLabel}
                value={p.phone}
                onLabel={v => setPersonal('phoneLabel', v)}
                onValue={v => setPersonal('phone', v)}
              />
              <ContactRow
                icon={<IconEmail />}
                label={p.emailLabel}
                value={p.email}
                onLabel={v => setPersonal('emailLabel', v)}
                onValue={v => setPersonal('email', v)}
              />
            </div>

            <div className="contact-group details-group">
              <ContactRow
                icon={<IconCalendar />}
                label={p.birthdateLabel}
                value={p.birthdate}
                onLabel={v => setPersonal('birthdateLabel', v)}
                onValue={v => setPersonal('birthdate', v)}
              />
              <ContactRow
                icon={<IconPerson />}
                label={p.genderLabel}
                value={p.gender}
                onLabel={v => setPersonal('genderLabel', v)}
                onValue={v => setPersonal('gender', v)}
              />
              <ContactRow
                icon={<IconGlobe />}
                label={p.nationalityLabel}
                value={p.nationality}
                onLabel={v => setPersonal('nationalityLabel', v)}
                onValue={v => setPersonal('nationality', v)}
              />
            </div>
          </div>
        </header>

        {/* ── Summary ──────────────────────────────────── */}
        {(data.summary || true) && (
          <div className={`summary-section ${!data.summary ? 'summary-empty' : ''}`}>
            <AutoTextarea
              className="f summary-text"
              value={data.summary}
              onChange={v => setData(d => ({ ...d, summary: v }))}
              placeholder="Write a short career summary…"
            />
          </div>
        )}

        {/* ── Work Experience ───────────────────────────── */}
        <section className={`section ${data.workPageBreak ? 'break-before' : ''}`}>
          <PageBreakToggle
            active={data.workPageBreak}
            onToggle={() => toggleSectionBreak('workPageBreak')}
          />
          <input
            className="f section-title"
            value={data.workTitle}
            onChange={e => setData(d => ({ ...d, workTitle: e.target.value }))}
          />
          <hr className="divider" />
          {data.work.map(w => (
            <div key={w.id} className={`row-wrap ${w.pageBreakBefore ? 'break-before' : ''}`}>
              <PageBreakToggle
                active={!!w.pageBreakBefore}
                onToggle={() => toggleWorkBreak(w.id)}
              />
              <div className="row">
                <div className="dates">
                  <input
                    className="f date"
                    value={w.from}
                    onChange={e => setWork(w.id, 'from', e.target.value)}
                    placeholder="From"
                  />
                  <span className="date-sep">–</span>
                  <input
                    className="f date"
                    value={w.to}
                    onChange={e => setWork(w.id, 'to', e.target.value)}
                    placeholder="To"
                  />
                </div>
                <div className="col-content">
                  <input
                    className="f bold"
                    value={w.jobTitle}
                    onChange={e => setWork(w.id, 'jobTitle', e.target.value)}
                    placeholder="Job Title"
                  />
                  <input
                    className="f sub"
                    value={w.company}
                    onChange={e => setWork(w.id, 'company', e.target.value)}
                    placeholder="Company"
                  />
                  <AutoTextarea
                    className="f desc"
                    value={w.description}
                    onChange={v => setWork(w.id, 'description', v)}
                    placeholder="Description"
                  />
                </div>
                <button className="del no-print" onClick={() => removeWork(w.id)}>×</button>
              </div>
            </div>
          ))}
          <button className="add no-print" onClick={addWork}>+ Add</button>
        </section>

        {/* ── Education ─────────────────────────────────── */}
        <section className={`section ${data.eduPageBreak ? 'break-before' : ''}`}>
          <PageBreakToggle
            active={data.eduPageBreak}
            onToggle={() => toggleSectionBreak('eduPageBreak')}
          />
          <input
            className="f section-title"
            value={data.eduTitle}
            onChange={e => setData(d => ({ ...d, eduTitle: e.target.value }))}
          />
          <hr className="divider" />
          {data.education.map(e => (
            <div key={e.id} className={`row-wrap ${e.pageBreakBefore ? 'break-before' : ''}`}>
              <PageBreakToggle
                active={!!e.pageBreakBefore}
                onToggle={() => toggleEduBreak(e.id)}
              />
              <div className="row">
                <div className="dates">
                  <input
                    className="f date"
                    value={e.from}
                    onChange={ev => setEdu(e.id, 'from', ev.target.value)}
                    placeholder="From"
                  />
                  <span className="date-sep">–</span>
                  <input
                    className="f date"
                    value={e.to}
                    onChange={ev => setEdu(e.id, 'to', ev.target.value)}
                    placeholder="To"
                  />
                </div>
                <div className="col-content">
                  <input
                    className="f bold"
                    value={e.studyTitle}
                    onChange={ev => setEdu(e.id, 'studyTitle', ev.target.value)}
                    placeholder="Degree"
                  />
                  <input
                    className="f sub"
                    value={e.school}
                    onChange={ev => setEdu(e.id, 'school', ev.target.value)}
                    placeholder="School"
                  />
                  <AutoTextarea
                    className="f desc"
                    value={e.description}
                    onChange={v => setEdu(e.id, 'description', v)}
                    placeholder="Description"
                  />
                </div>
                <button className="del no-print" onClick={() => removeEdu(e.id)}>×</button>
              </div>
            </div>
          ))}
          <button className="add no-print" onClick={addEdu}>+ Add</button>
        </section>

        {/* ── Skills ───────────────────────────────────── */}
        <section className={`section ${data.skillsPageBreak ? 'break-before' : ''}`}>
          <PageBreakToggle
            active={data.skillsPageBreak}
            onToggle={() => toggleSectionBreak('skillsPageBreak')}
          />
          <input
            className="f section-title"
            value={data.skillsTitle}
            onChange={e => setData(d => ({ ...d, skillsTitle: e.target.value }))}
          />
          <hr className="divider" />
          <div className="chips">
            {data.skills.map(s => (
              <span key={s.id} className="chip">
                {s.name}
                <button className="chip-del no-print" onClick={() => removeSkill(s.id)}>×</button>
              </span>
            ))}
            <div className="chip-add no-print">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Add skill…"
              />
              <button onClick={addSkill}>+</button>
            </div>
          </div>
        </section>

      </div>
    </div>
    </>
  )
}
