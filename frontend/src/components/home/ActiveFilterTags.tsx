import React from 'react'
import { X } from 'lucide-react'

interface ActiveFilterTagsProps {
  searchQuery: string
  posLabel: string | null
  custodyLabel: string | null
  dateLabel: string | null
  onClearQuery: () => void
  onClearPos: () => void
  onClearCustody: () => void
  onClearDate: () => void
}

export const ActiveFilterTags: React.FC<ActiveFilterTagsProps> = ({
  searchQuery,
  posLabel,
  custodyLabel,
  dateLabel,
  onClearQuery,
  onClearPos,
  onClearCustody,
  onClearDate,
}) => {
  const hasTags = searchQuery.trim() !== '' || posLabel || custodyLabel || dateLabel
  if (!hasTags) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-0.5 animate-in fade-in duration-150">
      {searchQuery.trim() && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[#14261B] text-[11px] font-medium border border-slate-200">
          "{searchQuery}"
          <button
            type="button"
            onClick={onClearQuery}
            className="text-slate-400 hover:text-slate-700 ml-0.5"
            aria-label="Hapus filter kata kunci"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {posLabel && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] text-[11px] font-semibold border border-[#155E38]/20">
          Pos: {posLabel}
          <button
            type="button"
            onClick={onClearPos}
            className="hover:text-red-700 ml-0.5"
            aria-label="Hapus filter pos"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {custodyLabel && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] text-[11px] font-semibold border border-[#155E38]/20">
          {custodyLabel}
          <button
            type="button"
            onClick={onClearCustody}
            className="hover:text-red-700 ml-0.5"
            aria-label="Hapus filter status fisik"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {dateLabel && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] text-[11px] font-semibold border border-[#155E38]/20">
          Waktu: {dateLabel}
          <button
            type="button"
            onClick={onClearDate}
            className="hover:text-red-700 ml-0.5"
            aria-label="Hapus filter waktu"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
    </div>
  )
}
