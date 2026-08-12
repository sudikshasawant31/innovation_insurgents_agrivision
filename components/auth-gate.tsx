'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithCustomToken, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { ArrowRight, CheckCircle2, Leaf, LockKeyhole, Smartphone, Sparkles } from 'lucide-react'
import { firebaseAuth, firebaseDb } from '@/lib/firebase'
import { FarmerProfileSetup, type FarmerProfile } from './farmer-profile-setup'

type SessionContextValue = { user: User | null; demo: boolean; profile: FarmerProfile | null; logout: () => Promise<void> }
const SessionContext = createContext<SessionContextValue | null>(null)
export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside AuthGate')
  return ctx
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [demo, setDemo] = useState(false); const [profile,setProfile] = useState<FarmerProfile | null>(null); const [profileChecked,setProfileChecked] = useState(false)
  useEffect(() => firebaseAuth ? onAuthStateChanged(firebaseAuth, setUser) : undefined, [])
  useEffect(() => { const uid = user?.uid || (demo ? 'demo-farmer' : ''); if (!uid) return; setProfileChecked(false); (async () => { try { const saved = firebaseDb ? (await getDoc(doc(firebaseDb,'farmerProfiles',uid))).data() : JSON.parse(localStorage.getItem(`agrivision-profile-${uid}`) || 'null'); if (saved) setProfile(saved as FarmerProfile) } finally { setProfileChecked(true) } })() }, [user, demo])
  const logout = async () => { if (firebaseAuth) await signOut(firebaseAuth); setDemo(false); setProfile(null); setProfileChecked(false) }
  const uid = user?.uid || (demo ? 'demo-farmer' : '')
  if (uid && !profileChecked) return <main className="grid min-h-screen place-items-center bg-[#08150e] text-[#d5ff4d]">Loading your farm profile…</main>
  if (uid && !profile) return <FarmerProfileSetup uid={uid} initialName={user?.displayName} onDone={setProfile}/>
  if (user || demo) return <SessionContext.Provider value={{ user, demo, profile, logout }}>{children}</SessionContext.Provider>
  return <LoginPage onDemo={() => setDemo(true)} />
}

