import React from 'react'
import { MapPin, Shield, ChevronRight } from 'lucide-react'
import type { UserReportItem } from '../../types/lostFound'

interface MyReportCardProps {
  item: UserReportItem
  onOpenAiMatch?: () => void
  onNavigateToPos?: (posName: string) => void
}

export const MyReportCard: React.FC<MyReportCardProps> = ({
  item,
  onOpenAiMatch,
  onNavigateToPos,
}) => {
  const isLost = item.type === 'lost'

  return (
    <article className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-2.5 text-left">
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                isLost ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {isLost ? 'Barang Hilang' : 'Barang Temuan'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {item.reportedDate}
            </span>
          </div>

          <h4 className="text-xs font-bold text-[#14261B] truncate mt-1">
            {item.title}
          </h4>

          <div className="text-[11px] text-[#44574B] flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3 text-[#155E38] flex-shrink-0" />
            <span className="truncate">{item.locationDetail}</span>
          </div>
        </div>
      </div>

      {/* Baris Status & Tindak Lanjut */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        {item.status === 'cocok_ai' && (
          <>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              {item.statusLabel}
            </span>
            <button
              type="button"
              onClick={onOpenAiMatch}
              className="text-xs font-bold text-[#155E38] hover:text-[#0F4A2C] flex items-center gap-0.5 transition-colors"
            >
              Lihat Kecocokan
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {item.status === 'dititipkan' && (
          <div className="flex items-center justify-between w-full">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F4A2C] bg-[#E4F1E8] px-2 py-0.5 rounded-md">
              <Shield className="w-3 h-3 text-[#155E38]" />
              {item.statusLabel}
            </span>
            {item.posName && onNavigateToPos && (
              <button
                type="button"
                onClick={() => onNavigateToPos(item.posName!)}
                className="text-[11px] font-semibold text-slate-600 hover:text-[#155E38] transition-colors"
              >
                Lihat di Peta &rarr;
              </button>
            )}
          </div>
        )}

        {item.status === 'mencari' && (
          <span className="text-[11px] text-slate-500 font-medium">
            Status: {item.statusLabel}
          </span>
        )}

        {item.status === 'selesai' && (
          <span className="text-[11px] text-slate-500 font-medium">
            Status: Selesai diserahterimakan
          </span>
        )}
      </div>
    </article>
  )
}
