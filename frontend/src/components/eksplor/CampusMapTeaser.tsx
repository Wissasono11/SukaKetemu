import React from 'react'
import { MapPin, Shield, ChevronDown, Check } from 'lucide-react'

interface CampusMapTeaserProps {
  selectedPosId: string | null
  onSelectPos: (posId: string) => void
}

interface CheckpointLocation {
  id: string
  name: string
  shortLabel: string
  building: string
  itemsCount: number
  is24h: boolean
  coords: { x: number; y: number } // Percentage within SVG viewport
}

const CHECKPOINTS: CheckpointLocation[] = [
  {
    id: 'pos-gerbang-barat',
    name: 'Pos Gerbang Barat',
    shortLabel: 'Gerbang Barat',
    building: 'Akses Masuk Kampus',
    itemsCount: 2,
    is24h: true,
    coords: { x: 22, y: 72 },
  },
  {
    id: 'pos-fst-lobby',
    name: 'Pos Utama Lobby FST',
    shortLabel: 'Lobby Utama',
    building: 'Gedung Amin Abdullah',
    itemsCount: 6,
    is24h: false,
    coords: { x: 50, y: 44 },
  },
  {
    id: 'pos-lab-terpadu',
    name: 'Pos Gedung Lab Terpadu',
    shortLabel: 'Lab Terpadu',
    building: 'Sains & Komputer',
    itemsCount: 4,
    is24h: false,
    coords: { x: 80, y: 48 },
  },
]

