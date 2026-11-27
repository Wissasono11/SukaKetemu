import React from 'react'
import { EyeOff, ChevronRight } from 'lucide-react'
import type { AiMatchItem } from '../../types/lostFound'

interface AiMatchAlternativeItemProps {
  item: AiMatchItem
  isActive?: boolean
  onSelect: (item: AiMatchItem) => void
}

function getScoreBadgeClass(score: number): string {
  if (score >= 85) return 'bg-[#E4F1E8] text-[#0F4A2C]'
  if (score >= 65) return 'bg-[#FEF3C7] text-[#92400E]'
  return 'bg-slate-100 text-[#44574B]'
}

export const AiMatchAlternativeItem: React.FC<AiMatchAlternativeItemProps> = ({
  item,
  isActive = false,
  onSelect,
}) => {
  const custodyLabel =
    item.custody === 'pos_satpam'
      ? (item.custodyPos || 'Pos Satpam').split('(')[0].trim()
      : 'Dibawa Penemu'

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-current={isActive ? 'true' : undefined}
      className={`w-full min-h-[58px] px-3.5 py-2.5 transition-colors text-left flex items-center justify-between gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155E38] ${
        isActive
          ? 'bg-[#E4F1E8]/55 border-l-[3px] border-l-[#155E38]'
          : 'bg-white hover:bg-slate-50 border-l-[3px] border-l-transparent'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`text-xs font-bold tabular-nums w-6 flex-shrink-0 ${
            isActive ? 'text-[#155E38]' : 'text-[#44574B]'
          }`}
        >
          #{item.rank}
        </span>

        <div className="relative w-11 h-11 rounded-md overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
          <img
            src={item.foundItemImageUrl}
            alt={item.foundItemTitle}
            width={44}
            height={44}
            className={`w-full h-full object-cover ${
              item.isPrivacySensitive ? 'blur-sm scale-110' : ''
            }`}
          />
          {item.isPrivacySensitive && (
            <span
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
              aria-hidden="true"
            >
              <EyeOff className="w-3.5 h-3.5 text-white" />
            </span>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className={`text-xs font-bold truncate transition-colors ${
              isActive
                ? 'text-[#0F4A2C]'
                : 'text-[#14261B] group-hover:text-[#155E38]'
            }`}
          >
            {item.foundItemTitle}
          </span>
          <span className="text-[11px] text-[#44574B] truncate">
            {item.foundLocation} • {custodyLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${getScoreBadgeClass(
            item.matchScore
          )}`}
        >
          {item.matchScore}%
        </span>
        {isActive ? (
          <span className="text-[10px] font-bold text-[#155E38] uppercase tracking-wide">
            Aktif
          </span>
        ) : (
          <ChevronRight
            className="w-4 h-4 text-slate-400 group-hover:text-[#155E38] transition-colors"
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  )
}
