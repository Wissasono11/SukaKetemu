import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin, Scan, CheckCircle2 } from 'lucide-react'
import { LocationQrScanner } from './LocationQrScanner'
import { getGedungList, getLantaiList, getRuanganList } from '../../data/locations'

interface LocationPickerBoxProps {
  isFound: boolean
  gedung: string
  onGedungChange: (val: string) => void
  lantai: string
  onLantaiChange: (val: string) => void
  ruangan: string
  onRuanganChange: (val: string) => void
}

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
  const [showQrScanner, setShowQrScanner] = useState(false)

  // Notifikasi singkat setelah QR lokasi berhasil dipindai (hilang otomatis)
  const [scanNotice, setScanNotice] = useState('')
  const noticeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(noticeTimer.current)
  }, [])

  // Daftar pilihan dropdown diambil dari master data lokasi (src/data/locations.ts)
  const gedungOptions = getGedungList()
  const lantaiOptions = getLantaiList(gedung)
  const ruanganOptions = getRuanganList(gedung, lantai)

  // Ganti gedung -> lantai & ruangan ikut menyesuaikan ke pilihan pertama yang tersedia
  const handleGedungChange = (newGedung: string) => {
    const newLantai = getLantaiList(newGedung)[0] ?? ''
    onGedungChange(newGedung)
    onLantaiChange(newLantai)
    onRuanganChange(getRuanganList(newGedung, newLantai)[0] ?? '')
  }

  // Ganti lantai -> ruangan ikut menyesuaikan
  const handleLantaiChange = (newLantai: string) => {
    onLantaiChange(newLantai)
    onRuanganChange(getRuanganList(gedung, newLantai)[0] ?? '')
  }

  const handleLocationScan = useCallback(
    (location: { id: string; gedung: string; lantai: string; ruangan: string }) => {
      onGedungChange(location.gedung)
      onLantaiChange(location.lantai)
      onRuanganChange(location.ruangan)
      setShowQrScanner(false)

      setScanNotice(`${location.ruangan} — ${location.gedung}, ${location.lantai}`)
      window.clearTimeout(noticeTimer.current)
      noticeTimer.current = window.setTimeout(() => setScanNotice(''), 3500)
    },
    [onGedungChange, onLantaiChange, onRuanganChange]
  )

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
            onClick={() => setShowQrScanner(true)}
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

      {scanNotice && (
        <div
          role="status"
          className="flex items-center gap-2 p-2.5 rounded-xl bg-[#E4F1E8] text-[#0F4A2C] text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Lokasi terdeteksi: {scanNotice}</span>
        </div>
      )}

      {showLocationPicker && (
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-1">
          {[
            { label: 'Gedung', val: gedung, set: handleGedungChange, list: gedungOptions },
            { label: 'Lantai', val: lantai, set: handleLantaiChange, list: lantaiOptions },
            { label: 'Ruangan', val: ruangan, set: onRuanganChange, list: ruanganOptions },
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

      {showQrScanner && (
        <LocationQrScanner
          onScanSuccess={handleLocationScan}
          onClose={() => setShowQrScanner(false)}
        />
      )}
    </div>
  )
}