function LoginPage({ onDemo }: { onDemo: () => void }) {
  const [mode,setMode] = useState<'google'|'phone'>('google'); const [phone,setPhone] = useState(''); const [code,setCode] = useState(''); const [otpSent,setOtpSent] = useState(false); const [message,setMessage] = useState(''); const [loading,setLoading] = useState(false)

  const google = () => { setLoading(true); window.location.href = '/api/auth/google' }

  const requestCode = async () => {
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) { setMessage('Use country code, for example +919876543210.'); return }
    setLoading(true); setMessage('')
    try {
      const res = await fetch('/api/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) })
      const data = await res.json()
      if (!res.ok) { setMessage(data.error || 'Could not send OTP.'); return }
      setOtpSent(true); setMessage('OTP sent via SMS. Enter the code below.')
    } catch { setMessage('Could not reach the server. Please try again.') } finally { setLoading(false) }
  }

  const verify = async () => {
    if (!code) return
    setLoading(true); setMessage('')
    try {
      const res = await fetch('/api/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, code }) })
      const data = await res.json()
      if (!res.ok || !data.token) { setMessage(data.error || 'That OTP is not valid. Please check and try again.'); return }
      if (!firebaseAuth) { setMessage('Firebase is not configured on the client yet.'); return }
      await signInWithCustomToken(firebaseAuth, data.token)
    } catch { setMessage('That OTP is not valid. Please check and try again.') } finally { setLoading(false) }
  }

  return <main className="relative min-h-screen overflow-hidden bg-[#08150e] text-[#eff7e9]"><div className="auth-orb auth-orb-one"/><div className="auth-orb auth-orb-two"/><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(206,255,76,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(206,255,76,.07)_1px,transparent_1px)] [background-size:48px_48px]"/><div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[1.1fr_.9fr] lg:px-12"><section className="animate-reveal"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-2xl bg-[#d5ff4d] text-[#102016] shadow-[0_0_45px_rgba(213,255,77,.38)]"><Leaf/></div><span className="font-mono text-xs tracking-[.32em] text-[#d5ff4d]">AGRIVISION AI</span></div><div className="mt-12 inline-flex items-center gap-2 rounded-full border border-[#d5ff4d]/25 bg-[#d5ff4d]/10 px-3 py-1 text-xs text-[#d5ff4d]"><Sparkles size={13}/> Smart agriculture, made personal</div><h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[.95] tracking-[-.06em] md:text-7xl">Your farm deserves its own intelligence.</h1><p className="mt-6 max-w-xl text-base leading-7 text-white/55">One secure account for your scans, field locations, health history, remedies, and QR farm identity—on mobile or desktop.</p><div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">{[['Private profiles','Every farmer gets a separate space'],['Live intelligence','Camera, weather, and action plans'],['Low-signal ready','Field workflows stay responsive']].map(([title,copy]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><CheckCircle2 size={15} className="text-[#d5ff4d]"/><div className="mt-4 text-sm font-medium">{title}</div><p className="mt-1 text-xs leading-5 text-white/40">{copy}</p></div>)}</div></section><section className="animate-reveal-delay rounded-[32px] border border-white/10 bg-[#112019]/85 p-6 shadow-2xl backdrop-blur-xl md:p-8"><div className="font-mono text-[10px] tracking-[.24em] text-[#d5ff4d]">FARMER SIGN IN</div><h2 className="mt-3 text-3xl font-semibold">Welcome to your fields.</h2><div className="mt-7 grid grid-cols-2 rounded-xl bg-black/20 p-1"><button onClick={() => setMode('google')} className={`rounded-lg py-2 text-sm ${mode === 'google' ? 'bg-[#d5ff4d] font-semibold text-[#102016]' : 'text-white/45'}`}>Google</button><button onClick={() => setMode('phone')} className={`rounded-lg py-2 text-sm ${mode === 'phone' ? 'bg-[#d5ff4d] font-semibold text-[#102016]' : 'text-white/45'}`}>Mobile OTP</button></div>{mode === 'google' ? <button onClick={google} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-[#102016] disabled:opacity-60"><span className="grid size-5 place-items-center rounded-full bg-[#4285F4] text-[11px] text-white">G</span>{loading ? 'Connecting…' : 'Continue with Google'}</button> : <div className="mt-5 space-y-3"><label className="block text-xs text-white/50">Mobile number</label><div className="flex gap-2"><input value={phone} onChange={e=>{setPhone(e.target.value); setOtpSent(false)}} placeholder="+91 98765 43210" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#d5ff4d]"/><button onClick={() => void requestCode()} disabled={loading} className="rounded-xl bg-[#d5ff4d] px-4 text-sm font-semibold text-[#102016] disabled:opacity-60">{otpSent ? 'Resend' : 'Send OTP'}</button></div>{otpSent && <div className="flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit OTP" inputMode="numeric" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#d5ff4d]"/><button onClick={() => void verify()} disabled={loading} className="rounded-xl border border-[#d5ff4d]/40 px-4 text-sm text-[#d5ff4d] disabled:opacity-60">Verify</button></div>}</div>}{message && <p className="mt-4 rounded-xl border border-[#d5ff4d]/15 bg-[#d5ff4d]/[.06] p-3 text-xs leading-5 text-[#d5ff4d]">{message}</p>}<button onClick={onDemo} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-white/60 transition hover:border-[#d5ff4d]/40 hover:text-white">Explore demo farm <ArrowRight size={16}/></button><div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/30"><LockKeyhole size={12}/> Twilio + Firebase-secured identity <span>·</span><Smartphone size={12}/> Mobile ready</div></section></div></main>
}