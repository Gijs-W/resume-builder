import { useState, useRef, useEffect } from 'react'
import './App.css'

// ── Types ────────────────────────────────────────────────────
interface Personal {
  name: string
  address: string
  email: string
  nationality: string
  birthdate: string
  gender: string
  picture: string
}

interface WorkItem {
  id: string
  from: string
  to: string
  jobTitle: string
  company: string
  description: string
}

interface EduItem {
  id: string
  from: string
  to: string
  studyTitle: string
  school: string
  description: string
}

interface SkillItem {
  id: string
  name: string
}

interface ResumeData {
  personal: Personal
  workTitle: string
  eduTitle: string
  skillsTitle: string
  work: WorkItem[]
  education: EduItem[]
  skills: SkillItem[]
}

// ── Defaults ─────────────────────────────────────────────────
const DEFAULT: ResumeData = {
  personal: {
    name: 'Full Name',
    address: 'City, Country',
    email: 'email@example.com',
    nationality: 'Nationality',
    birthdate: '01/01/1990',
    gender: 'Gender',
    picture: '',
  },
  workTitle: 'Work Experience',
  eduTitle: 'Education',
  skillsTitle: 'Skills',
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

// ── Helpers ──────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function load(): ResumeData {
  try {
    const s = localStorage.getItem('resume')
    if (s) return JSON.parse(s)
  } catch {}
  return DEFAULT
}

// Auto-resizing textarea
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

// ── App ──────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState<ResumeData>(load)
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    localStorage.setItem('resume', JSON.stringify(data))
  }, [data])

  // Personal
  const setPersonal = (field: keyof Personal, value: string) =>
    setData(d => ({ ...d, personal: { ...d.personal, [field]: value } }))

  const onPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPersonal('picture', ev.target!.result as string)
    reader.readAsDataURL(file)
  }

  // Work
  const setWork = (id: string, field: keyof WorkItem, value: string) =>
    setData(d => ({
      ...d,
      work: d.work.map(w => (w.id === id ? { ...w, [field]: value } : w)),
    }))

  const addWork = () =>
    setData(d => ({
      ...d,
      work: [
        ...d.work,
        { id: uid(), from: '', to: '', jobTitle: '', company: '', description: '' },
      ],
    }))

  const removeWork = (id: string) =>
    setData(d => ({ ...d, work: d.work.filter(w => w.id !== id) }))

  // Education
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

  // Skills
  const addSkill = () => {
    const name = newSkill.trim()
    if (!name) return
    setData(d => ({ ...d, skills: [...d.skills, { id: uid(), name }] }))
    setNewSkill('')
  }

  const removeSkill = (id: string) =>
    setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }))

  return (
    <div className="page-bg">
      <div className="resume">

        {/* ── Personal ─────────────────────────────────── */}
        <header className="personal">
          <label className={`photo-wrap ${!data.personal.picture ? 'empty' : ''}`}>
            {data.personal.picture ? (
              <img src={data.personal.picture} className="photo" alt="" />
            ) : (
              <span className="photo-placeholder no-print">Click to add photo</span>
            )}
            <input type="file" accept="image/*" onChange={onPicture} className="no-print" />
          </label>

          <div className="personal-info">
            <input
              className="f name"
              value={data.personal.name}
              onChange={e => setPersonal('name', e.target.value)}
            />
            <div className="personal-row">
              <input
                className="f"
                value={data.personal.address}
                onChange={e => setPersonal('address', e.target.value)}
              />
              <span className="dot">·</span>
              <input
                className="f"
                value={data.personal.email}
                onChange={e => setPersonal('email', e.target.value)}
              />
            </div>
            <div className="personal-row">
              <input
                className="f"
                value={data.personal.nationality}
                onChange={e => setPersonal('nationality', e.target.value)}
              />
              <span className="dot">·</span>
              <input
                className="f"
                value={data.personal.birthdate}
                onChange={e => setPersonal('birthdate', e.target.value)}
              />
              <span className="dot">·</span>
              <input
                className="f"
                value={data.personal.gender}
                onChange={e => setPersonal('gender', e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* ── Work Experience ───────────────────────────── */}
        <section className="section">
          <input
            className="f section-title"
            value={data.workTitle}
            onChange={e => setData(d => ({ ...d, workTitle: e.target.value }))}
          />
          <hr className="divider" />
          {data.work.map(w => (
            <div key={w.id} className="row">
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
              <button className="del no-print" onClick={() => removeWork(w.id)}>
                ×
              </button>
            </div>
          ))}
          <button className="add no-print" onClick={addWork}>
            + Add
          </button>
        </section>

        {/* ── Education ─────────────────────────────────── */}
        <section className="section">
          <input
            className="f section-title"
            value={data.eduTitle}
            onChange={e => setData(d => ({ ...d, eduTitle: e.target.value }))}
          />
          <hr className="divider" />
          {data.education.map(e => (
            <div key={e.id} className="row">
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
              <button className="del no-print" onClick={() => removeEdu(e.id)}>
                ×
              </button>
            </div>
          ))}
          <button className="add no-print" onClick={addEdu}>
            + Add
          </button>
        </section>

        {/* ── Skills ───────────────────────────────────── */}
        <section className="section">
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
                <button className="chip-del no-print" onClick={() => removeSkill(s.id)}>
                  ×
                </button>
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
  )
}
