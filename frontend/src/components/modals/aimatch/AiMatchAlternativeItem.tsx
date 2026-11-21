import React from 'react'
import { ChevronRight, ScanSearch } from 'lucide-react'
import type { AiMatchItem } from '../../../types/lostFound'

interface AiMatchAlternativeItemProps {
  item: AiMatchItem
  onSelect: (item: AiMatchItem) => void
}

export const AiMatchAlternativeItem: React.FC<AiMatchAlternativeItemProps> = ({
  item,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-center justify-between gap-3 group active:scale-[0.99]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={item.foundItemImageUrl}
          alt={item.foundItemTitle}
          className="w-11 h-11 rounded-lg object-cover border border-slate-200 flex-shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#14261B] truncate group-hover:text-[#155E38] transition-colors">
            {item.foundItemTitle}
          </span>
          <span className="text-[10px] text-[#44574B] truncate">
            {item.foundLocation} • {item.custodyPos.split('(')[0]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#44574B] group-hover:bg-[#E4F1E8] group-hover:text-[#0F4A2C] transition-colors">
          <ScanSearch className="w-3 h-3" />
          {item.matchScore}%
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#155E38] transition-colors" />
      </div>
    </button>
  )
}
