'use client'


import { useEffect, useRef, useState } from 'react'
import { Activity, Apple, ArrowUpRight, BarChart3, Bell, Bot, Camera, CheckCircle2, ChevronRight, CloudRain, Droplets, ExternalLink, FileImage, FileText, FlaskConical, Gauge, History, Languages, Leaf, LogOut, Map, Menu, Mic, Network, Play, QrCode, RefreshCw, ScanLine, Settings2, ShieldCheck, Sprout, Sun, Thermometer, UploadCloud, Wifi, Wind, X, Zap } from 'lucide-react'

import { FarmScene } from './farm-scene'
import { IndiaFarmMap } from './india-farm-map'
import { FarmerAuth } from './farmer-auth'
import { ProfileQR } from './profile-qr'
import { useSession } from './auth-gate'


/* =========================================================
   GLOBAL MULTILINGUAL UI
   ---------------------------------------------------------
   The dashboard can now be switched between:
   English, Hindi, Marathi, Gujarati and Tamil.

   This uses Google's client-side translation engine so the
   existing dashboard components do not need to be rewritten
   one-by-one. Dynamic React content is translated as it is
   rendered, while the custom selector below controls the
   active language.
   ========================================================= */

declare global {
  interface Window {
    google?: any
  }
}

type SiteLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'ta'

const SITE_LANGUAGES: Array<{
  code: SiteLanguage
  label: string
  nativeLabel: string
  speech: string
}> = [
  { code: 'en', label: 'English', nativeLabel: 'English', speech: 'en-IN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', speech: 'hi-IN' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', speech: 'mr-IN' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', speech: 'gu-IN' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', speech: 'ta-IN' },
]

const LANGUAGE_STORAGE_KEY = 'agrivision-site-language'

function getSavedSiteLanguage(): SiteLanguage {
  if (typeof window === 'undefined') return 'en'
  const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return SITE_LANGUAGES.some((item) => item.code === value)
    ? (value as SiteLanguage)
    : 'en'
}

function setGoogleLanguage(language: SiteLanguage) {
  if (typeof document === 'undefined') return

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)

  // Google's translator reads this cookie on page initialization.
  document.cookie =
    `googtrans=/en/${language};path=/;max-age=31536000`

  const combo = document.querySelector(
    '.goog-te-combo',
  ) as HTMLSelectElement | null

  if (combo) {
    combo.value = language
    combo.dispatchEvent(new Event('change'))
  } else if (language === 'en') {
    // Returning to English is most reliable after removing the cookie.
    document.cookie =
      'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.reload()
  } else {
    // The Google script may still be loading.
    window.setTimeout(() => setGoogleLanguage(language), 250)
  }
}

function GoogleTranslateLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const existing = document.getElementById(
      'google-translate-script',
    )

    if (!existing) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=agrivisionGoogleTranslateInit'
      script.async = true
      document.body.appendChild(script)
    }

    ;(window as any).agrivisionGoogleTranslateInit = () => {
      if (!window.google?.translate) return

      const mount = document.getElementById(
        'google_translate_element',
      )

      if (!mount || mount.dataset.initialized === 'true') return

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,mr,gu,ta',
          autoDisplay: false,
        },
        'google_translate_element',
      )

      mount.dataset.initialized = 'true'

      const saved = getSavedSiteLanguage()
      if (saved !== 'en') {
        window.setTimeout(() => setGoogleLanguage(saved), 700)
      }
    }

    return () => {
      // Keep Google's script alive across React rerenders.
    }
  }, [])

  return (
    <div
      id="google_translate_element"
      className="pointer-events-none fixed -left-[9999px] top-0 h-0 w-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}

function SiteLanguageSelector() {
  const [language, setLanguage] =
    useState<SiteLanguage>('en')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLanguage(getSavedSiteLanguage())
  }, [])

  const current =
    SITE_LANGUAGES.find((item) => item.code === language) ||
    SITE_LANGUAGES[0]

  const changeLanguage = (next: SiteLanguage) => {
    setLanguage(next)
    setOpen(false)
    setGoogleLanguage(next)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3 py-2 text-xs text-white/70 transition hover:bg-white/[.08] hover:text-white"
        aria-label="Change website language"
        aria-expanded={open}
      >
        <Languages size={15} className="text-[#d5ff4d]" />
        <span className="hidden sm:inline">
          {current.nativeLabel}
        </span>
        <span className="font-mono text-[9px] uppercase text-white/35">
          {current.code}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#14221a] p-1 shadow-2xl">
          <div className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-white/30">
            Website language
          </div>

          {SITE_LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => changeLanguage(item.code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                item.code === language
                  ? 'bg-[#d5ff4d] font-semibold text-[#102016]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.nativeLabel}</span>
              <span className="font-mono text-[9px] opacity-50">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


type View =
  | 'Overview'
  | 'Crop analysis'
  | 'Live camera detection'
  | 'AI farming assistant'
  | 'Remedies & treatment plans'
  | 'Fertilizer recommendations'
  | 'Weather & disease risk'
  | 'Disease history'
  | 'Analytics'
  | 'Field heatmap'
  | 'Voice assistant / Languages'
  | 'QR farm profile'
  | 'Government schemes'
  | 'Offline mode / sync queue'
  | '3D Sensor Lab'
  | 'Field Planner / 3D model'

const nav: { label: View; icon: typeof Activity; group: string }[] = [
  { label: 'Overview', icon: Activity, group: 'Workspace' },
  { label: 'Crop analysis', icon: ScanLine, group: 'Workspace' },
  { label: 'Live camera detection', icon: Camera, group: 'Workspace' },
  { label: 'AI farming assistant', icon: Bot, group: 'Workspace' },

  {
    label: 'Remedies & treatment plans',
    icon: ShieldCheck,
    group: 'Decisions',
  },
  {
    label: 'Fertilizer recommendations',
    icon: Sprout,
    group: 'Decisions',
  },
  {
    label: 'Weather & disease risk',
    icon: CloudRain,
    group: 'Decisions',
  },
  {
    label: 'Disease history',
    icon: History,
    group: 'Decisions',
  },

  { label: 'Analytics', icon: BarChart3, group: 'Insights' },
  { label: 'Field heatmap', icon: Map, group: 'Insights' },

  {
    label: 'Voice assistant / Languages',
    icon: Languages,
    group: 'Tools',
  },
  { label: 'QR farm profile', icon: QrCode, group: 'Tools' },
  { label: 'Government schemes', icon: Apple, group: 'Tools' },
  {
    label: 'Offline mode / sync queue',
    icon: RefreshCw,
    group: 'Tools',
  },

  { label: '3D Sensor Lab', icon: FlaskConical, group: '3D Studio' },
  {
    label: 'Field Planner / 3D model',
    icon: Network,
    group: '3D Studio',
  },
]

const Decisions = 'Decisions'

export function AgrivisionDashboard() {
  const [active, setActive] = useState<View>('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scanState, setScanState] = useState<
    'idle' | 'uploading' | 'analyzing' | 'success' | 'error'
  >('idle')
  const [scan, setScan] = useState<any>(null)
const [latestScan, setLatestScan] = useState<any>(null)
const [history, setHistory] = useState<any[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/') || file.size > 8_000_000) {
      setScanState('error')
      return
    }

    setScanState('uploading')

    const body = new FormData()
    body.append('image', file)
    body.append('farmName', 'North Field')
    body.append('crop', 'Wheat')

    try {
      setScanState('analyzing')

      const res = await fetch('/api/scans', {
        method: 'POST',
        body,
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error)
      }

      setScan(json.scan)
setLatestScan(json.scan)
setScanState('success')
setHistory((items) => [json.scan, ...items])
    } catch {
      setScanState('error')
    }
  }

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/scans')
      const json = await res.json()
      const scans = json.scans || []
      setHistory(scans)
      if (scans.length > 0) {
        setLatestScan(scans[0])
      }
    } catch (error) {
      console.error(error)
    }
  }
  

  const choose = (view: View) => { setActive(view); setMobileOpen(false); if (view === 'Disease history' || view === 'Analytics') void loadHistory() }


  const ActiveIcon =
    nav.find((item) => item.label === active)?.icon || Activity

  return (
    <>
      <GoogleTranslateLoader />

      <main className="min-h-screen overflow-x-hidden bg-[#0b1511] text-[#eef5e4]">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-30 [background-image:linear-gradient(rgba(206,255,76,.065)_1px,transparent_1px),linear-gradient(90deg,rgba(206,255,76,.065)_1px,transparent_1px)] [background-size:48px_48px]" />

      <aside
        className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[300px] flex-col border-r border-white/10 bg-[#0b1511]/96 p-5 backdrop-blur-2xl transition-transform lg:translate-x-0`}
      >
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#d5ff4d] text-[#0b1511] shadow-[0_0_34px_rgba(213,255,77,.28)]">
              <Sprout size={20} />
            </div>

            <div>
              <div className="font-mono text-[10px] tracking-[.32em] text-[#d5ff4d]">
                AGRIVISION
              </div>
              <div className="text-lg font-semibold">
                field intelligence
              </div>
            </div>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-[#d5ff4d]/20 bg-[#d5ff4d]/[.06] p-3">
          <div className="flex items-center gap-2 text-xs text-[#d5ff4d]">
            <span className="size-2 animate-pulse rounded-full bg-[#d5ff4d]" />
            Live system online
          </div>

          <div className="mt-2 font-mono text-[10px] text-white/40">
            24 sensors · 18 zones · 3 farms
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
          {['Workspace', 'Decisions', 'Insights', 'Tools', '3D Studio'].map(
            (group) => (
              <div key={group}>
                <div className="mb-2 px-3 font-mono text-[9px] uppercase tracking-[.24em] text-white/25">
                  {group}
                </div>

                <div className="space-y-1">
                  {nav
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const Icon = item.icon

                      return (
                        <button
                          key={item.label}
                          onClick={() => choose(item.label)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] transition ${
                            active === item.label
                              ? 'bg-[#d5ff4d] font-semibold text-[#102016] shadow-[0_5px_25px_rgba(213,255,77,.13)]'
                              : 'text-white/55 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon size={15} />
                          <span>{item.label}</span>

                          {item.label === 'AI farming assistant' && (
                            <span className="ml-auto rounded-full bg-[#ef8354] px-1.5 py-0.5 font-mono text-[9px] text-white">
                              AI
                            </span>
                          )}
                        </button>
                      )
                    })}
                </div>
              </div>
            ),
          )}
        </nav>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.035] p-3">
          <div className="flex items-center justify-between text-[10px] text-white/40">
            <span>SYNC QUEUE</span>
            <span className="text-[#d5ff4d]">3 ready</span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[92%] rounded-full bg-[#d5ff4d]" />
          </div>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-[300px]">
        <header className="flex h-[76px] items-center justify-between border-b border-white/10 px-5 md:px-9">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu />
            </button>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.22em] text-white/30">
                Thursday · 06 August 2026
              </div>
              <h1 className="mt-1 text-lg font-semibold md:text-xl">
                North Field / Control room
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SiteLanguageSelector />

            <button
              className="rounded-xl border border-white/10 p-2.5 text-white/45 hover:bg-white/5"
              aria-label="Settings"
            >
              <Settings2 size={16} />
            </button>

            <button
              className="relative rounded-xl border border-white/10 p-2.5 text-white/45"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#ef8354]" />
            </button>

            <AccountMenu />
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] p-5 md:p-9">
          <div className="mb-8 flex items-end gap-3">
            <div className="grid size-11 place-items-center rounded-2xl border border-[#d5ff4d]/30 bg-[#d5ff4d]/10 text-[#d5ff4d]">
              <ActiveIcon size={21} />
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.24em] text-[#d5ff4d]">
                {active}
              </div>

              <h2 className="mt-1 text-3xl font-semibold tracking-[-.035em] md:text-5xl">
                {heading(active)}
              </h2>
            </div>
          </div>

          {active === 'Overview' && <Overview choose={choose} />}

          {active === 'Crop analysis' && (
            <CropAnalysis
              scanState={scanState}
              scan={scan}
              inputRef={inputRef}
              upload={upload}
            />
          )}

          {active === 'Live camera detection' && (
  <CameraView
    onScan={(result) => {
      setScan(result)
      setLatestScan(result)
      setHistory((items) => [result, ...items])
    }}
  />
)}
          {active === 'AI farming assistant' && <Assistant />}
          {active === 'Remedies & treatment plans' && (
  <Remedies scan={latestScan} />
)}

{active === 'Fertilizer recommendations' && (
  <Fertilizer scan={latestScan} />
)}

{active === 'Weather & disease risk' && (
  <Weather scan={latestScan} />
)}

{active === 'Disease history' && (
  <HistoryView history={history} />
)}

{active === 'Analytics' && (
  <Analytics history={history} />
)}
          {active === 'Field heatmap' && <Heatmap />}
          {active === 'Voice assistant / Languages' && <Voice />}
          {active === 'QR farm profile' && <QR />}
          {active === 'Government schemes' && <Schemes />}
          {active === 'Offline mode / sync queue' && <Offline />}

          {(active === '3D Sensor Lab' ||
            active === 'Field Planner / 3D model') && (
            <section className="rounded-[30px] border border-white/10 bg-[#14221a] p-3 md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#d5ff4d]">
                    {active === '3D Sensor Lab'
                      ? 'Procedural sensor platform'
                      : 'Digital twin field blocks'}
                  </div>

                  <p className="mt-2 text-sm text-white/45">
                    {active === '3D Sensor Lab'
                      ? 'Click hotspots to inspect each instrument. Orbit, zoom, and reset the scene.'
                      : 'Select parcels and model irrigation paths, rotation, and coverage.'}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 px-3 py-2 font-mono text-[10px] text-white/45">
                  WebGL / interactive
                </div>
              </div>

              <div className="h-[620px]">
                <FarmScene
                  mode={
                    active === '3D Sensor Lab' ? 'sensor' : 'planner'
                  }
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
    </>
  )
}

function heading(view: View) {
  return (
    {
      Overview: 'Your fields are speaking.',
      'Crop analysis': 'Diagnose crop stress.',
      'Live camera detection': 'See it live.',
      'AI farming assistant': 'Ask the field.',
      'Remedies & treatment plans': 'Turn signals into action.',
      'Fertilizer recommendations': 'Feed the potential.',
      'Weather & disease risk': 'Read the next weather move.',
      'Disease history': 'A timeline of crop health.',
      Analytics: 'Measure what matters.',
      'Field heatmap': 'Find the field outliers.',
      'Voice assistant / Languages': 'Make intelligence accessible.',
      'QR farm profile': 'Your farm, one scan away.',
      'Government schemes': 'Unlock support for growers.',
      'Offline mode / sync queue': 'Keep working beyond signal.',
      '3D Sensor Lab': 'Walk through the living field.',
      'Field Planner / 3D model': 'Shape the next season.',
    } as Record<View, string>
  )[view]
}

function Overview({ choose }: { choose: (v: View) => void }) {
  return (
    <>
      <section className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={Leaf}
          label="Crop health"
          value="86"
          suffix="/100"
          note="+4.8% vs last scan"
        />

        <Metric
          icon={Droplets}
          label="Soil moisture"
          value="42"
          suffix="%"
          note="Ideal range 38–46%"
        />

        <Metric
          icon={Sun}
          label="Yield forecast"
          value="8.7"
          suffix="t/ha"
          note="+12% projected"
        />

        <Metric
          icon={Zap}
          label="Active zones"
          value="12"
          suffix="/18"
          note="6 zones need review"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#17291e] p-5 md:p-7">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-white/50">
                <span className="size-2 rounded-full bg-[#d5ff4d]" />
                North Field · live digital twin
              </div>

              <h3 className="text-2xl font-semibold">Sensor farm lab</h3>
            </div>

            <button
              onClick={() => choose('3D Sensor Lab')}
              className="rounded-lg border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/50"
            >
              Open 3D
            </button>
          </div>

          <div className="mt-4 h-[390px]">
            <FarmScene mode="sensor" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] bg-[#f1f4e7] p-6 text-[#17291e]">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#657660]">
                  Weather window
                </div>

                <div className="mt-2 text-4xl font-semibold">24°</div>

                <p className="mt-1 text-sm text-[#657660]">
                  Partly cloudy · disease risk low
                </p>
              </div>

              <CloudRain className="text-[#ef8354]" />
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-[#17291e]/10 pt-4 text-xs">
              <div>
                <span className="text-[#657660]">Rain risk</span>
                <b className="mt-1 block">18%</b>
              </div>

              <div>
                <span className="text-[#657660]">Wind</span>
                <b className="mt-1 block">12 km/h</b>
              </div>

              <div>
                <span className="text-[#657660]">Humidity</span>
                <b className="mt-1 block">64%</b>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[.04] p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Attention needed
                </div>

                <h3 className="mt-2 text-xl font-semibold">
                  3 field signals
                </h3>
              </div>

              <ArrowUpRight className="text-[#d5ff4d]" />
            </div>

            <Signal
              icon={Thermometer}
              title="Heat stress rising"
              meta="South Orchard · 14 min ago"
              color="text-[#ef8354]"
            />

            <Signal
              icon={Droplets}
              title="Irrigation complete"
              meta="North Field · 32 min ago"
              color="text-[#d5ff4d]"
            />

            <Signal
              icon={Wind}
              title="Wind shift detected"
              meta="East Pasture · 1 hr ago"
              color="text-[#f7c948]"
            />
          </div>
        </div>
      </section>
    </>
  )
}

function CropAnalysis({
  scanState,
  scan,
  inputRef,
  upload,
}: any) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-[30px] border border-white/10 bg-white/[.045] p-5 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#d5ff4d]">
              Image diagnosis
            </div>

            <p className="mt-2 text-sm text-white/45">
              Upload a clear leaf image. We validate the file, persist the
              scan, and return a transparent analysis payload.
            </p>
          </div>

          <span className="rounded-full border border-[#f7c948]/30 px-3 py-1 font-mono text-[9px] text-[#f7c948]">
            HEURISTIC FALLBACK
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && upload(e.target.files[0])
          }
        />

        <button
          onClick={() => inputRef.current?.click()}
          className="group flex min-h-64 w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d5ff4d]/40 bg-[#d5ff4d]/[.035] px-6 text-center transition hover:bg-[#d5ff4d]/[.08]"
        >
          <div className="grid size-16 place-items-center rounded-2xl bg-[#d5ff4d] text-[#102016] shadow-[0_0_35px_rgba(213,255,77,.2)]">
            <UploadCloud size={25} />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            Drop a leaf image or browse files
          </h3>

          <p className="mt-2 text-xs text-white/35">
            JPG, PNG, WEBP · max 8 MB · camera capture available
          </p>
        </button>

        {scanState !== 'idle' && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4">
            {scanState === 'analyzing' && (
              <div className="flex items-center gap-3 text-[#d5ff4d]">
                <RefreshCw className="animate-spin" size={17} />
                Running validated image analysis…
              </div>
            )}

            {scanState === 'uploading' && (
              <div className="text-white/60">
                Uploading scan securely…
              </div>
            )}

            {scanState === 'error' && (
              <div className="text-[#ef8354]">
                Scan failed. Check the image type, size, and database
                connection.
              </div>
            )}

            {scanState === 'success' && scan && <Result scan={scan} />}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Panel title="What this returns">
          <Mini
            title="Top 3 predictions"
            body="Disease label, confidence, severity, and likely cause."
          />
          <Mini
            title="Action plan"
            body="Remedy timing, fertilizer nutrients, and spread risk."
          />
          <Mini
            title="History record"
            body="Every successful scan is saved to Neon."
          />
        </Panel>

        <Panel title="Capture checklist">
          <div className="space-y-3 text-sm text-white/55">
            <Check text="Use even daylight" />
            <Check text="Include the full leaf" />
            <Check text="Avoid blur and water drops" />
            <Check text="Scan again after treatment" />
          </div>
        </Panel>
      </div>
    </div>
  )
}

function Result({ scan }: { scan: any }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#d5ff4d]">
            {scan.analysisMode} · live inference
          </div>

          <div className="mt-2 text-xl font-semibold">
            {scan.predictions?.[0]?.label || scan.status}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-semibold">
            {Math.round(
              (scan.predictions?.[0]?.confidence || 0) * 100,
            )}
            %
          </div>

          <div className="text-xs text-white/35">confidence</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {scan.predictions?.slice(0, 3).map((p: any) => (
          <div
            key={p.label}
            className="flex items-center justify-between text-xs"
          >
            <span>{p.label}</span>
            <span className="text-[#d5ff4d]">
              {Math.round(p.confidence * 100)}%
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-white/55">
        {scan.recommendation}
      </p>
    </div>
  )
}
function CameraView({
  onScan,
}: {
  onScan: (scan: any) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [streaming, setStreaming] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [note, setNote] = useState(
    'Camera is private until you capture a leaf.',
  )
  const [scan, setScan] = useState<any>(null)

  useEffect(() => {
    return () => {
      const video = videoRef.current

      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream

        stream.getTracks().forEach((track) => {
          track.stop()
        })

        video.srcObject = null
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setNote('Requesting camera access…')

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera access is not supported by this browser.',
        )
      }

      // Stop any previous camera stream
      const existingVideo = videoRef.current

      if (existingVideo?.srcObject) {
        const oldStream =
          existingVideo.srcObject as MediaStream

        oldStream.getTracks().forEach((track) => {
          track.stop()
        })

        existingVideo.srcObject = null
      }

      // Request camera
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: 'environment',
            },
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
            frameRate: {
              ideal: 30,
            },
          },
          audio: false,
        })

      // IMPORTANT:
      // The video element is ALWAYS mounted now.
      const video = videoRef.current

      if (!video) {
        stream.getTracks().forEach((track) => track.stop())

        throw new Error(
          'Video element is not available. Please refresh the page.',
        )
      }

      video.srcObject = stream
      video.muted = true
      video.autoplay = true
      video.playsInline = true

      // Wait for the video metadata
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve()
          return
        }

        const handleMetadata = () => {
          video.removeEventListener(
            'loadedmetadata',
            handleMetadata,
          )

          resolve()
        }

        video.addEventListener(
          'loadedmetadata',
          handleMetadata,
        )
      })

      // Start playback
      await video.play()

      setStreaming(true)

      setNote(
        'Live preview ready — centre one leaf inside the frame.',
      )

      console.log('Camera started successfully')
      console.log(
        'Resolution:',
        video.videoWidth,
        'x',
        video.videoHeight,
      )
    } catch (error: any) {
      console.error('Camera error:', error)

      setStreaming(false)

      let message =
        'Unable to access the camera.'

      if (error?.name === 'NotAllowedError') {
        message =
          'Camera permission was denied. Allow camera access for localhost.'
      } else if (error?.name === 'NotFoundError') {
        message =
          'No camera was found on this device.'
      } else if (error?.name === 'NotReadableError') {
        message =
          'The camera is already being used by another application.'
      } else if (error?.name === 'OverconstrainedError') {
        message =
          'The selected camera settings are not supported.'
      } else if (error?.message) {
        message = error.message
      }

      setNote(message)
    }
  }

  const stopCamera = () => {
    const video = videoRef.current

    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream

      stream.getTracks().forEach((track) => {
        track.stop()
      })

      video.srcObject = null
    }

    setStreaming(false)

    setNote(
      'Camera stopped. Open the camera again when you are ready.',
    )
  }

  const capture = async () => {
    const video = videoRef.current

    if (!video) {
      setNote('Camera video element is unavailable.')
      return
    }

    if (
      video.readyState <
        HTMLMediaElement.HAVE_CURRENT_DATA ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setNote(
        'Camera is not producing video frames yet. Please wait a moment and try again.',
      )
      return
    }

    setScanning(true)

    setNote(
      'Capturing leaf frame and running the trained model…',
    )

    try {
      const canvas =
        document.createElement('canvas')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error(
          'Could not create image capture canvas.',
        )
      }

      // Capture the current camera frame
      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height,
      )

      const image =
        await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            resolve,
            'image/jpeg',
            0.92,
          )
        })

      if (!image) {
        throw new Error(
          'Could not capture camera image.',
        )
      }

      const form = new FormData()

      form.append(
        'image',
        image,
        'live-leaf.jpg',
      )

      form.append(
        'crop',
        'Tomato',
      )

      const res = await fetch(
        '/api/scans',
        {
          method: 'POST',
          body: form,
        },
      )

      const json = await res.json()

      if (!res.ok) {
        throw new Error(
          json?.error ||
            'The crop analysis request failed.',
        )
      }

      setScan(json.scan)

      setScan(json.scan)
