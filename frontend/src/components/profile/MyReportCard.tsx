import React from 'react'
import { MapPin, Shield } from 'lucide-react'
import type { UserReportItem } from '../../types/lostFound'

interface MyReportCardProps {
  item: UserReportItem
  onOpenAiMatch?: () => void
  onNavigateToPos?: (posName: string) => void
}

function formatReportedDate(rawDate: string): string {
  const parsed = Date.parse(rawDate)
  if (Number.isNaN(parsed) || !rawDate.includes('T')) {
    return rawDate
  }
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(parsed))
}

export const MyReportCard: React.FC<MyReportCardProps> = ({
  item,
  onOpenAiMatch,
  onNavigateToPos,
}) => {
  const isLost = item.type === 'lost'

  return (
    <article className="px-3.5 py-3.5 bg-white flex flex-col gap-2.5 text-left">
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[11px] font-bold text-[#44574B]">TEKS</span>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={`text-[11px] font-bold ${
                isLost ? 'text-[#92400E]' : 'text-[#0F4A2C]'
              }`}
            >
              {isLost ? 'Hilang' : 'Temuan'}
            </span>
            <span className="text-[11px] text-[#44574B] tabular-nums whitespace-nowrap">
              {formatReportedDate(item.reportedDate)}
            </span>
          </div>

          <h4 className="text-xs font-bold text-[#14261B] truncate mt-0.5">
            {item.title}
          </h4>

          <div className="text-[11px] text-[#44574B] flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3 text-[#155E38] flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{item.locationDetail}</span>
          </div>
        </div>
      </div>

      {/* Baris Status & Aksi Kontekstual */}
      <div className="flex items-center justify-between gap-2 text-xs pl-15">
        {item.status === 'cocok_ai' && (
          <>
            <span className="text-[11px] font-semibold text-[#92400E]">
              {item.statusLabel}
            </span>
            {onOpenAiMatch && (
              <button
                type="button"
                onClick={onOpenAiMatch}
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#E4F1E8] hover:bg-[#D4E8DC] text-xs font-bold text-[#0F4A2C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
              >
                Tinjau Kecocokan
              </button>
            )}
          </>
        )}

        {item.status === 'dititipkan' && (
          <>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F4A2C]">
              <Shield className="w-3.5 h-3.5 text-[#155E38]" aria-hidden="true" />
              {item.statusLabel}
            </span>
            {item.posName && onNavigateToPos && (
              <button
                type="button"
                onClick={() => onNavigateToPos(item.posName!)}
                className="min-h-[36px] px-2 py-1 rounded-lg text-xs font-semibold text-[#155E38] hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
              >
                Lokasi Pos
              </button>
            )}
          </>
        )}

        {item.status === 'mencari' && (
          <span className="text-[11px] text-[#44574B] font-medium">
            {item.statusLabel}
          </span>
        )}

        {item.status === 'selesai' && (
          <span className="text-[11px] text-[#44574B] font-medium">
            Selesai diserahterimakan
          </span>
        )}
      </div>
    </article>
  )
}
