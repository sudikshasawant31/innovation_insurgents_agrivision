'use client'

import { useState } from 'react'

export function FarmerAuth() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = () => { setLoading(true); window.location.href = '/api/auth/google' }

  return <>
    <button onClick={() => setOpen(true)} className="grid size-9 place-items-center rounded-xl bg-[#d5ff4d] text-xs font-semibold text-[#102016]" aria-label="Open farmer account">OM</button>
    {open && <div className="fixed inset-0 z-[100] grid place-items-center bg-[#061009]/70 p-5 backdrop-blur-md"><section className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#102016] p-7 shadow-2xl"><button onClick={() => setOpen(false)} className="float-right text-white/40">×</button><div className="font-mono text-[10px] tracking-[.22em] text-[#d5ff4d]">FARMER IDENTITY</div><h3 className="mt-3 text-3xl font-semibold">One farm. One secure profile.</h3><p className="mt-3 text-sm leading-6 text-white/50">Sign in with Google to securely save farm locations, scans, QR profile and treatment history.</p><button onClick={login} disabled={loading} className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#102016] disabled:opacity-60"><span className="grid size-5 place-items-center rounded-full bg-[#4285F4] text-[11px] text-white">G</span>{loading ? 'Connecting…' : 'Continue with Google'}</button><p className="mt-4 text-center text-xs text-white/35">Redirects to Google · Firebase-backed identity</p></section></div>}
  </>
}
