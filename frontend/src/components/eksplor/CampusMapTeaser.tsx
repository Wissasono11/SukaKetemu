import React from 'react'
import { MapPin, Shield, Compass } from 'lucide-react'

interface CampusMapTeaserProps {
  selectedPosId: string | null
  onSelectPos: (posId: string) => void
}

export const CampusMapTeaser: React.FC<CampusMapTeaserProps> = ({
  selectedPosId,
  onSelectPos,
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0F4A2C] via-[#155E38] to-[#1B7A43] text-white p-4 shadow-sm border border-[#155E38]/30">
      {/* Decorative Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Header Map */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center text-white">
            <Compass className="w-4 h-4 animate-spin [animation-duration:8s]" />
          </div>
          <div>
            <span className="text-xs font-bold leading-tight block">Skematik Kawasan FST</span>
            <span className="text-[10px] text-white/80">3 Checkpoint Pos Satpam Aktif</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#E4F1E8] text-[#0F4A2C] px-2 py-0.5 rounded-full shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#155E38] animate-ping" />
          Live Checkpoint
        </span>
      </div>

      {/* Campus Isometric Vector Zones */}
      <div className="relative z-10 w-full h-36 rounded-xl bg-black/20 backdrop-blur-xs border border-white/15 p-2 flex flex-col justify-between">
        {/* Schematic Building Shapes */}
        <div className="absolute inset-0 p-3 pointer-events-none opacity-40 flex items-center justify-around">
          <div className="w-20 h-24 border border-dashed border-white/40 rounded-lg flex items-center justify-center text-[9px] font-mono text-center">
            Gedung<br />FST
          </div>
          <div className="w-24 h-20 border border-dashed border-white/40 rounded-lg flex items-center justify-center text-[9px] font-mono text-center">
            Lab<br />Terpadu
          </div>
          <div className="w-16 h-20 border border-dashed border-white/40 rounded-lg flex items-center justify-center text-[9px] font-mono text-center">
            Akses<br />Barat
          </div>
        </div>

        {/* Interactive Checkpoint Pins */}
        <div className="relative w-full h-full">
          {/* Pin 1: Pos FST Lobby */}
          <button
            type="button"
            onClick={() => onSelectPos('pos-fst-lobby')}
            className={`absolute top-4 left-6 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 shadow-sm ${
              selectedPosId === 'pos-fst-lobby'
                ? 'bg-white text-[#155E38] ring-2 ring-white scale-105'
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <MapPin className="w-3 h-3 text-[#C59B27]" />
            <span>Lobby FST</span>
          </button>

          {/* Pin 2: Pos Lab Terpadu */}
          <button
            type="button"
            onClick={() => onSelectPos('pos-lab-terpadu')}
            className={`absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 shadow-sm ${
              selectedPosId === 'pos-lab-terpadu'
                ? 'bg-white text-[#155E38] ring-2 ring-white scale-105'
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Shield className="w-3 h-3 text-[#22C55E]" />
            <span>Lab Terpadu</span>
          </button>

          {/* Pin 3: Pos Gerbang Barat */}
          <button
            type="button"
            onClick={() => onSelectPos('pos-gerbang-barat')}
            className={`absolute bottom-3 right-5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all active:scale-95 shadow-sm ${
              selectedPosId === 'pos-gerbang-barat'
                ? 'bg-white text-[#155E38] ring-2 ring-white scale-105'
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <MapPin className="w-3 h-3 text-[#C59B27]" />
            <span>Gerbang Barat</span>
          </button>
        </div>

        {/* Footer Hint */}
        <div className="text-[10px] text-white/80 text-center font-medium">
          Ketuk pin pada peta untuk menyorot detail pos di bawah
        </div>
      </div>
    </div>
  )
}
