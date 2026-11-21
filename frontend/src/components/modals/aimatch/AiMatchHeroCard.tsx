import React from 'react'
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  MapPin,
  Sparkles,
} from 'lucide-react'
import type { AiMatchItem } from '../../../types/lostFound'

interface AiMatchHeroCardProps {
  item: AiMatchItem
  onClaim: (item: AiMatchItem) => void
  onReject: (id: string) => void
}

export const AiMatchHeroCard: React.FC<AiMatchHeroCardProps> = ({
  item,
  onClaim,
  onReject,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3.5 text-left">
      {/* Header Skor Kecocokan */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] text-xs font-bold border border-[#155E38]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#155E38]" />
          {item.matchScore}% Kecocokan Tertinggi
        </span>
        <span className="text-[11px] text-[#44574B]">
          {item.timeAgo}
        </span>
      </div>

      {/* Komparasi Bersih: Foto Laporan vs Foto Temuan */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1">
          <div className="relative aspect-4/3 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
            <img
              src={item.lostItemImageUrl}
              alt="Laporan Anda"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              Laporan Anda
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#44574B] truncate">
            {item.lostItemTitle.split('(')[0]}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative aspect-4/3 rounded-xl bg-slate-100 overflow-hidden border-2 border-[#155E38]/40 shadow-2xs">
            <img
              src={item.foundItemImageUrl}
              alt="Temuan di Kampus"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 bg-[#155E38] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              Temuan Satpam
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#14261B] truncate">
            {item.foundItemTitle}
          </span>
        </div>
      </div>

      {/* Detail Lokasi & Pos Satpam */}
      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
        <div className="flex items-center gap-1.5 text-[#14261B]">
          <Shield className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" />
          <span>Tersimpan di: <strong>{item.custodyPos}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-[#44574B] text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>Titik temuan: {item.foundLocation}</span>
        </div>
      </div>

      {/* Alasan Kecocokan AI (Ringkas & Mudah Dibaca) */}
      <div className="flex flex-col gap-1.5 text-xs text-[#44574B]">
        <span className="text-[11px] font-bold text-[#14261B]">
          Alasan Kecocokan AI:
        </span>
        {item.evidenceList.map((ev, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" />
            <span className="text-[11px] leading-tight text-[#14261B]">
              {ev.description}
            </span>
          </div>
        ))}
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onClaim(item)}
          className="w-full py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <span>Klaim Barang Ini</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onReject(item.id)}
          className="py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          Bukan Punya Saya
        </button>
      </div>
    </div>
  )
}
