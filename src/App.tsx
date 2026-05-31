import { useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'

interface ShedEvent {
  id: string
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
}

const ShedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11.5 12 4l9 7.5" stroke="#f2e9d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11v8h14v-8" stroke="#f2e9d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="10" y="13" width="4" height="6" rx="0.5" stroke="#f2e9d8" strokeWidth="1.6"/>
  </svg>
)

const Tick = () => (
  <svg className="tick" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="13" fill="#2c574a"/>
    <path d="M8 14.5l4 4 8-8.5" stroke="#f2e9d8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CalIcon = () => (
  <svg className="cal-icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
)

const ClockIcon = () => (
  <svg className="cal-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
)

const PinIcon = () => (
  <svg className="cal-icon" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
)

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate()
  const suffix = [11,12,13].includes(day) ? 'th' : ['st','nd','rd'][(day % 10) - 1] || 'th'
  return d.toLocaleDateString('en-GB', { month: 'long' }) + ' ' + day + suffix
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h > 12 ? h - 12 : h
  return m === 0 ? `${hour}${suffix}` : `${hour}:${m.toString().padStart(2, '0')}${suffix}`
}

export default function App() {
  const [events, setEvents] = useState<ShedEvent[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [showSuggest, setShowSuggest] = useState(false)
  const [suggestSent, setSuggestSent] = useState(false)
  const [showBook, setShowBook] = useState<ShedEvent | null>(null)
  const [bookSent, setBookSent] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const bookNameRef = useRef<HTMLInputElement>(null)
  const bookEmailRef = useRef<HTMLInputElement>(null)
  const bookProblemRef = useRef<HTMLTextAreaElement>(null)
  const suggestNameRef = useRef<HTMLInputElement>(null)
  const suggestEmailRef = useRef<HTMLInputElement>(null)
  const suggestTextRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    supabase
      .from('shed-events')
      .select('*')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data)
      })
  }, [])

  async function handleSubscribe() {
    const input = emailRef.current
    if (!input) return
    const val = input.value.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      input.focus()
      input.style.borderColor = '#e2a154'
      return
    }
    await supabase.from('shed-subscriptions').insert({ email: val })
    setSubmitted(true)
  }

  async function handleBook() {
    const name = bookNameRef.current?.value.trim() || ''
    const email = bookEmailRef.current?.value.trim() || ''
    const problem = bookProblemRef.current?.value.trim() || ''
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      bookEmailRef.current?.focus()
      if (bookEmailRef.current) bookEmailRef.current.style.borderColor = '#e2a154'
      return
    }
    await supabase.from('shed-attendees').insert({
      event_id: showBook!.id,
      name,
      email,
      problem: problem || null,
    })
    setBookSent(true)
  }

  async function handleSuggest() {
    const name = suggestNameRef.current?.value.trim() || ''
    const email = suggestEmailRef.current?.value.trim() || ''
    const suggestion = suggestTextRef.current?.value.trim() || ''
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      suggestEmailRef.current?.focus()
      if (suggestEmailRef.current) suggestEmailRef.current.style.borderColor = '#e2a154'
      return
    }
    await supabase.from('shed-subscriptions').insert({
      name,
      email,
      source: 'suggest-topic: ' + suggestion,
    })
    setSuggestSent(true)
  }

  return (
    <>
      <header>
        <div className="wrap nav">
          <div className="brand">
            <span className="mark"><ShedIcon /></span>
            The Digital Shed
          </div>
          <div className="where">Battle &middot; East Sussex</div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow reveal d1">A free monthly digital fix-it workshop</span>
              <h1 className="reveal d2">Bring your problem.<br/><em>Leave with a solution.</em></h1>
              <p className="lead reveal d3">Learn about:</p>
              <ul className="lead reveal d3">
                <li>Websites</li>
                <li>AI</li>
                <li>Digital marketing</li>
                <li>Business automation</li>
                <li>Getting started with coding</li>
                <li>Other digital headaches</li>
              </ul>
              <p className="lead reveal d3">Bring what you're stuck on and we'll work through it together, or just come to learn something new. We are here to help you to learn and get beyond the basics.<br/><br/><em className="beginners">Beginners always welcome.</em></p>
            </div>
            <div className="shed-art reveal d3">
              <svg viewBox="0 0 460 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A green garden shed">
                <ellipse cx="230" cy="392" rx="180" ry="18" fill="#1d3b32" opacity="0.12"/>
                <rect x="78" y="168" width="304" height="208" rx="6" fill="#2c574a"/>
                <g stroke="#234a3e" strokeWidth="3" opacity="0.55">
                  <line x1="78" y1="210" x2="382" y2="210"/>
                  <line x1="78" y1="252" x2="382" y2="252"/>
                  <line x1="78" y1="294" x2="382" y2="294"/>
                  <line x1="78" y1="336" x2="382" y2="336"/>
                </g>
                <path d="M60 176 L230 70 L400 176 Z" fill="#1d3b32"/>
                <path d="M60 176 L230 70 L400 176" fill="none" stroke="#142b24" strokeWidth="4" strokeLinejoin="round"/>
                <rect x="56" y="172" width="348" height="14" rx="4" fill="#142b24"/>
                <rect x="196" y="236" width="80" height="140" rx="4" fill="#234a3e" stroke="#142b24" strokeWidth="3"/>
                <rect x="206" y="248" width="60" height="118" rx="3" fill="#2c574a"/>
                <circle cx="262" cy="308" r="5" fill="#e2a154"/>
                <rect x="104" y="232" width="68" height="62" rx="4" fill="#cfe0d9" stroke="#142b24" strokeWidth="3"/>
                <line x1="138" y1="232" x2="138" y2="294" stroke="#142b24" strokeWidth="3"/>
                <line x1="104" y1="263" x2="172" y2="263" stroke="#142b24" strokeWidth="3"/>
                <rect x="100" y="294" width="76" height="14" rx="3" fill="#c9772a"/>
                <path d="M120 294 q-6 -16 4 -24 M138 294 q0 -20 0 -28 M156 294 q6 -16 -4 -24" stroke="#5b8f5b" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <rect x="300" y="232" width="62" height="34" rx="5" fill="#e2a154" stroke="#142b24" strokeWidth="3"/>
                <text x="331" y="254" fontFamily="Fraunces, serif" fontSize="15" fontWeight="700" fill="#2a1a08" textAnchor="middle">OPEN</text>
                <rect x="320" y="92" width="14" height="40" rx="3" fill="#234a3e"/>
              </svg>
            </div>
          </div>
        </section>

        <div className="strip">
          <div className="wrap"><p>A free monthly workshop to improve your digital skills.</p></div>
        </div>

        <section className="upcoming">
          <div className="wrap">
            <div className="section-tag">Upcoming topics</div>
            <div className="topics">
              {events.map((event) => (
                <div className="topic" key={event.id}>
                  <div className="topic-date">
                    <CalIcon />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="topic-time">
                    <ClockIcon />
                    <span>{formatTime(event.start_time)} &ndash; {formatTime(event.end_time)}</span>
                  </div>
                  <div className="topic-location">
                    <PinIcon />
                    <span>{event.location}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <button className="btn btn-amber btn-topic" onClick={() => { setBookSent(false); setShowBook(event) }}>Save your space</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="strip">
          <div className="wrap strip-suggest">
            <p>Got a topic you would like covered?</p>
            <button className="btn btn-amber" onClick={() => { setSuggestSent(false); setShowSuggest(true) }}>Suggest a topic</button>
          </div>
        </div>

        {showBook && (
          <div className="modal-overlay" onClick={() => setShowBook(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowBook(null)}>&times;</button>
              <h3>Save your space</h3>
              <p>{showBook.title} &mdash; {formatDate(showBook.event_date)}</p>
              {!bookSent ? (
                <>
                  <input type="text" className="modal-input" placeholder="Your name" ref={bookNameRef} />
                  <input type="email" className="modal-input" placeholder="Your email" ref={bookEmailRef} />
                  <textarea placeholder="Got a problem you want to solve?" rows={3} ref={bookProblemRef} />
                  <button className="btn btn-amber" onClick={handleBook}>Save my space</button>
                </>
              ) : (
                <p className="modal-thanks">You're in! We'll send you the details.</p>
              )}
            </div>
          </div>
        )}

        {showSuggest && (
          <div className="modal-overlay" onClick={() => setShowSuggest(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowSuggest(false)}>&times;</button>
              <h3>Suggest a topic</h3>
              <p>What would you like us to cover at a future session?</p>
              {!suggestSent ? (
                <>
                  <input type="text" className="modal-input" placeholder="Your name" ref={suggestNameRef} />
                  <input type="email" className="modal-input" placeholder="Your email" ref={suggestEmailRef} />
                  <textarea placeholder="e.g. How to set up email marketing..." rows={4} ref={suggestTextRef} />
                  <button className="btn btn-amber" onClick={handleSuggest}>Send suggestion</button>
                </>
              ) : (
                <p className="modal-thanks">Thanks! We'll add it to the list.</p>
              )}
            </div>
          </div>
        )}

        <section>
          <div className="wrap">
            <div className="section-tag">How an evening works</div>
            <h2>Three simple parts. No homework.</h2>
            <p className="lead-2">Every town used to have someone in a shed who could fix the thing nobody else could. This is that, for the digital stuff that keeps tripping people up.</p>
            <div className="steps">
              <div className="step">
                <div className="num">1</div>
                <h3>A short demo</h3>
                <p>We open with twenty minutes on one genuinely useful thing. Getting a slice of admin to run itself, getting AI to actually do a job for you, making your website behave.</p>
              </div>
              <div className="step">
                <div className="num">2</div>
                <h3>The floor opens</h3>
                <p>Then it is your turn. Bring the thing that has you stuck and we work through it on the night. Or pull up a chair and watch someone else's get solved. You learn more than you would expect.</p>
              </div>
              <div className="step">
                <div className="num">3</div>
                <h3>You leave with it sorted</h3>
                <p>The aim is that you walk out with the thing working, or at the very least knowing the exact next step. No jargon, no being made to feel daft for asking.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="who">
          <div className="wrap">
            <div className="section-tag">Who it is for</div>
            <h2>If it has you stuck, it belongs in the shed.</h2>
            <div className="who-list">
              <div className="who-item">
                <Tick />
                <p>The <b>tradesperson</b> losing every evening to chasing quotes and invoices.</p>
              </div>
              <div className="who-item">
                <Tick />
                <p>The <b>shop owner</b> whose website will not do the one thing they actually need.</p>
              </div>
              <div className="who-item">
                <Tick />
                <p>Anyone who keeps hearing <b>&ldquo;AI&rdquo;</b> and quietly feels three steps behind.</p>
              </div>
              <div className="who-item">
                <Tick />
                <p>The <b>one-person business</b> held together with sticky notes and good intentions.</p>
              </div>
            </div>
            <p className="who-foot">No question is too basic.</p>
          </div>
        </section>

        <section className="signup" id="join">
          <div className="wrap">
            <h2>Want in?</h2>
            <p className="sub">Drop your email and we will send you the next date and what we are tackling. That is all it is for. No spam, no nonsense.</p>
            {!submitted ? (
              <div className="signup-form">
                <input
                  type="email"
                  ref={emailRef}
                  placeholder="you@example.com"
                  aria-label="Your email address"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubscribe() }}
                />
                <button onClick={handleSubscribe}>Keep me posted</button>
              </div>
            ) : (
              <p className="thanks show">Brilliant, you are on the list. See you down the shed.</p>
            )}
            <p className="form-note">The Digital Shed meets monthly in Battle, East Sussex.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot-grid">
          <div className="brand">
            <span className="mark"><ShedIcon /></span>
            The Digital Shed
          </div>
          <div className="foot-by">A <a href="https://bookable.online">Bookable</a> project &middot; Battle, East Sussex</div>
        </div>
      </footer>
    </>
  )
}
