
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected'
type View = 'Dashboard' | 'Applications' | 'Interviews' | 'Offers'

type Job = {
  id: number
  company: string
  role: string
  location: string
  status: JobStatus
  date: string
}

const initialJobs: Job[] = [
  { id: 1, company: 'Google', role: 'Frontend Developer', location: 'Remote', status: 'Interview', date: 'Oct 12, 2026' },
  { id: 2, company: 'Spotify', role: 'React Developer', location: 'New York, NY', status: 'Applied', date: 'Oct 10, 2026' },
  { id: 3, company: 'Airbnb', role: 'UI Engineer', location: 'Remote', status: 'Offer', date: 'Oct 08, 2026' },
  { id: 4, company: 'Stripe', role: 'Junior Developer', location: 'London, UK', status: 'Rejected', date: 'Oct 05, 2026' },
]
function App() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const savedJobs = localStorage.getItem('jobtracker-jobs')
      return savedJobs ? (JSON.parse(savedJobs) as Job[]) : initialJobs
    } catch {
      return initialJobs
    }
  })

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [view, setView] = useState<View>('Dashboard')
  const [showForm, setShowForm] = useState(false)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<JobStatus>('Applied')

  useEffect(() => {
    localStorage.setItem('jobtracker-jobs', JSON.stringify(jobs))
  }, [jobs])

  // Keep the rest of your existing code below

  const openView = (nextView: View) => {
    setView(nextView)
    setSearch('')
    setFilter(
      nextView === 'Interviews'
        ? 'Interview'
        : nextView === 'Offers'
          ? 'Offer'
          : 'All'
    )
    setShowForm(false)
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      `${job.company} ${job.role} ${job.location}`
        .toLowerCase()
        .includes(search.toLowerCase())

    return matchesSearch && (filter === 'All' || job.status === filter)
  })

  const addJob = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!company.trim() || !role.trim()) return

    const newJob: Job = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || 'Not specified',
      status,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    }

    setJobs((previous) => [newJob, ...previous])
    setCompany('')
    setRole('')
    setLocation('')
    setStatus('Applied')
    setFilter('All')
    setView('Applications')
    setShowForm(false)
  }

  const deleteJob = (id: number) => {
    setJobs((previous) => previous.filter((job) => job.id !== id))
  }

  const stats = [
    {
      label: 'Total Applications',
      value: jobs.length,
      icon: '📁',
      color: 'purple',
    },
    {
      label: 'Interviews',
      value: jobs.filter((job) => job.status === 'Interview').length,
      icon: '🎯',
      color: 'blue',
    },
    {
      label: 'Offers Received',
      value: jobs.filter((job) => job.status === 'Offer').length,
      icon: '🎉',
      color: 'green',
    },
    {
      label: 'Awaiting Response',
      value: jobs.filter((job) => job.status === 'Applied').length,
      icon: '⏳',
      color: 'orange',
    },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault()
            openView('Dashboard')
          }}
        >
          <span className="brand-icon">J</span> JobTrack
          <span className="brand-dot">.</span>
        </a>

        <p className="nav-heading">WORKSPACE</p>

        <button
          type="button"
          className={`nav-link ${view === 'Dashboard' ? 'active' : ''}`}
          onClick={() => openView('Dashboard')}
        >
          ▦ <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`nav-link ${view === 'Applications' ? 'active' : ''}`}
          onClick={() => openView('Applications')}
        >
          ▤ <span>My Applications</span>
        </button>

        <button
          type="button"
          className={`nav-link ${view === 'Interviews' ? 'active' : ''}`}
          onClick={() => openView('Interviews')}
        >
          ◷ <span>Interviews</span>
        </button>

        <button
          type="button"
          className={`nav-link ${view === 'Offers' ? 'active' : ''}`}
          onClick={() => openView('Offers')}
        >
          ✧ <span>Offers</span>
        </button>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <span>✦ PRO TIP</span>
            <p>Consistency is key. Track every application to stay one step ahead.</p>
          </div>

          <div className="user-profile">
            <div className="avatar">A</div>
            <div>
              <strong>Ayesha</strong>
              <small>Job seeker</small>
            </div>
            <span className="user-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace /</span>{' '}
            <strong>{view === 'Dashboard' ? 'Dashboard' : view === 'Applications' ? 'My Applications' : view}</strong>
          </div>

          <div className="topbar-right">
            <span className="today-label">✦ Your career, organized</span>
            <div className="avatar">A</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <p className="eyebrow">YOUR CAREER OVERVIEW</p>
            <h1>Good things take <span>tracking.</span> ✨</h1>
            <p className="subtitle">
              Keep your job search organized and your next opportunity in sight.
            </p>
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={() => setShowForm((previous) => !previous)}
          >
            ＋ Add application
          </button>
        </section>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
              <p>{stat.label}</p>
              <div className="stat-bottom">
                <strong>{stat.value.toString().padStart(2, '0')}</strong>
                <span className="stat-note">Tracked jobs</span>
              </div>
            </article>
          ))}
        </section>

        {showForm && (
          <form className="job-form" onSubmit={addJob}>
            <div className="form-heading">
              <div>
                <h2>Add a new application</h2>
                <p>Every opportunity starts somewhere.</p>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-grid">
              <label>
                Company name
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="e.g. Microsoft"
                  required
                />
              </label>

              <label>
                Job title
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </label>

              <label>
                Location
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Remote or city"
                />
              </label>

              <label>
                Application status
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as JobStatus)
                  }
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </label>
            </div>

            <button type="submit" className="primary-btn">
              Save application
            </button>
          </form>
        )}

        <section className="applications-section">
          <div className="section-heading">
            <div>
              <h2>
                {view === 'Dashboard'
                  ? 'Recent applications'
                  : view === 'Applications'
                    ? 'My applications'
                    : view === 'Interviews'
                      ? 'Upcoming interviews'
                      : 'Job offers'}
              </h2>
              <p>All your opportunities, in one place.</p>
            </div>

            <span className="job-count">
              {filteredJobs.length}{' '}
              {filteredJobs.length === 1 ? 'application' : 'applications'}
            </span>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company, role or location..."
              />
            </div>

            <select
              className="filter-select"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value)
                setView('Applications')
              }}
            >
              <option value="All">All statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>COMPANY &amp; ROLE</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>DATE ADDED</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="company-cell">
                        <div className="company-logo">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{job.company}</strong>
                          <small>{job.role}</small>
                        </div>
                      </div>
                    </td>

                    <td className="location-cell">⌖ {job.location}</td>

                    <td>
                      <span className={`status-badge ${job.status.toLowerCase()}`}>
                        {job.status}
                      </span>
                    </td>

                    <td className="date-cell">{job.date}</td>

                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        title={`Delete ${job.company} application`}
                        aria-label={`Delete ${job.company} application`}
                        onClick={() => deleteJob(job.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      No applications found. Try another search or add a job!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="table-footer">
            Showing {filteredJobs.length} of {jobs.length} applications
            <span>Made for your next big move ✦</span>
          </p>
        </section>

        <footer className="page-footer">
          © 2026 JobTrack. Built for your next chapter.
        </footer>
      </main>
    </div>
  )
}

export default App
