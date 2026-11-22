import React from 'react'
import {
  Shield,
  MapPin,
  Clock,
  UserCheck,
  Phone,
  QrCode,
  ArrowRight,
  PackageCheck,
} from 'lucide-react'
import type { PosSatpamInfo, LostFoundItem } from '../../types/lostFound'

interface PosSatpamCardProps {
  pos: PosSatpamInfo
  storedItems: LostFoundItem[]
  isSelected: boolean
  onFilterByPos: (posId: string) => void
  onScanQr: () => void
}

export const PosSatpamCard: React.FC<PosSatpamCardProps> = ({
  pos,
  storedItems,
  isSelected,
  onFilterByPos,
  onScanQr,
}) => {
  const is24Hours = pos.operatingHours.includes('24')

  return (
    <article
      id={`pos-card-${pos.id}`}
      className={`rounded-2xl border transition-all duration-200 bg-white shadow-sm flex flex-col overflow-hidden text-left ${
        isSelected
          ? 'border-[#155E38] ring-2 ring-[#155E38]/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header Region */}
      <header className="p-4 pb-3 flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E4F1E8] text-[#155E38] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
            <Shield className="w-5 h-5 text-[#155E38]" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs font-bold text-[#14261B] leading-tight">
              {pos.name}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              KODE: {pos.code}
            </span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            is24Hours
              ? 'bg-[#E4F1E8] text-[#0F4A2C] border border-[#155E38]/20'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#155E38] animate-pulse" />
          {is24Hours ? 'Buka 24 Jam' : 'Buka'}
        </span>
      </header>

      {/* Content Region */}
      <div className="p-4 flex flex-col gap-3">
        {/* Info Lokasi & Petugas */}
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-start gap-2 text-[#44574B]">
            <MapPin className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium leading-relaxed">
              {pos.location}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#44574B]">
            <UserCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="text-[11px]">
              Petugas: <strong>{pos.officer}</strong> &bull; {pos.shift.split('(')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#44574B]">
            <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="text-[11px]">
              Jam Layanan: <strong>{pos.operatingHours}</strong>
            </span>
          </div>
        </div>

        {/* Live Stored Items Preview */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#14261B] flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-[#155E38]" />
              {storedItems.length} Barang Diamankan di Pos Ini
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Update Realtime
            </span>
          </div>

          {storedItems.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {storedItems.slice(0, 3).map((item) => (
                  <img
                    key={item.id}
                    src={item.imageUrl}
                    alt={item.title}
                    title={item.title}
                    className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover border border-slate-200"
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#44574B] truncate">
                {storedItems.slice(0, 2).map((i) => i.title.split(' ')[0]).join(', ')}
                {storedItems.length > 2 ? `, +${storedItems.length - 2} lainnya` : ''}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">
              Tidak ada barang yang sedang dititipkan di pos ini.
            </span>
          )}
        </div>
      </div>

      {/* Footer Region: Action Buttons */}
      <footer className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFilterByPos(pos.id)}
          className="py-2.5 px-3 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all min-h-[40px]"
        >
          <span>Lihat Barang</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onScanQr}
            className="flex-1 py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-[#14261B] text-xs font-semibold flex items-center justify-center gap-1 transition-all min-h-[40px]"
            title="Scan QR Checkpoint Pos"
          >
            <QrCode className="w-3.5 h-3.5 text-[#155E38]" />
            <span>Scan QR</span>
          </button>

          <a
            href="tel:+62274512474"
            className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-[#155E38] active:scale-[0.98] transition-all flex-shrink-0 min-h-[40px]"
            title="Hubungi Petugas Satpam"
          >
            <Phone className="w-4 h-4 text-slate-600" />
          </a>
        </div>
      </footer>
    </article>
  )
}
