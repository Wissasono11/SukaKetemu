import React from 'react'
import { MapPin, Building, Shield } from 'lucide-react'

interface CampusMapTeaserProps {
  selectedPosId: string | null
  onSelectPos: (posId: string) => void
}

interface CheckpointZone {
  id: string
  name: string
  zone: string
  floor: string
  itemsCount: number
  is24h: boolean
}

const CHECKPOINTS: CheckpointZone[] = [
  {
    id: 'pos-fst-lobby',
    name: 'Lobby FST',
    zone: 'Gedung Utama',
    floor: 'Lantai 1',
    itemsCount: 6,
    is24h: false,
  },
  {
    id: 'pos-lab-terpadu',
    name: 'Lab Terpadu',
    zone: 'Selasar Timur',
    floor: 'Lantai 1',
    itemsCount: 4,
    is24h: false,
  },
  {
    id: 'pos-gerbang-barat',
    name: 'Gerbang Barat',
    zone: 'Akses Utama',
    floor: 'Area Terbuka',
    itemsCount: 2,
    is24h: true,
  },
]

export const CampusMapTeaser: React.FC<CampusMapTeaserProps> = ({
  selectedPosId,
  onSelectPos,
}) => {
  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-xs p-4 flex flex-col gap-3">
      {/* Title & Context */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E4F1E8] text-[#155E38] flex items-center justify-center flex-shrink-0">
            <Building className="w-4 h-4 text-[#155E38]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#14261B]">
              Denah Checkpoint Pos Satpam
            </h3>
            <p className="text-[11px] text-[#44574B]">
              Fakultas Sains &amp; Teknologi UIN Sunan Kalijaga
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#155E38] bg-[#E4F1E8] px-2.5 py-0.5 rounded-full">
          3 Pos Terhubung
        </span>
      </div>

      {/* Schematic Spatial Checkpoint Selector */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {CHECKPOINTS.map((cp) => {
          const isSelected = selectedPosId === cp.id
          return (
            <button
              key={cp.id}
              type="button"
              onClick={() => onSelectPos(cp.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? 'border-[#155E38] bg-[#E4F1E8]/40 ring-1 ring-[#155E38]'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                  {cp.zone}
                </span>
                {cp.is24h ? (
                  <span className="text-[9px] font-bold text-[#0F4A2C] bg-[#E4F1E8] px-1.5 py-0.5 rounded">
                    24 Jam
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500 font-medium">
                    {cp.floor}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-col">
                <span className="text-xs font-bold text-[#14261B] leading-tight flex items-center gap-1">
                  <MapPin className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-[#155E38]' : 'text-slate-400'}`} />
                  {cp.name}
                </span>
                <span className="text-[10px] text-[#44574B] mt-0.5">
                  {cp.itemsCount} barang diamankan
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Wayfinding Notice */}
      <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl flex items-center justify-between border border-slate-100">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#155E38]" />
          Pilih pos di atas untuk menyorot detail dan daftar barang
        </span>
      </div>
    </div>
  )
}
export default CampusMapTeaser
