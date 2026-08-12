'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'

const profile = 'https://agrivision.app/farmer/om-north-field'
export function ProfileQR() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => { if (canvas.current) void QRCode.toCanvas(canvas.current, profile, { width: 220, margin: 2, color: { dark: '#102016', light: '#f1f4e7' } }) }, [])
  const download = () => { const link = document.createElement('a'); link.download = 'north-field-profile-qr.png'; link.href = canvas.current?.toDataURL('image/png') || ''; link.click() }
  return <div className="grid min-h-[400px] place-items-center rounded-[30px] border border-white/10 bg-[#f1f4e7] p-8 text-[#102016]"><div className="text-center"><canvas ref={canvas} className="mx-auto max-w-full rounded-xl"/><div className="mt-4 font-mono text-[9px] tracking-[.18em]">NORTH FIELD · VERIFIED</div><button onClick={download} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#102016] px-3 py-2 text-xs text-white"><Download size={13}/>Download QR</button></div></div>
}
