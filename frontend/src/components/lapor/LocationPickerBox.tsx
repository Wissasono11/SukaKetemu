import React, { useState } from 'react'
import { MapPin, Scan } from 'lucide-react'

interface LocationPickerBoxProps {
  isFound: boolean
  gedung: string
  onGedungChange: (val: string) => void
  lantai: string
  onLantaiChange: (val: string) => void
  ruangan: string
  onRuanganChange: (val: string) => void
}

const BUILDINGS = ['FST (Saintek)', 'FISHUM', 'FEBI', 'FITK', 'Perpustakaan']
const FLOORS = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4']
const ROOMS = ['Lab Terpadu 204', 'R. Kuliah 201', 'Selasar Barat', 'Pos Satpam FST']

export const LocationPickerBox: React.FC<LocationPickerBoxProps> = ({
  isFound,
  gedung,
  onGedungChange,
  lantai,
  onLantaiChange,
  ruangan,
  onRuanganChange,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const handleQuickQr = () => {
    onGedungChange('FST (Saintek)')
    onLantaiChange('Lantai 2')
    onRuanganChange('Lab Terpadu 204')
  }

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#155E38]" />
          {isFound ? 'Lokasi Ditemukan' : 'Area Rute Terakhir'}
        </span>
        {isFound && (
          <button
            type="button"
            onClick={handleQuickQr}
            className="text-[11px] font-bold text-[#155E38] flex items-center gap-1 hover:underline"
          >
            <Scan className="w-3.5 h-3.5" />
            Scan QR Checkpoint
          </button>
        )}
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#1B7A43] uppercase tracking-wider">
            Titik Kampus
          </span>
          <span className="text-xs font-bold text-[#14261B] mt-0.5">
            Gedung {gedung} — {lantai}, {ruangan}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowLocationPicker(!showLocationPicker)}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#155E38] hover:bg-slate-50"
        >
          {showLocationPicker ? 'Tutup' : 'Ubah'}
        </button>
      </div>

      {showLocationPicker && (
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-1">
          {[
            { label: 'Gedung', val: gedung, set: onGedungChange, list: BUILDINGS },
            { label: 'Lantai', val: lantai, set: onLantaiChange, list: FLOORS },
            { label: 'Ruangan', val: ruangan, set: onRuanganChange, list: ROOMS },
          ].map(({ label, val, set, list }) => (
            <div key={label} className="flex flex-col">
              <label className="text-[10px] font-bold text-[#44574B] mb-1">{label}</label>
              <select
                value={val}
                onChange={(e) => set(e.target.value)}
                className="bg-white text-xs font-semibold rounded-lg p-1.5 border border-slate-200"
              >
                {list.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
