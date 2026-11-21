import React from 'react'
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  X,
  ScanSearch,
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
    <div className="rounded-2xl border-2 border-[#155E38]/30 bg-white p-4 shadow-sm flex flex-col gap-3.5 relative overflow-hidden">
      {/* Top Banner Skor Kemiripan */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] border border-[#155E38]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#155E38]" />
          <span className="text-xs font-bold tracking-tight">
            {item.matchScore}% Kecocokan Tertinggi
          </span>
        </div>
        <span className="text-[11px] text-[#44574B] font-medium">
          {item.timeAgo}
        </span>
      </div>

      {/* Komparasi Berdampingan: Laporan Anda vs Temuan di Kampus */}
      <div className="grid grid-cols-11 gap-1.5 items-center">
        {/* Foto Laporan Anda */}
        <div className="col-span-5 flex flex-col gap-1.5">
          <div className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
            <img
              src={item.lostItemImageUrl}
              alt={item.lostItemTitle}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-1 right-1 text-center bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold py-0.5 rounded-md">
              Laporan Anda
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#14261B] line-clamp-1 leading-tight">
            {item.lostItemTitle.split('(')[0]}
          </span>
        </div>

        {/* Lingkaran Skor di Tengah */}
        <div className="col-span-1 flex flex-col items-center justify-center -mx-1">
          <div className="w-7 h-7 rounded-full bg-[#155E38] text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
            VS
          </div>
        </div>

        {/* Foto Temuan Satpam */}
        <div className="col-span-5 flex flex-col gap-1.5">
          <div className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 ring-2 ring-[#155E38]/30">
            <img
              src={item.foundItemImageUrl}
              alt={item.foundItemTitle}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-1 right-1 text-center bg-[#155E38] text-white text-[9px] font-bold py-0.5 rounded-md">
              Temuan Kampus
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#14261B] line-clamp-1 leading-tight">
            {item.foundItemTitle}
          </span>
        </div>
      </div>

      {/* Bukti Analisis Kecocokan AI */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2 text-left">
        <span className="text-[11px] font-bold text-[#14261B] flex items-center gap-1.5">
          <ScanSearch className="w-3.5 h-3.5 text-[#155E38]" />
          Faktor Bukti Analisis AI:
        </span>
        <div className="flex flex-col gap-1.5">
          {item.evidenceList.map((ev, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-[#44574B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-semibold text-[#14261B] text-[11px]">
                  {ev.factor}
                </span>
                <span className="text-[10px] leading-snug">
                  {ev.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lokasi Pos Satpam Saat Ini */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E4F1E8]/60 border border-[#155E38]/20 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#155E38] flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#44574B]">Tersimpan di:</span>
            <span className="font-bold text-[#0F4A2C] text-xs">
              {item.custodyPos}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-[#155E38] font-bold bg-white px-2 py-0.5 rounded-full border border-[#155E38]/20">
          {item.foundLocation}
        </span>
      </div>

      {/* Tombol Keputusan */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={() => onClaim(item)}
          className="w-full py-3.5 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span>Ya, Ini Barang Saya (Klaim Sekarang)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onReject(item.id)}
          className="py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Bukan Barang Saya (Abaikan Temuan Ini)</span>
        </button>
      </div>
    </div>
  )
}
