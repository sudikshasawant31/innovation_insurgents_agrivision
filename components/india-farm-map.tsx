'use client'

import { ExternalLink, MapPin } from 'lucide-react'
import { useState } from 'react'

const farms = [
  { name: 'Nashik Vineyard', state: 'Maharashtra', health: 91, risk: 'Low risk', lat: 20.00, lng: 73.78, x: '44%', y: '48%' },
  { name: 'Pune Tomato Plot', state: 'Maharashtra', health: 68, risk: 'Early blight watch', lat: 18.52, lng: 73.86, x: '43%', y: '52%' },
  { name: 'Kolar Field A', state: 'Karnataka', health: 54, risk: 'High humidity', lat: 13.14, lng: 78.13, x: '46%', y: '69%' },
  { name: 'Anand Dairy Farm', state: 'Gujarat', health: 84, risk: 'Moderate risk', lat: 22.56, lng: 72.95, x: '36%', y: '43%' },
  { name: 'Coimbatore Greens', state: 'Tamil Nadu', health: 77, risk: 'Watch', lat: 11.01, lng: 76.96, x: '48%', y: '81%' },
]

export function IndiaFarmMap({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(farms[0])
  return <div className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-[#14221a] ${compact ? 'h-48' : 'h-[520px]'}`}>
    <iframe title="India farm map" className="h-full w-full grayscale-[.25] contrast-125 opacity-75" src="https://www.google.com/maps?q=India&z=5&output=embed" loading="lazy" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,transparent_12%,rgba(8,20,14,.3)_80%)]" />
    {farms.map(farm => <button key={farm.name} aria-label={`Open ${farm.name}`} onClick={() => setSelected(farm)} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: farm.x, top: farm.y }}>
      <span className={`block size-4 rounded-full border-2 border-white shadow-[0_0_0_5px_rgba(213,255,77,.18)] transition group-hover:scale-150 ${farm.health < 60 ? 'bg-[#ef8354]' : farm.health < 80 ? 'bg-[#f7c948]' : 'bg-[#d5ff4d]'}`} />
      <span className="absolute left-5 top-[-8px] hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#102016]/95 px-2 py-1 text-[10px] font-medium text-white shadow-xl group-hover:block">{farm.name}</span>
    </button>)}
    {!compact && <div className="absolute bottom-4 left-4 z-20 max-w-xs rounded-2xl border border-white/10 bg-[#0b1511]/95 p-4 shadow-2xl backdrop-blur"><div className="flex items-center gap-2 text-[#d5ff4d]"><MapPin size={15}/><span className="font-mono text-[10px] tracking-widest">{selected.state.toUpperCase()}</span></div><div className="mt-2 flex items-end justify-between gap-5"><div><div className="font-semibold">{selected.name}</div><div className="mt-1 text-xs text-white/45">{selected.risk} · health {selected.health}%</div></div><a className="grid size-8 place-items-center rounded-lg bg-[#d5ff4d] text-[#102016]" href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`} target="_blank" rel="noreferrer" aria-label="Open in Google Maps"><ExternalLink size={14}/></a></div></div>}
  </div>
}
