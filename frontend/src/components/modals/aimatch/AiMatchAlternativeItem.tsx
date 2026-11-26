import React from 'react'
import { EyeOff } from 'lucide-react'
import type { AiMatchItem } from '../../../types/lostFound'

interface AiMatchAlternativeItemProps {
  item: AiMatchItem
  onSelect: (item: AiMatchItem) => void
}

export const AiMatchAlternativeItem: React.FC<AiMatchAlternativeItemProps> = ({
  item,
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
      className="w-full min-h-[56px] px-3.5 py-3 bg-white hover:bg-slate-50 transition-colors text-left flex items-center justify-between gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155E38]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-semibold text-[#44574B] tabular-nums w-6 flex-shrink-0">
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
          <span className="text-xs font-bold text-[#14261B] truncate group-hover:text-[#155E38] transition-colors">
            {item.foundItemTitle}
          </span>
          <span className="text-[11px] text-[#44574B] truncate">
            {item.foundLocation}, {custodyLabel}
          </span>
        </div>
      </div>

      <span className="text-xs font-bold text-[#155E38] tabular-nums flex-shrink-0">
        {item.matchScore}%
      </span>
    </button>
  )
}