onScan(json.scan)

setNote(
  'Analysis complete. Your result has been added to this session.',
)
    } catch (error: any) {
      console.error(
        'Capture error:',
        error,
      )

      setNote(
        error?.message ||
          'Live scan could not run. Check your ML service and try again.',
      )
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
      <div className="rounded-[30px] border border-white/10 bg-[#15241b] p-4">
        <div className="relative flex min-h-[470px] items-center justify-center overflow-hidden rounded-[24px] border border-[#d5ff4d]/20 bg-[#0d1711]">

          {/* =====================================================
              IMPORTANT:
              VIDEO IS ALWAYS MOUNTED.
              This fixes:
              "Video element is not available."
              ===================================================== */}

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls={false}
            className={`absolute inset-0 h-full w-full object-cover ${
              streaming
                ? 'opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            style={{
              backgroundColor: '#0d1711',
            }}
          />

          {!streaming ? (
            <div className="relative z-10 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-full border border-[#d5ff4d]/50 text-[#d5ff4d]">
                <Camera size={30} />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Open leaf scanner
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">
                {note}
              </p>

              <button
                onClick={() => void startCamera()}
                className="mt-6 rounded-xl bg-[#d5ff4d] px-5 py-3 text-sm font-semibold text-[#102016] transition hover:scale-105"
              >
                Open camera
              </button>
            </div>
          ) : (
            <>
              {/* Camera overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-black/10" />

              {/* Detection frame */}
              <div className="pointer-events-none absolute left-[20%] right-[20%] top-[14%] bottom-[14%] z-20 rounded-[32px] border-2 border-[#d5ff4d] shadow-[0_0_0_999px_rgba(0,0,0,.18)]">

                <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-[#d5ff4d]" />

                <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-[#d5ff4d]" />

                <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-[#d5ff4d]" />

                <div className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-[#d5ff4d]" />

              </div>

              {/* Live indicator */}
              <div className="absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-2 font-mono text-[10px] text-white/80 backdrop-blur">
                <span className="size-2 animate-pulse rounded-full bg-[#d5ff4d]" />
                CAMERA LIVE
              </div>

              {/* Controls */}
              <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">

                <button
                  disabled={scanning}
                  onClick={() => void capture()}
                  className="rounded-xl bg-[#d5ff4d] px-5 py-3 text-sm font-semibold text-[#102016] shadow-2xl transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {scanning
                    ? 'Analysing…'
                    : 'Capture & scan leaf'}
                </button>

                <button
                  disabled={scanning}
                  onClick={stopCamera}
                  className="rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-sm text-white backdrop-blur transition hover:bg-black/70 disabled:opacity-50"
                >
                  Stop
                </button>

              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE STATUS
          ===================================================== */}

      <Panel title="Live scan status">

        <Mini
          title="Frame pipeline"
          body={
            streaming
              ? scanning
                ? 'Capturing and sending to ML…'
                : 'Live · ready to capture'
              : 'Waiting for camera input'
          }
        />

        {scan ? (
          <Result scan={scan} />
        ) : (
          <>
            <Mini
              title="Model endpoint"
              body="FastAPI EfficientNet inference"
            />

            <Mini
              title="Privacy"
              body={note}
            />
          </>
        )}

        {streaming && (
          <div className="mt-5 rounded-xl border border-white/10 bg-black/15 p-3 font-mono text-[10px] text-white/35">
            <div className="text-[#d5ff4d]">
              CAMERA STREAM ACTIVE
            </div>

            <div className="mt-2">
              Capture is taken directly from the live
              video frame.
            </div>
          </div>
        )}

      </Panel>
    </div>
  )
}
function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Good morning. I can explain crop health, weather risk, and safe field actions.',
    },
  ])

  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const send = async () => {
    const content = text.trim()

    if (!content || sending) return

    setText('')
    setMessages((m) => [...m, { role: 'farmer', text: content }])
    setSending(true)

    try {
      const puter = await loadPuter()

      if (!puter?.ai?.chat) {
        throw new Error('Puter is still loading')
      }

      const prompt = `
You are AgriVision, an AI farming assistant.

Farmer's question:
${content}

Give simple, practical farming advice.

If the question is about a crop disease:
1. Identify the likely disease/problem.
2. Explain the symptoms.
3. Give practical remedy guidance.
4. Give prevention advice.
5. Do not invent pesticide dosages.
6. For serious cases, recommend confirming with a local agricultural expert.

Keep the response concise and easy for a farmer to understand.
`

      const result = await puter.ai.chat(prompt, {
        model: 'gpt-5.4-nano',
        temperature: 0.3,
      })

      let reply = ''

      if (typeof result === 'string') {
        reply = result
      } else if (result?.message?.content) {
        if (typeof result.message.content === 'string') {
          reply = result.message.content
        } else if (Array.isArray(result.message.content)) {
          reply = result.message.content
            .map((item) => (typeof item === 'string' ? item : item?.text || ''))
            .join('')
        }
      } else if (result?.text) {
        reply = result.text
      }

      if (!reply.trim()) {
        reply = 'Sorry, I could not generate a farming response.'
      }

      setMessages((m) => [...m, { role: 'bot', text: reply }])
    } catch (error) {
      console.error('Assistant error:', error)

      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: 'Sorry, the AgriVision AI assistant could not process your question. Please try again.',
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_.35fr]">
      <div className="flex min-h-[560px] flex-col rounded-[30px] border border-white/10 bg-white/[.045] p-5 md:p-7">
        <div className="flex-1 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`max-w-xl whitespace-pre-wrap rounded-2xl p-4 text-sm leading-6 ${
                message.role === 'bot'
                  ? 'bg-[#d5ff4d] text-[#102016]'
                  : 'ml-auto bg-white/10 text-white/70'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-white/10 pt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void send()}
            placeholder="Ask about crop health, irrigation, weather…"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm outline-none focus:border-[#d5ff4d]/50"
          />

          <button
            disabled={sending}
            onClick={() => void send()}
            className="rounded-xl bg-[#d5ff4d] px-4 text-[#102016] disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <Panel title="Puter assistant">
        <Mini title="No API key required" body="Uses Puter.js in the browser." />
        <Mini
          title="Safety first"
          body="Guidance is not a substitute for local agricultural advice."
        />
      </Panel>
    </div>
  )
}
const diseaseRemedies: Record<
  string,
  {
    title: string
    description: string
    actions: string[]
  }
> = {
  healthy: {
    title: 'Healthy Crop',
    description:
      'No major disease symptoms were identified. Continue regular monitoring.',
    actions: [
      'Continue regular field inspection',
      'Maintain appropriate irrigation',
      'Monitor leaves for new symptoms',
    ],
  },

  'Tomato Early Blight': {
    title: 'Tomato Early Blight',
    description:
      'Early blight can cause dark spots and yellowing on tomato leaves.',
    actions: [
      'Remove severely affected leaves',
      'Avoid unnecessary overhead irrigation',
      'Improve airflow between plants',
      'Re-scan the crop after treatment',
    ],
  },

  'Tomato Late Blight': {
    title: 'Tomato Late Blight',
    description:
      'Late blight can spread rapidly under cool and humid conditions.',
    actions: [
      'Inspect surrounding plants',
      'Remove severely affected plant material',
      'Avoid prolonged leaf wetness',
      'Monitor the field closely',
    ],
  },

  'Potato Early Blight': {
    title: 'Potato Early Blight',
    description:
      'Inspect affected potato foliage and reduce conditions that encourage prolonged leaf wetness.',
    actions: [
      'Remove severely affected foliage where practical',
      'Maintain adequate plant spacing',
      'Avoid unnecessary overhead irrigation',
      'Monitor new growth',
    ],
  },

  'Potato Late Blight': {
    title: 'Potato Late Blight',
    description:
      'Late blight can spread quickly in favourable conditions.',
    actions: [
      'Inspect neighbouring plants',
      'Remove severely affected material',
      'Reduce prolonged leaf wetness',
      'Perform a follow-up scan',
    ],
  },

  'Apple Scab': {
    title: 'Apple Scab',
    description:
      'Monitor leaves and fruit for developing lesions and maintain good orchard sanitation.',
    actions: [
      'Remove heavily affected fallen material',
      'Maintain orchard airflow',
      'Monitor new leaves',
      'Perform another scan after treatment',
    ],
  },

  'Grape Black Rot': {
    title: 'Grape Black Rot',
    description:
      'Inspect grape leaves and fruit carefully and remove severely affected material where practical.',
    actions: [
      'Remove affected plant material',
      'Improve canopy airflow',
      'Avoid unnecessary leaf wetness',
      'Monitor nearby vines',
    ],
  },
}
// ============================================
// Supplementary descriptive text only.
// Severity / recovery / nutrients / remedy text
// come from the backend (scan.severity, scan.recoveryChance,
// scan.nutrients, scan.recommendation) — this table just adds
// symptom/cause context the API doesn't send. Keys match
// backend/DISEASE_DB exactly, so keep them in sync if you
// retrain with new classes.
// ============================================
const diseaseFacts: Record<string, { symptoms: string; cause: string; prevention: string }> = {
  'Apple - Apple Scab': {
    symptoms: 'Olive-green to black velvety spots on leaves and fruit, sometimes causing leaf curling or premature drop.',
    cause: 'Fungal pathogen (Venturia inaequalis) that overwinters in fallen leaves and spreads via spring rain.',
    prevention: 'Choose scab-resistant varieties for new plantings and maintain good orchard sanitation each autumn.',
  },
  'Apple - Black Rot': {
    symptoms: 'Purple-bordered "frog-eye" leaf spots and rotting fruit with concentric rings.',
    cause: 'Fungal pathogen (Botryosphaeria obtusa) entering through wounds and dead wood.',
    prevention: 'Maintain tree vigor with balanced fertility and avoid unnecessary bark wounds when pruning.',
  },
  'Apple - Cedar Apple Rust': {
    symptoms: 'Bright orange-yellow spots on leaves, occasionally with tube-like structures on the underside.',
    cause: 'Fungal pathogen requiring both apple and nearby juniper/cedar hosts to complete its life cycle.',
    prevention: 'Plant rust-resistant apple varieties, especially where cedar trees grow nearby.',
  },
  'Bell Pepper - Bacterial Spot': {
    symptoms: 'Small, water-soaked spots on leaves and fruit that turn brown and scab-like.',
    cause: 'Bacterial pathogen (Xanthomonas spp.) spread by rain splash and contaminated tools.',
    prevention: 'Use certified disease-free seed/transplants and rotate out of pepper/tomato beds for 2 years.',
  },
  'Cherry - Powdery Mildew': {
    symptoms: 'White, powdery fungal growth on leaves and young shoots, sometimes causing leaf curling.',
    cause: 'Fungal pathogen favored by warm days, cool nights, and dense canopy shade.',
    prevention: 'Prune for airflow and avoid excess nitrogen, which encourages soft, susceptible growth.',
  },
  'Corn (Maize) - Cercospora Leaf Spot': {
    symptoms: 'Rectangular tan-to-gray lesions bound by leaf veins, often merging in humid conditions.',
    cause: 'Fungal pathogen surviving in corn residue, spreading fast under warm, humid, low-airflow conditions.',
    prevention: 'Rotate crops, till residue, and select resistant hybrids for future plantings.',
  },
  'Corn (Maize) - Common Rust': {
    symptoms: 'Small, reddish-brown pustules scattered across both leaf surfaces.',
    cause: 'Fungal pathogen favored by cool, moist weather with heavy dew.',
    prevention: 'Plant rust-resistant hybrids and avoid excess nitrogen top-dressing.',
  },
  'Corn (Maize) - Northern Leaf Blight': {
    symptoms: 'Long, cigar-shaped grey-green to tan lesions running parallel to leaf veins, usually on lower leaves first.',
    cause: 'Fungal pathogen (Exserohilum turcicum) thriving in humid conditions with extended leaf wetness.',
    prevention: 'Rotate away from corn for a season, till under infected residue, and choose resistant hybrids.',
  },
  'Grape - Black Rot': {
    symptoms: 'Small tan leaf spots with dark borders; fruit shrivels into hard, black "mummies."',
    cause: 'Fungal pathogen overwintering in mummified fruit and infected canes.',
    prevention: 'Improve canopy airflow through leaf pulling and keep the vineyard floor clean each winter.',
  },
  'Grape - Esca (Black Measles)': {
    symptoms: 'Tiger-stripe interveinal discoloration on leaves; can cause sudden vine collapse.',
    cause: 'Complex of wood-rotting fungi entering through pruning wounds over multiple seasons.',
    prevention: 'Prune during dry weather and protect large cuts to avoid new infections.',
  },
  'Grape - Leaf Blight': {
    symptoms: 'Reddish-brown angular spots on leaves that can merge into larger blighted patches.',
    cause: 'Fungal pathogen favored by warm, humid conditions and dense canopy.',
    prevention: 'Improve canopy ventilation through leaf pulling and timely pruning.',
  },
  'Peach - Bacterial Spot': {
    symptoms: 'Small, dark, water-soaked spots on leaves and fruit, sometimes causing leaf tearing.',
    cause: 'Bacterial pathogen spread by rain splash, favored by warm, wet weather.',
    prevention: 'Favour resistant varieties and avoid overhead irrigation that splashes bacteria onto leaves.',
  },
  'Potato - Early Blight': {
    symptoms: 'Dark, concentric-ringed lesions on older foliage, often with a yellow halo.',
    cause: 'Fungal pathogen (Alternaria solani) favored by warm temperatures and alternating wet/dry periods.',
    prevention: 'Maintain balanced fertility, rotate crops, and space plants for airflow.',
  },
  'Potato - Late Blight': {
    symptoms: 'Water-soaked lesions rapidly enlarging and turning brown-black, with fine white mold on leaf undersides.',
    cause: 'Oomycete pathogen (Phytophthora infestans) — spreads very fast in cool, wet weather.',
    prevention: 'Plant certified disease-free seed potatoes and destroy volunteer plants between seasons.',
  },
  'Strawberry - Leaf Scorch': {
    symptoms: 'Small purple spots merging into larger scorched, reddish-brown patches.',
    cause: 'Fungal pathogen favored by wet foliage and dense plantings.',
    prevention: 'Space plants for airflow, avoid overhead irrigation, and renovate beds annually.',
  },
  'Tomato - Bacterial Spot': {
    symptoms: 'Small, dark, water-soaked spots on leaves and fruit, sometimes with yellow halos.',
    cause: 'Bacterial pathogen spread by splashing water and contaminated tools.',
    prevention: 'Use certified disease-free transplants and rotate away from tomato/pepper beds for 2 years.',
  },
  'Tomato - Early Blight': {
    symptoms: 'Dark brown spots with concentric "target" rings on older, lower leaves.',
    cause: 'Fungal pathogen (Alternaria solani) overwintering in soil, spread by splashing water.',
    prevention: 'Stake plants for airflow, rotate tomato/potato beds yearly, and water at the soil line.',
  },
  'Tomato - Late Blight': {
    symptoms: 'Water-soaked, grey-green blotches turning brown and papery, with white mold on humid days.',
    cause: 'Oomycete pathogen (Phytophthora infestans) spreading fast in cool, wet conditions.',
    prevention: 'Choose resistant varieties and destroy volunteer tomato/potato plants between seasons.',
  },
  'Tomato - Septoria Leaf Spot': {
    symptoms: 'Small circular spots with dark borders and grey centers, usually on oldest leaves first.',
    cause: 'Fungal pathogen spread via rain splash, persisting in old plant debris.',
    prevention: 'Rotate beds, clear old debris at season end, and stake plants off the soil.',
  },
  'Tomato - Yellow Leaf Curl Virus': {
    symptoms: 'Upward-curling, yellowing leaves and stunted plant growth.',
    cause: 'Viral pathogen transmitted by whitefly feeding — the insect is the actual vector.',
    prevention: 'Control whitefly populations and use virus-resistant tomato varieties next season.',
  },
}

const severityDisplay: Record<string, { label: string; styles: string }> = {
  none: { label: 'HEALTHY', styles: 'bg-[#d5ff4d]/10 text-[#d5ff4d] border-[#d5ff4d]/25' },
  medium: { label: 'MODERATE', styles: 'bg-[#f7c948]/15 text-[#f7c948] border-[#f7c948]/25' },
  high: { label: 'HIGH', styles: 'bg-[#ef8354]/15 text-[#ef8354] border-[#ef8354]/25' },
}

function Remedies({ scan }: { scan: any }) {
  const label = scan?.predictions?.[0]?.label || scan?.status || ''
  const confidence = scan?.predictions?.[0]?.confidence ?? 0
  const facts = diseaseFacts[label]
  const severity = severityDisplay[scan?.severity] || severityDisplay.medium
  const nutrients: string[] = scan?.nutrients || []
  const actions =
    !facts && !scan
      ? []
      : [
          scan?.healthy
            ? 'Continue regular field inspection'
            : 'Remove severely affected plant material',
          'Improve spacing and airflow around the crop',
          'Avoid unnecessary overhead irrigation',
          're-scan the crop in 3–5 days to track progress',
        ]

  const [completed, setCompleted] = useState<boolean[]>(() => actions.map(() => false))
  const completedCount = completed.filter(Boolean).length

  return (
    <div className="space-y-4">
      {!scan ? (
        <Panel title="No diagnosis available">
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
            <Leaf className="mx-auto text-[#d5ff4d]" size={30} />
            <h3 className="mt-4 text-lg font-semibold">Run a crop analysis first</h3>
            <p className="mt-2 text-sm text-white/40">
              Your treatment plan will automatically appear here after a disease
              prediction is available.
            </p>
          </div>
        </Panel>
      ) : (
        <>
          {/* HERO SUMMARY */}
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#17291e] to-[#0f1a13] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#d5ff4d]">
                  {scan.crop || 'Field scan'} · Diagnosis
                </div>
                <h3 className="mt-2 text-2xl font-semibold md:text-3xl">
                  {label.replace(/ - /g, ' — ')}
                </h3>
              </div>

              <span className={`rounded-full border px-3 py-1.5 font-mono text-[10px] ${severity.styles}`}>
                {severity.label} SEVERITY
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="text-[10px] uppercase tracking-widest text-white/35">
                  Model confidence
                </div>
                <div className="mt-2 text-2xl font-semibold text-[#d5ff4d]">
                  {Math.round(confidence * 100)}%
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="text-[10px] uppercase tracking-widest text-white/35">
                  Recovery outlook
                </div>
                <div className="mt-2 text-2xl font-semibold">
                  {scan.recoveryChance ?? '--'}
                  <span className="text-sm font-normal text-white/35">%</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="text-[10px] uppercase tracking-widest text-white/35">
                  Treatment progress
                </div>
                <div className="mt-2 text-2xl font-semibold">
                  {completedCount}/{actions.length}
                </div>
              </div>
            </div>
          </div>

          {/* SYMPTOMS + CAUSE (descriptive context, if we have it) */}
          {facts && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="What we observed">
                <div className="flex gap-3">
                  <ScanLine className="mt-1 shrink-0 text-[#d5ff4d]" size={18} />
                  <p className="text-sm leading-6 text-white/60">{facts.symptoms}</p>
                </div>
              </Panel>

              <Panel title="Likely cause">
                <div className="flex gap-3">
                  <FlaskConical className="mt-1 shrink-0 text-[#f7c948]" size={18} />
                  <p className="text-sm leading-6 text-white/60">{facts.cause}</p>
                </div>
              </Panel>
            </div>
          )}

          {/* TREATMENT (from backend) + PREVENTION + CHECKLIST */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Recommended treatment">
              <div className="rounded-2xl border border-[#d5ff4d]/20 bg-[#d5ff4d]/[.05] p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 shrink-0 text-[#d5ff4d]" size={20} />
                  <p className="text-sm leading-6 text-white/70">
                    {scan.recommendation || 'No treatment guidance returned for this scan.'}
                  </p>
                </div>
              </div>

              {nutrients.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {nutrients.map((n) => (
                    <span
                      key={n}
                      className="rounded-full border border-[#d5ff4d]/25 bg-[#d5ff4d]/[.06] px-3 py-1 text-[11px] text-[#d5ff4d]"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}

              {facts?.prevention && (
                <div className="mt-5">
                  <div className="mb-3 text-xs uppercase tracking-widest text-white/30">
                    Prevention for next season
                  </div>
                  <p className="text-sm leading-6 text-white/55">{facts.prevention}</p>
                </div>
              )}
            </Panel>

            <Panel title="Treatment checklist">
              <div className="space-y-3">
                {actions.map((action, index) => (
                  <button
                    key={action}
                    onClick={() =>
                      setCompleted((items) =>
                        items.map((value, i) => (i === index ? !value : value)),
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/15 p-3 text-left transition hover:border-[#d5ff4d]/25"
                  >
                    <CheckCircle2
                      size={18}
                      className={completed[index] ? 'text-[#d5ff4d]' : 'text-white/25'}
                    />
                    <span className={completed[index] ? 'text-white/40 line-through' : 'text-white/70'}>
                      {action}
                    </span>
                  </button>
                ))}
              </div>

              {actions.length > 0 && completedCount === actions.length && (
                <div className="mt-4 rounded-xl border border-[#d5ff4d]/25 bg-[#d5ff4d]/10 p-3 text-center text-xs text-[#d5ff4d]">
                  All steps complete — re-scan the crop to confirm recovery.
                </div>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}
// General per-hectare agronomic starting points by crop — supporting
// context alongside the backend's nutrient priority list. Always
// confirm exact quantities with a lab soil test.
const cropNutrientTargets: Record<
  string,
  { n: string; p: string; k: string; schedule: string }
> = {  'Corn (Maize)': {
    n: '120–150 kg/ha', p: '50–60 kg/ha', k: '40–60 kg/ha',
    schedule: 'Basal dose at sowing, first top-dress at knee-high stage, second at tasseling.',
  },
  Tomato: {
    n: '100–120 kg/ha', p: '60–80 kg/ha', k: '120–150 kg/ha',
    schedule: 'Basal at transplanting, then biweekly feeding through flowering and fruit set.',
  },
  Potato: {
    n: '100–130 kg/ha', p: '60–80 kg/ha', k: '100–150 kg/ha',
    schedule: 'Full basal application at planting, light top-dress at hilling.',
  },
  Apple: {
    n: '50–70 kg/ha', p: '20–30 kg/ha', k: '60–80 kg/ha',
    schedule: 'Single spring application before bud break; split for young orchards.',
  },
  Grape: {
    n: '40–60 kg/ha', p: '20–30 kg/ha', k: '60–90 kg/ha',
    schedule: 'Bud-break application, second dose at veraison (fruit ripening).',
  },
  Cherry: {
    n: '60–80 kg/ha', p: '30–40 kg/ha', k: '60–80 kg/ha',
    schedule: 'Early spring application before bloom, light top-dress after harvest.',
  },
  Peach: {
    n: '70–100 kg/ha', p: '30–50 kg/ha', k: '80–100 kg/ha',
    schedule: 'Split application: dormant season and post-bloom.',
  },
  'Bell Pepper': {
    n: '90–110 kg/ha', p: '50–70 kg/ha', k: '110–130 kg/ha',
    schedule: 'Basal at transplanting, biweekly feeding through fruiting.',
  },
  Strawberry: {
    n: '60–90 kg/ha', p: '40–60 kg/ha', k: '90–120 kg/ha',
    schedule: 'Pre-plant basal dose, then light monthly feeding through fruiting.',
  },
  default: {
    n: '80–100 kg/ha', p: '40–60 kg/ha', k: '60–80 kg/ha',
    schedule: 'Basal application at planting, top-dress mid-season.',
  },
}

function parseCropFromLabel(label: string, fallback: string) {
  if (!label) return fallback
  const [crop] = label.split(' - ')
  return crop?.trim() || fallback
}

// Deterministic placeholder soil reading so the UI doesn't flicker on
// re-render. Swap for a real soil-sensor/API reading when connected.
function estimateSoilQuality(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return {
    ph: (6.0 + (hash % 15) / 10).toFixed(1),
    organicMatter: (2.0 + (hash % 30) / 10).toFixed(1),
    moisture: 30 + (hash % 25),
  }
}

function Fertilizer({ scan }: { scan: any }) {
  const label = scan?.predictions?.[0]?.label || 'No diagnosis'
  const cropName = parseCropFromLabel(label, scan?.crop || 'General crop')
  const targets = cropNutrientTargets[cropName] || cropNutrientTargets.default
  const priorityNutrients: string[] = scan?.nutrients || []
  const soil = estimateSoilQuality(`${scan?.farmName || 'field'}-${cropName}`)

  const isPriority = (name: string) =>
    priorityNutrients.some((n) => n.toLowerCase().includes(name.toLowerCase()))

  return (
    <div className="space-y-4">
      <Panel title="Crop nutrition recommendation">
        <div className="rounded-2xl border border-[#d5ff4d]/20 bg-[#d5ff4d]/[.05] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#d5ff4d]">
                {scan ? 'Based on latest crop analysis' : 'General guidance'}
              </div>
              <h3 className="mt-2 text-xl font-semibold">
                {cropName}
                {scan && (
                  <span className="ml-2 text-sm font-normal text-white/40">
                    · {label.replace(/ - /g, ' — ')}
                  </span>
                )}
              </h3>
            </div>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 font-mono text-[10px] text-white/45">
              SOIL DATA · ESTIMATED
            </span>
          </div>

          {priorityNutrients.length > 0 ? (
            <>
              <p className="mt-3 text-sm leading-6 text-white/50">
                Based on the detected condition, the model flags these nutrients as
                priorities — the cards below highlight them accordingly. Final quantities
                should always be confirmed with a lab soil test.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {priorityNutrients.map((n) => (
                  <span
                    key={n}
                    className="rounded-full border border-[#d5ff4d]/25 bg-[#d5ff4d]/[.08] px-3 py-1 text-[11px] text-[#d5ff4d]"
                  >
                    Priority · {n}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-white/50">
              Maintain balanced crop nutrition and avoid excessive application of any
              single nutrient. Final fertilizer quantity should be determined from a
              soil test.
            </p>
          )}
        </div>
      </Panel>

      {/* SOIL SNAPSHOT */}
      <Panel title="Soil snapshot (estimated)">
        <div className="grid gap-3 sm:grid-cols-3">
          <SoilGauge label="Soil pH" value={soil.ph} range="6.0–7.5 ideal" />
          <SoilGauge label="Organic matter" value={`${soil.organicMatter}%`} range="3%+ ideal" />
          <SoilGauge label="Moisture" value={`${soil.moisture}%`} range="35–50% ideal" />
        </div>
        <p className="mt-4 text-xs leading-5 text-white/30">
          These readings are estimated pending a connected soil sensor. Connect a
          probe for live pH, EC, and moisture data.
        </p>
      </Panel>

      {/* NPK CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <NutrientCard
          symbol="N" name="Nitrogen" target={targets.n}
          highlight={isPriority('Nitrogen') || isPriority('NPK')}
        />
        <NutrientCard
          symbol="P" name="Phosphorus" target={targets.p}
          highlight={isPriority('Phosphorus') || isPriority('NPK')}
        />
        <NutrientCard
          symbol="K" name="Potassium" target={targets.k}
          highlight={isPriority('Potassium') || isPriority('NPK')}
        />
      </div>

      {priorityNutrients.some((n) => /calcium|micronutrient/i.test(n)) && (
        <div className="grid gap-4 md:grid-cols-2">
          {priorityNutrients
            .filter((n) => /calcium|micronutrient/i.test(n))
            .map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-[#f7c948]/25 bg-[#f7c948]/[.05] p-5"
              >
                <div className="text-lg font-semibold text-[#f7c948]">{n}</div>
                <div className="mt-2 text-sm text-white/50">
                  Flagged by the model as important for this condition — apply as a
                  foliar spray or soil amendment per local product guidance.
                </div>
              </div>
            ))}
        </div>
      )}

      <Panel title="Application schedule">
        <div className="flex gap-3">
          <Sprout className="mt-1 shrink-0 text-[#d5ff4d]" size={18} />
          <p className="text-sm leading-6 text-white/60">{targets.schedule}</p>
        </div>
      </Panel>
    </div>
  )
}

function SoilGauge({ label, value, range }: { label: string; value: string; range: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="text-[10px] uppercase tracking-widest text-white/35">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[#d5ff4d]">{value}</div>
      <div className="mt-1 text-[10px] text-white/30">{range}</div>
    </div>
  )
}

function NutrientCard({
  symbol, name, target, highlight = false,
}: { symbol: string; name: string; target: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight ? 'border-[#ef8354]/30 bg-[#ef8354]/[.06]' : 'border-white/10 bg-white/[.045]'
      }`}
    >
      <div className={`text-3xl font-semibold ${highlight ? 'text-[#ef8354]' : 'text-[#d5ff4d]'}`}>
        {symbol}
      </div>
      <div className="mt-3 text-sm font-medium">{name}</div>
      <div className="mt-2 text-sm text-white/60">{target}</div>
      {highlight && (
        <div className="mt-2 text-xs font-medium text-[#ef8354]">
          Flagged as priority for this scan
        </div>
      )}
    </div>
  )
}

function Weather({ scan }: { scan: any }) {
  const prediction = scan?.predictions?.[0]
  const label = prediction?.label || 'No disease detected'
  const confidence = Math.round((prediction?.confidence || 0) * 100)

  // Current conditions (replace with a live weather API when available)
  const conditions = { temp: 24, humidity: 64, wind: 12, rainRisk: 18 }

  // Severity now comes straight from the backend's advice() logic
  // (none / medium / high) instead of guessing from keywords.
  const severityMap: Record<string, { label: string; styles: string; description: string }> = {
    none: {
      label: 'LOW',
      styles: 'bg-[#d5ff4d]/10 text-[#d5ff4d]',
      description: 'No disease detected — current conditions pose low concern. Continue routine monitoring.',
    },
    medium: {
      label: 'MODERATE',
      styles: 'bg-[#f7c948]/15 text-[#f7c948]',
      description: 'The detected disease can spread under favourable environmental conditions. Monitor humidity, leaf wetness, and affected areas closely.',
    },
    high: {
      label: 'HIGH',
      styles: 'bg-[#ef8354]/15 text-[#ef8354]',
      description: 'This condition spreads quickly and needs prompt attention. Re-scan affected plants and act on the treatment plan without delay.',
    },
  }

  const risk = severityMap[scan?.severity] || severityMap.none

  const riskFactors = [
    {
      label: 'Humidity favorability',
      active: conditions.humidity >= 60,
      detail: `${conditions.humidity}% humidity ${conditions.humidity >= 60 ? 'favors fungal spread' : 'is within a safer range'}`,
    },
    {
      label: 'Leaf wetness risk',
      active: conditions.rainRisk >= 30,
      detail: `${conditions.rainRisk}% rain chance ${conditions.rainRisk >= 30 ? 'raises leaf-wetness duration' : 'keeps leaf-wetness duration low'}`,
    },
    {
      label: 'Temperature suitability',
      active: conditions.temp >= 18 && conditions.temp <= 27,
      detail: `${conditions.temp}° is ${conditions.temp >= 18 && conditions.temp <= 27 ? 'in the range many leaf pathogens prefer' : 'outside the range most leaf pathogens prefer'}`,
    },
  ]

  const forecast = [
    { day: 'TH', value: 28 }, { day: 'FR', value: 34 }, { day: 'SA', value: 22 },
    { day: 'SU', value: 42 }, { day: 'MO', value: 58 }, { day: 'TU', value: 36 },
    { day: 'WE', value: 26 },
  ]
  const maxValue = Math.max(...forecast.map((f) => f.value))

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
      <Panel title="Disease risk forecast">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/15 p-5">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/35">
              Latest diagnosis
            </div>
            <div className="mt-2 text-xl font-semibold">{label.replace(/ - /g, ' — ')}</div>
            {scan && (
              <div className="mt-1 text-xs text-white/35">
                Model confidence: {confidence}%
                {scan.recoveryChance != null && ` · Recovery outlook: ${scan.recoveryChance}%`}
              </div>
            )}
          </div>
          <div className={`rounded-full px-4 py-2 font-mono text-[10px] ${risk.styles}`}>
            {risk.label} RISK
          </div>
        </div>

        <p className="mb-5 text-sm leading-6 text-white/45">{risk.description}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {riskFactors.map((factor) => (
            <div
              key={factor.label}
              title={factor.detail}
              className={`rounded-full border px-3 py-1.5 text-[11px] ${
                factor.active
                  ? 'border-[#f7c948]/30 bg-[#f7c948]/10 text-[#f7c948]'
                  : 'border-white/10 bg-white/[.03] text-white/35'
              }`}
            >
              {factor.label}
            </div>
          ))}
        </div>

        <div className="flex h-60 items-end gap-3">
          {forecast.map(({ day, value }) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-white/45">{value}%</span>
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-[#d5ff4d] to-[#ef8354]"
                style={{ height: `${(value / maxValue) * 190}px`, opacity: 0.45 + value / 150 }}
              />
              <span className="font-mono text-[10px] text-white/35">{day}</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="Current conditions">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Temperature', value: `${conditions.temp}°`, Icon: Thermometer },
              { label: 'Humidity', value: `${conditions.humidity}%`, Icon: Droplets },
              { label: 'Wind', value: `${conditions.wind} km/h`, Icon: Wind },
              { label: 'Rain risk', value: `${conditions.rainRisk}%`, Icon: CloudRain },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <Icon size={16} className="text-[#d5ff4d]" />
                <div className="mt-6 text-xs text-white/40">{label}</div>
                <div className="mt-1 text-lg font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recommended actions">
          <div className="space-y-3 text-sm text-white/55">
            {risk.label === 'HIGH' && (
              <>
                <Check text="Re-scan affected plants within 24 hours" />
                <Check text="Isolate or remove severely affected material" />
                <Check text="Contact a local agricultural expert" />
              </>
            )}
            {risk.label === 'MODERATE' && (
              <>
                <Check text="Monitor humidity and leaf wetness daily" />
                <Check text="Improve airflow around affected plants" />
                <Check text="Re-scan in 3–5 days" />
              </>
            )}
            {risk.label === 'LOW' && (
              <>
                <Check text="Continue routine field inspection" />
                <Check text="Maintain current irrigation schedule" />
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}

/* FIXED: HistoryView had missing JSX/map closures */
function HistoryView({ history }: { history: any[] }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[.045] p-5 md:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#d5ff4d]">
            Neon records
          </div>

          <p className="mt-2 text-sm text-white/40">
            Persisted crop scans, newest first.
          </p>
        </div>

        <button
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/55"
          onClick={() => location.reload()}
        >
          Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/35">
          No scans loaded yet. Run a crop analysis to create the first
          record.
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/15 p-4"
            >
              <div>
  <div className="font-medium">
    {item.farmName} · {item.crop}
  </div>

  <div className="mt-1 text-sm text-[#d5ff4d]">
    {item.predictions?.[0]?.label || item.status}
  </div>

  <div className="mt-1 text-xs text-white/35">
    {new Date(item.createdAt).toLocaleString()}
  </div>
</div>

              <div className="flex items-center gap-4">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
  {item.predictions?.[0]
    ? `${Math.round(
        item.predictions[0].confidence * 100,
      )}% confidence`
    : item.status}
</span>

                <div className="text-right">
                  <b className="block text-xl text-[#d5ff4d]">
                    {item.healthScore}%
                  </b>

                  <span className="block text-[9px] uppercase tracking-widest text-white/30">
                    Health score
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Analytics({ history }: { history: any[] }) {
  const total = history.length
  const healthy = history.filter((h) => String(h.status || '').toLowerCase() === 'healthy' || h.healthy === true).length
  const diseased = total - healthy
  const avgConfidence = total ? Math.round(history.reduce((sum, h) => sum + (h.healthScore || 0), 0) / total) : 0
  const healthyPct = total ? Math.round((healthy / total) * 100) : 0
  const cropCounts = history.reduce<Record<string, number>>((acc, h) => { const key = h.crop || 'Unknown'; acc[key] = (acc[key] || 0) + 1; return acc }, {})
  const topCrops = Object.entries(cropCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)
  return <div className="space-y-4">
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Metric icon={ScanLine} label="Total scans" value={String(total)} suffix="" note="Saved analyses" />
      <Metric icon={Leaf} label="Healthy scans" value={String(healthy)} suffix="" note="Healthy predictions" />
      <Metric icon={ShieldCheck} label="Disease detections" value={String(diseased)} suffix="" note="Requires attention" />
      <Metric icon={Gauge} label="Average confidence" value={String(avgConfidence)} suffix="%" note="Model confidence" />
    </section>
    <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <Panel title="Health breakdown">
        {total === 0 ? <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/35">No scans yet. Run a crop analysis to see analytics.</div> : <>
          <div className="flex items-center justify-between text-sm text-white/50"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#d5ff4d]" />{healthy} healthy</span><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#ef8354]" />{diseased} diseased</span></div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#ef8354]/25"><div className="h-full rounded-full bg-[#d5ff4d] transition-all duration-700" style={{ width: `${healthyPct}%` }} /></div>
          <div className="mt-2 text-xs text-white/35">{healthyPct}% of scanned leaves came back healthy</div>
          {topCrops.length > 0 && <div className="mt-6 border-t border-white/10 pt-4"><div className="mb-3 text-xs uppercase tracking-widest text-white/30">Most scanned crops</div><div className="space-y-2">{topCrops.map(([crop, count]) => <div key={crop} className="flex items-center justify-between text-sm"><span className="text-white/60">{crop}</span><span className="text-[#d5ff4d]">{count}</span></div>)}</div></div>}
        </>}
      </Panel>
      <Panel title="Recent scans">
        {history.slice(0, 5).length === 0 ? <div className="text-sm text-white/35">Nothing scanned yet.</div> : <div className="space-y-2">{history.slice(0, 5).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-black/15 p-3 text-sm"><span className="truncate">{item.crop} · {item.status}</span><b className="shrink-0 text-[#d5ff4d]">{item.healthScore}%</b></div>)}</div>}
      </Panel>
    </div>
  </div>
}

function Heatmap({
  compact = false,
}: {
  compact?: boolean
}) {
  return <IndiaFarmMap compact={compact} />
}


let puterLoadPromise: Promise<any> | null = null

function loadPuter() {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new Error('Puter can only run in the browser.'),
    )
  }

  if ((window as any).puter) {
    return Promise.resolve((window as any).puter)
  }

  if (puterLoadPromise) {
    return puterLoadPromise
  }

  puterLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-puter-ai]',
    ) as HTMLScriptElement | null

    if (existingScript) {
      const checkPuter = () => {
        if ((window as any).puter) {
          resolve((window as any).puter)
        } else {
          setTimeout(checkPuter, 100)
        }
      }

      checkPuter()
      return
    }

    const script = document.createElement('script')

    script.src = 'https://js.puter.com/v2/'
    script.async = true
    script.dataset.puterAi = 'true'

    script.onload = () => {
      if ((window as any).puter) {
        resolve((window as any).puter)
      } else {
        reject(
          new Error(
            'Puter loaded but window.puter is unavailable.',
          ),
        )
      }
    }

    script.onerror = () => {
      reject(
        new Error('Failed to load Puter.js.'),
      )
    }

    document.head.appendChild(script)
  })

  return puterLoadPromise
}


function Voice() {
  const [language, setLanguage] = useState('English')

  useEffect(() => {
    const saved = getSavedSiteLanguage()
    const match = SITE_LANGUAGES.find((item) => item.code === saved)
    if (match) {
      setLanguage(match.label)
    }
  }, [])
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)


 const languageConfig: Record<
  string,
  {
    speech: string
    name: string
  }
> = {
  English: {
    speech: 'en-IN',
    name: 'English',
  },

  हिंदी: {
    speech: 'hi-IN',
    name: 'Hindi',
  },

  मराठी: {
    speech: 'mr-IN',
    name: 'Marathi',
  },

  ગુજરાતી: {
    speech: 'gu-IN',
    name: 'Gujarati',
  },

  தமிழ்: {
    speech: 'ta-IN',
    name: 'Tamil',
  },
}

  const currentLanguage =
    languageConfig[language] || languageConfig.English

const getBestVoice = (languageCode: string) => {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return null
  }

  const voices = window.speechSynthesis.getVoices()

  if (!voices.length) {
    return null
  }

  let voice = voices.find(
    (v) =>
      v.lang.toLowerCase() ===
      languageCode.toLowerCase(),
  )

  if (voice) return voice

  const prefix =
    languageCode.split('-')[0].toLowerCase()

  voice = voices.find((v) =>
    v.lang.toLowerCase().startsWith(prefix),
  )

  return voice || null
}

  // ============================================
  // ASK PUTER AI
  // ============================================
  const askPuterAI = async (question: string) => {
    if (!question.trim()) return

    setLoading(true)
    setResponse('')

    try {
      const prompt = `
You are AgriVision, an AI farming assistant helping farmers.

The farmer is communicating in ${currentLanguage.name}.

Farmer's question:
"${question}"

Answer the farmer in ${currentLanguage.name}.

Your answer should be:
- Simple and easy for a farmer to understand
- Practical
- Concise
- Focused on agriculture
- Helpful for crop disease, pest, irrigation, fertilizer, soil and crop-care questions

If the question is about a crop disease:
1. Identify the likely disease/problem if possible.
2. Explain the symptoms.
3. Give practical remedy/treatment guidance.
4. Give prevention advice.
5. Do not invent pesticide dosages.
6. For serious cases, recommend confirming with a local agricultural expert.

Do not say that you are unable to answer simply because the question is in an Indian language.

Respond ONLY with the useful farming advice.
`

      const result: any = await puter.ai.chat(prompt, {
        model: 'gpt-5.4-nano',
        temperature: 0.3,
      })

      let text = ''

      if (typeof result === 'string') {
        text = result
      } else if (
        result?.message?.content
      ) {
        if (typeof result.message.content === 'string') {
          text = result.message.content
        } else if (
          Array.isArray(result.message.content)
        ) {
          text = result.message.content
            .map((item: any) =>
              typeof item === 'string'
                ? item
                : item?.text || '',
            )
            .join('')
        }
      } else if (result?.text) {
        text = result.text
      }

      if (!text.trim()) {
        text =
          'Sorry, I could not generate a farming response.'
      }

      setResponse(text)
    } catch (error) {
      console.error(
        'Puter AI error:',
        error,
      )

      setResponse(
        'Sorry, the AgriVision AI assistant could not process your question. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // SPEECH RECOGNITION
  // ============================================
  const record = () => {
    if (listening || loading) return

    const Recognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!Recognition) {
      setHeard(
        'Voice recognition is not supported in this browser. Please use Google Chrome.',
      )
      return
    }

    const recognition = new Recognition()

    recognition.lang = currentLanguage.speech
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setHeard(
        `Listening in ${currentLanguage.name}...`,
      )
    }

    recognition.onresult = async (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript || ''

      setHeard(transcript)

      await askPuterAI(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error(
        'Speech recognition error:',
        event,
      )

      setListening(false)

      if (event?.error === 'not-allowed') {
        setHeard(
          'Microphone permission denied. Please allow microphone access.',
        )
      } else if (
        event?.error === 'no-speech'
      ) {
        setHeard(
          'No speech detected. Please try again.',
        )
      } else {
        setHeard(
          'Voice recognition failed. Please try again.',
        )
      }
    }

    recognition.onend = () => {
      setListening(false)
    }

    try {
      recognition.start()
    } catch (error) {
      console.error(
        'Could not start recognition:',
        error,
      )

      setListening(false)
    }
  }

  // ============================================
  // PUTER TEXT TO SPEECH
  // ============================================
 

const speak = async () => {
  if (!response.trim() || speaking) return

  setSpeaking(true)

  try {
    const puter = await loadPuter()

    // Select Gemini TTS voice.
    // Gemini automatically handles the requested
    // language from the instructions.
    const languageInstruction: Record<string, string> = {
      English:
        'Speak naturally in English with a clear Indian accent.',

      हिंदी:
        'Speak naturally in Hindi. Use clear Indian Hindi pronunciation.',

      मराठी:
        'Speak naturally in Marathi. Use authentic Marathi pronunciation. Do not speak English.',

      ગુજરાતી:
        'Speak naturally in Gujarati. Use authentic Gujarati pronunciation. Do not speak English.',

      தமிழ்:
        'Speak naturally in Tamil. Use authentic Tamil pronunciation. Do not speak English.',
    }

    const instruction =
      languageInstruction[language] ||
      languageInstruction.English

    console.log(
      'Puter TTS language:',
      language,
    )

    console.log(
      'Puter TTS instruction:',
      instruction,
    )

    console.log(
      'Text being spoken:',
      response,
    )

    /*
     * Gemini TTS through Puter.
     *
     * IMPORTANT:
     * We DO NOT send mr-IN / gu-IN / ta-IN here.
     * Gemini receives the language through the
     * natural-language instruction instead.
     */
    const audio =
      await puter.ai.txt2speech(
        response,
        {
          provider: 'gemini',
          model: 'gemini-2.5-flash-preview-tts',
          voice: 'Kore',
          instructions: instruction,
        },
      )

    if (!audio) {
      throw new Error(
        'Puter Gemini TTS returned no audio.',
      )
    }

    /*
     * Puter returns an HTMLAudioElement.
     */
    if (
      audio instanceof HTMLAudioElement
    ) {
      audio.onended = () => {
        setSpeaking(false)
      }

      audio.onerror = () => {
        console.error(
          'Audio playback failed.',
        )

        setSpeaking(false)
      }

      await audio.play()
      return
    }

    /*
     * Fallback in case Puter returns a URL/blob
     * instead of an HTMLAudioElement.
     */
    let audioUrl = ''

    if (typeof audio === 'string') {
      audioUrl = audio
    } else if (audio instanceof Blob) {
      audioUrl =
        URL.createObjectURL(audio)
    } else if (
      (audio as any)?.url
    ) {
      audioUrl =
        (audio as any).url
    }

    if (!audioUrl) {
      throw new Error(
        'Could not determine audio output.',
      )
    }

    const player =
      new Audio(audioUrl)

    player.onended = () => {
      setSpeaking(false)

      if (audio instanceof Blob) {
        URL.revokeObjectURL(
          audioUrl,
        )
      }
    }

    player.onerror = () => {
      setSpeaking(false)

      if (audio instanceof Blob) {
        URL.revokeObjectURL(
          audioUrl,
        )
      }
    }

    await player.play()
  } catch (error) {
    console.error(
      'Puter Gemini multilingual TTS error:',
      error,
    )

    setSpeaking(false)

    setHeard(
      `Unable to generate ${language} voice right now. Please try again.`,
    )
  }
}


  // ============================================
  // BROWSER SPEECH FALLBACK
  // ============================================
  const browserSpeak = () => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return
    }

    window.speechSynthesis.cancel()

    const message =
      new SpeechSynthesisUtterance(response)

    message.lang =
      currentLanguage.speech

    message.rate = 0.9
    message.pitch = 1
    message.volume = 1

    message.onstart = () => {
      setSpeaking(true)
    }

    message.onend = () => {
      setSpeaking(false)
    }

    message.onerror = () => {
      setSpeaking(false)
    }

    window.speechSynthesis.speak(
      message,
    )
  }

  // ============================================
  // STOP SPEAKING
  // ============================================
  const stopSpeaking = () => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel()
    }

    setSpeaking(false)
  }

  // ============================================
  // LANGUAGE SELECTION
  // ============================================
  const selectLanguage = (
    selected: string,
  ) => {
    stopSpeaking()

    setLanguage(selected)
    setHeard('')
    setResponse('')
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">

      {/* ========================================
          LANGUAGE LAYER
      ======================================== */}

      <Panel title="Language layer">

        <div className="mb-5">
          <div className="text-sm font-medium">
            Choose your language
          </div>

          <div className="mt-1 text-xs text-white/35">
            Speak naturally and receive AI farming
            guidance in your preferred language.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">

          {[
            'English',
            'हिंदी',
            'मराठी',
            'ગુજરાતી',
            'தமிழ்',
          ].map((l) => (

            <button
              key={l}
              onClick={() =>
                selectLanguage(l)
              }
              className={`rounded-xl border p-4 text-left text-sm transition hover:-translate-y-1 ${
                language === l
                  ? 'border-[#d5ff4d] bg-[#d5ff4d]/10 text-[#d5ff4d]'
                  : 'border-white/10 text-white/55 hover:border-white/20'
              }`}
            >

              <div className="flex items-center justify-between">
                <span>{l}</span>

                {language === l && (
                  <span className="size-2 rounded-full bg-[#d5ff4d]" />
                )}
              </div>

              <span className="mt-1 block text-[10px] text-white/30">
                {language === l
                  ? 'Active language'
                  : 'Select language'}
              </span>

            </button>

          ))}

        </div>

        <div className="mt-5 rounded-xl border border-[#d5ff4d]/20 bg-[#d5ff4d]/[.05] p-4">

          <div className="font-mono text-[9px] uppercase tracking-widest text-[#d5ff4d]">
            Active language
          </div>

          <div className="mt-2 text-lg font-semibold">
            {currentLanguage.name}
          </div>

          <div className="mt-1 font-mono text-[10px] text-white/30">
            {currentLanguage.speech}
          </div>

        </div>

      </Panel>

      {/* ========================================
          AI VOICE ASSISTANT
      ======================================== */}

      <Panel title="AI Voice Farming Assistant">

        {/* MICROPHONE */}

        <div className="flex items-center gap-4">

          <button
            onClick={record}
            disabled={
              listening || loading
            }
            className={`grid size-16 place-items-center rounded-full text-[#102016] transition ${
              listening
                ? 'animate-pulse bg-[#ef8354]'
                : 'bg-[#d5ff4d] hover:scale-105'
            } disabled:cursor-not-allowed disabled:opacity-70`}
            aria-label="Start voice recognition"
          >

            <Mic size={24} />

          </button>

          <div>

            <div className="font-medium">

              {listening
                ? 'Listening…'
                : loading
                  ? 'AgriVision is thinking…'
                  : 'Tap to speak'}

            </div>

            <div className="mt-1 text-sm text-white/40">

              {listening
                ? `Speak in ${currentLanguage.name}`
                : `AI assistant • ${currentLanguage.name}`}

            </div>

          </div>

        </div>

        {/* FARMER QUESTION */}

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-4">

          <div className="font-mono text-[9px] uppercase tracking-widest text-white/30">
            Farmer's question
          </div>

          <div className="mt-2 min-h-12 text-sm leading-6 text-white/70">

            {heard ||
              'Tap the microphone and ask your farming question.'}

          </div>

        </div>

        {/* AI RESPONSE */}

        <div className="mt-4 rounded-2xl border border-[#d5ff4d]/20 bg-[#d5ff4d]/[.05] p-4">

          <div className="flex items-center justify-between">

            <div className="font-mono text-[9px] uppercase tracking-widest text-[#d5ff4d]">
              AgriVision AI guidance
            </div>

            {loading && (
              <div className="text-xs text-[#d5ff4d]">
                Generating...
              </div>
            )}

          </div>

          <div className="mt-2 min-h-16 text-sm leading-6 text-white/70">

            {response ||
              'Your personalized farming advice will appear here.'}

          </div>

        </div>

        {/* SPEAK RESPONSE */}

        <div className="mt-5 flex flex-wrap gap-2">

          <button
            onClick={speak}
            disabled={
              !response ||
              loading ||
              speaking
            }
            className="rounded-xl bg-[#d5ff4d] px-4 py-3 text-sm font-semibold text-[#102016] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >

            {speaking
              ? '🔊 Speaking…'
              : '🔊 Speak response'}

          </button>

          {speaking && (

            <button
              onClick={stopSpeaking}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 hover:bg-white/5"
            >
              Stop
            </button>

          )}

        </div>

        <div className="mt-4 rounded-xl border border-white/5 bg-white/[.02] p-3 text-[10px] leading-5 text-white/30">
          Example: "माझ्या टोमॅटोच्या पानांवर
          काळे डाग आहेत, काय करावे?"
        </div>

      </Panel>

    </div>
  )
}



function QR() {
  return (
    <div className="grid gap-4 md:grid-cols-[.7fr_1.3fr]">
      <ProfileQR />

      <Panel title="North Field profile">
        <FarmerAuth />

        <Mini
          title="Shareable farm identity"
          body="Real QR image linking to the farmer profile. Download it for field signage or a co-operative record."
        />

        <Mini
          title="Profile status"
          body="Google-authenticated farmers can keep private scan history and crop details."
        />

        <a
          href="https://www.google.com/maps/search/?api=1&query=20.0,73.78"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-xl bg-[#d5ff4d] px-4 py-3 text-sm font-semibold text-[#102016]"
        >
          Open farm in Google Maps
        </a>
      </Panel>
    </div>
  )
}

function Schemes() {
  const schemes = [
    { tag: 'ELIGIBILITY 92%', title: 'PM-KISAN support', body: 'Direct income support of ₹6,000/year to landholding farmer families, paid in three installments straight to your bank account.', portal: 'https://pmkisan.gov.in/', article: { url: 'https://pmkisan.gov.in/', label: 'Eligibility & guidelines' }, video: { id: 'eevlMKq005E', label: 'How PM-KISAN & PMFBY work' } },
    { tag: 'MATCHED', title: 'Micro irrigation subsidy', body: 'Up to 55% subsidy on drip and sprinkler irrigation systems under the Per Drop More Crop scheme (PMKSY).', portal: 'https://pdmc.da.gov.in/', article: { url: 'https://byjus.com/current-affairs/per-drop-more-crop/', label: 'Scheme overview' }, video: { id: 'tPnfnav0mrQ', label: 'Per Drop More Crop explained' } },
    { tag: '11 DAYS', title: 'Crop insurance window', body: 'Affordable crop insurance covering pre-sowing to post-harvest losses from weather, pests, and disease.', portal: 'https://pmfby.gov.in/', article: { url: 'https://www.ibef.org/government-schemes/fasal-bima-yojana', label: 'Scheme overview' }, video: { id: 'cfVa4n0sZK4', label: 'PMFBY explained' } },
  ]
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{schemes.map((s) => <SchemeCard key={s.title} {...s} />)}</div>
}
function SchemeCard({ tag, title, body, portal, article, video }: { tag: string; title: string; body: string; portal: string; article: { url: string; label: string }; video: { id: string; label: string } }) {
  return <div className="group rounded-[30px] border border-white/10 bg-white/[.045] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d5ff4d]/35 hover:bg-white/[.07]">
    <div className="mb-6 inline-flex rounded-full bg-[#d5ff4d]/10 px-3 py-1 font-mono text-[9px] text-[#d5ff4d]">{tag}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-white/45">{body}</p>
    <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" className="mt-5 block overflow-hidden rounded-2xl border border-white/10">
      <div className="relative">
        <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={video.label} className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/10"><div className="grid size-11 place-items-center rounded-full bg-[#d5ff4d] text-[#102016] shadow-lg"><Play size={18} fill="currentColor" /></div></div>
      </div>
      <div className="bg-black/20 px-3 py-2 text-xs text-white/60">{video.label}</div>
    </a>
    <div className="mt-4 space-y-2.5 text-sm">
      <a href={article.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/55 hover:text-white"><FileText size={14} className="text-[#d5ff4d]" />{article.label}</a>
      <a href={portal} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-[#d5ff4d]"><ExternalLink size={14} />Official portal</a>
    </div>
  </div>
}

function Offline() {
  const [retrying, setRetrying] = useState(false)
  const [queued, setQueued] = useState(1)
  const total = 3
  const synced = total - queued
  const retry = () => { setRetrying(true); window.setTimeout(() => { setQueued(0); setRetrying(false) }, 1100) }
  const items = [
    { icon: Gauge, label: '3 sensor packets', meta: 'North Field', status: 'synced' as const },
    { icon: CloudRain, label: 'Weather snapshot', meta: 'Uploaded', status: 'synced' as const },
    { icon: ScanLine, label: '1 crop scan', meta: queued ? (retrying ? 'Syncing…' : 'Waiting for signal') : 'Uploaded', status: (queued ? (retrying ? 'syncing' : 'waiting') : 'synced') as 'synced' | 'syncing' | 'waiting' },
  ]
  return <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
    <Panel title="Sync queue">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-white/50">{synced} of {total} items synced</span>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#d5ff4d] transition-all duration-700" style={{ width: `${(synced / total) * 100}%` }} /></div>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const styles = item.status === 'synced' ? 'text-[#d5ff4d] bg-[#d5ff4d]/10' : item.status === 'syncing' ? 'text-[#f7c948] bg-[#f7c948]/10' : 'text-white/50 bg-white/10'
          return <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-black/15 p-4">
            <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-white/5 text-white/60"><Icon size={16} /></div><div><div className="text-sm font-medium">{item.label}</div><div className="text-xs text-white/35">{item.meta}</div></div></div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${styles}`}>{item.status === 'synced' ? 'Synced' : item.status === 'syncing' ? 'Syncing' : 'Waiting'}</span>
          </div>
        })}
      </div>
      <button disabled={retrying || !queued} onClick={retry} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-white/60 transition hover:border-[#d5ff4d]/40 hover:text-white disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-white/60"><RefreshCw className={retrying ? 'animate-spin' : ''} size={15} />{queued ? 'Retry pending' : 'All caught up'}</button>
    </Panel>
    <Panel title="Offline mode">
      <div className="grid place-items-center rounded-2xl border border-[#d5ff4d]/20 bg-[#d5ff4d]/[.05] py-8">
        <div className="relative grid size-16 place-items-center rounded-full bg-[#d5ff4d]/15"><span className="absolute inset-0 animate-ping rounded-full bg-[#d5ff4d]/20" /><Wifi size={26} className="text-[#d5ff4d]" /></div>
        <div className="mt-4 text-center"><div className="font-medium text-[#d5ff4d]">Ready for low-signal work</div><div className="mt-1 text-xs text-white/40">Scans and readings queue automatically</div></div>
      </div>
      <p className="mt-5 text-sm leading-6 text-white/45">The queue is stored in the active device session and resumes on retry. Production offline persistence can be switched to IndexedDB/PWA caching.</p>
    </Panel>
  </div>
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[.045] p-5 md:p-7">
      <div className="mb-5 font-mono text-[10px] uppercase tracking-[.2em] text-white/35">
        {title}
      </div>

      {children}
    </div>
  )
}

function AccountMenu() {
  const { user, demo, logout } = useSession()
  const [open, setOpen] = useState(false)

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : demo
      ? 'DF'
      : 'FA'

  const doLogout = async () => {
    setOpen(false)
    await logout()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-xl bg-[#d5ff4d] text-sm font-semibold text-[#102016]"
        aria-label="Account menu"
      >
        {initials}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#102016] p-2 shadow-2xl">
            <div className="px-3 py-2 text-xs text-white/40">
              {demo
                ? 'Demo farm session'
                : user?.email ||
                  user?.phoneNumber ||
                  'Signed in'}
            </div>

            <button
              onClick={() => void doLogout()}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Mini({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className="border-t border-white/10 py-3 first:border-t-0 first:pt-0">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-xs leading-5 text-white/40">
        {body}
      </div>
    </div>
  )
}

function ActionCard({
  title,
  body,
  tag,
  tone = 'lime',
  href,
}: {
  title: string
  body: string
  tag: string
  tone?: 'lime' | 'orange'
  href?: string
}) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <>
      <div className="group rounded-[30px] border border-white/10 bg-white/[.045] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d5ff4d]/35 hover:bg-white/[.07]">
        <div
          className={`mb-8 inline-flex rounded-full px-3 py-1 font-mono text-[9px] ${
            tone === 'orange'
              ? 'bg-[#ef8354]/15 text-[#ef8354]'
              : 'bg-[#d5ff4d]/10 text-[#d5ff4d]'
          }`}
        >
          {done ? 'COMPLETED' : tag}
        </div>

        <h3 className="text-xl font-semibold">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-white/45">
          {body}
        </p>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center gap-2 text-sm text-[#d5ff4d]"
          >
            Official portal <ChevronRight size={15} />
          </a>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="mt-6 flex items-center gap-2 text-sm text-[#d5ff4d]"
          >
            {done ? 'Review completed plan' : 'Open action plan'}
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/65 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-[#d5ff4d]/25 bg-[#102016] p-7 shadow-2xl animate-reveal">
            <button
              onClick={() => setOpen(false)}
              className="float-right text-white/40"
            >
              ×
            </button>

            <div className="font-mono text-[10px] tracking-[.2em] text-[#d5ff4d]">
              ACTION PLAN
            </div>

            <h3 className="mt-3 text-3xl font-semibold">
              {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/55">
              {body}
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Inspect the affected crop area',
                'Apply the recommended field action',
                'Record a follow-up scan within 24 hours',
              ].map((step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-xl bg-white/[.05] p-3 text-sm"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-[#d5ff4d] text-xs font-bold text-[#102016]">
                    {i + 1}
                  </span>

                  {step}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setDone(true)
                setOpen(false)
              }}
              className="mt-6 w-full rounded-xl bg-[#d5ff4d] py-3 text-sm font-semibold text-[#102016]"
            >
              Mark plan completed
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Check({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2
        size={15}
        className="text-[#d5ff4d]"
      />
      {text}
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  suffix,
  note,
}: {
  icon: typeof Leaf
  label: string
  value: string
  suffix: string
  note: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.045] p-5">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">
          {label}
        </span>

        <Icon
          size={16}
          className="text-[#d5ff4d]"
        />
      </div>

      <div className="text-3xl font-semibold tracking-tight">
        {value}
        <span className="ml-1 text-sm font-normal text-white/35">
          {suffix}
        </span>
      </div>

      <div className="mt-2 text-xs text-[#d5ff4d]">
        {note}
      </div>
    </div>
  )
}

function Signal({
  icon: Icon,
  title,
  meta,
  color,
}: {
  icon: typeof Leaf
  title: string
  meta: string
  color: string
}) {
  return (
    <div className="flex items-center gap-3 border-t border-white/10 py-3 first:border-t-0 first:pt-0">
      <Icon
        size={17}
        className={color}
      />

      <div>
        <div className="text-sm font-medium">{title}</div>

        <div className="mt-1 text-xs text-white/35">
          {meta}
        </div>
      </div>
    </div>
  )
}