export const CampusMapTeaser: React.FC<CampusMapTeaserProps> = ({
  selectedPosId,
  onSelectPos,
}) => {
  const selectedPos = CHECKPOINTS.find((c) => c.id === selectedPosId)

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-xs p-4 flex flex-col gap-3 text-left">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E4F1E8] text-[#155E38] flex items-center justify-center flex-shrink-0 font-bold">
            <MapPin className="w-4 h-4 text-[#155E38]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#14261B]">
              Peta Lokasi Pos Satpam FST
            </h3>
            <p className="text-[11px] text-[#44574B]">
              Kawasan Kampus Timur UIN Sunan Kalijaga
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-[#155E38] bg-[#E4F1E8] px-2.5 py-0.5 rounded-full">
          3 Pos Terhubung
        </span>
      </div>

      {/* Interactive Vector Map Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#F4F7F4] border border-slate-200 select-none">
        {/* SVG Base Campus Ground & Architectural Blocks */}
        <svg
          viewBox="0 0 500 300"
          className="w-full h-full object-cover pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Road & Walkways */}
          <path
            d="M 0 230 Q 150 215, 260 215 T 500 205"
            stroke="#CBD5E1"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 0 230 Q 150 215, 260 215 T 500 205"
            stroke="#E2E8F0"
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
          />
          {/* Pathway to FST Lobby */}
          <path
            d="M 120 220 L 245 130 L 255 130"
            stroke="#E2E8F0"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          {/* Pathway to Lab Terpadu */}
          <path
            d="M 260 215 L 390 140"
            stroke="#E2E8F0"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />

          {/* Building 1: Akses Gerbang Barat (Left) */}
          <g transform="translate(45, 175)">
            <rect
              width="85"
              height="60"
              rx="8"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <rect
              x="5"
              y="5"
              width="75"
              height="20"
              rx="4"
              fill="#E4F1E8"
              opacity="0.8"
            />
            <text
              x="42"
              y="40"
              fontSize="9"
              fontWeight="bold"
              fill="#14261B"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Gerbang Barat
            </text>
            <text
              x="42"
              y="52"
              fontSize="7.5"
              fill="#64748B"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Akses Masuk
            </text>
          </g>

          {/* Building 2: Gedung Utama FST (Center) */}
          <g transform="translate(170, 50)">
            <rect
              width="155"
              height="95"
              rx="10"
              fill="#FFFFFF"
              stroke="#155E38"
              strokeWidth="2"
            />
            <rect
              x="6"
              y="6"
              width="143"
              height="26"
              rx="6"
              fill="#E4F1E8"
            />
            <text
              x="77"
              y="22"
              fontSize="10"
              fontWeight="bold"
              fill="#0F4A2C"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Gedung Utama FST
            </text>
            <text
              x="77"
              y="58"
              fontSize="9"
              fontWeight="600"
              fill="#14261B"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Prof. Dr. KH Amin Abdullah
            </text>
            <text
              x="77"
              y="74"
              fontSize="8"
              fill="#475569"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Lantai 1–4 &bull; Dekanat &amp; Kuliah
            </text>
          </g>

          {/* Building 3: Gedung Laboratorium Terpadu (Right) */}
          <g transform="translate(350, 60)">
            <rect
              width="120"
              height="90"
              rx="10"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <rect
              x="6"
              y="6"
              width="108"
              height="24"
              rx="6"
              fill="#E2E8F0"
            />
            <text
              x="60"
              y="21"
              fontSize="9.5"
              fontWeight="bold"
              fill="#334155"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Lab Terpadu
            </text>
            <text
              x="60"
              y="56"
              fontSize="8.5"
              fontWeight="600"
              fill="#14261B"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Laboratorium Sains
            </text>
            <text
              x="60"
              y="72"
              fontSize="7.5"
              fill="#64748B"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              Lt. 1 Meja Satpam Timur
            </text>
          </g>

          {/* Central Courtyard / Taman Kampus */}
          <rect
            x="180"
            y="170"
            width="120"
            height="35"
            rx="12"
            fill="#E8F2EA"
            stroke="#D1E4D4"
            strokeWidth="1.5"
          />
          <text
            x="240"
            y="192"
            fontSize="8"
            fontWeight="bold"
            fill="#155E38"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            Taman Sains FST
          </text>
        </svg>

        {/* Interactive Checkpoint Pins Layer */}
        {CHECKPOINTS.map((cp) => {
          const isSelected = selectedPosId === cp.id
          return (
            <button
              key={cp.id}
              type="button"
              onClick={() => onSelectPos(cp.id)}
              style={{
                left: `${cp.coords.x}%`,
                top: `${cp.coords.y}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-150 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'
              }`}
              title={`Pilih ${cp.name}`}
            >
              {/* Pin Callout Badge */}
              <div
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-[#155E38] text-white ring-2 ring-[#C59B27]'
                    : 'bg-white text-[#14261B] border border-slate-200 group-hover:border-[#155E38]'
                }`}
              >
                <span>{cp.shortLabel}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                    isSelected ? 'bg-white text-[#155E38]' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {cp.itemsCount}
                </span>
              </div>

              {/* Pin Pointer Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isSelected
                    ? 'bg-[#155E38] text-white ring-4 ring-[#155E38]/20'
                    : 'bg-white text-[#155E38] border-2 border-[#155E38] group-hover:bg-[#E4F1E8]'
                }`}
              >
                <Shield className="w-3.5 h-3.5 fill-current" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Pos Mini Callout / Status Card */}
      {selectedPos ? (
        <div className="p-3 rounded-xl bg-[#E4F1E8]/60 border border-[#155E38]/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#155E38] text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#14261B]">
                {selectedPos.name} ({selectedPos.building})
              </span>
              <span className="text-[10px] text-[#44574B]">
                {selectedPos.itemsCount} barang diamankan &bull; {selectedPos.is24h ? 'Buka 24 Jam' : 'Jam Kerja'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById(`pos-card-${selectedPos.id}`)
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
            className="px-2.5 py-1 rounded-lg bg-[#155E38] text-white text-[11px] font-bold hover:bg-[#0F4A2C] transition-colors flex items-center gap-1"
          >
            <span>Lihat Pos</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl flex items-center justify-between border border-slate-100">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#155E38]" />
            Ketuk salah satu pin pos pengamanan pada peta untuk melihat detail
          </span>
        </div>
      )}
    </div>
  )
}
export default CampusMapTeaser
