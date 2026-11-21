import React from 'react'
import type { ClaimTicket } from '../../../types/lostFound'

interface ClaimHistoryCardProps {
  ticket: ClaimTicket
}

export const ClaimHistoryCard: React.FC<ClaimHistoryCardProps> = ({ ticket }) => {
  return (
    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-slate-500">
          #{ticket.ticketNumber}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            ticket.status === 'completed'
              ? 'bg-[#E4F1E8] text-[#0F4A2C]'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {ticket.statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={ticket.itemImageUrl}
          alt={ticket.itemTitle}
          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#14261B] line-clamp-1">
            {ticket.itemTitle}
          </span>
          <span className="text-[11px] text-[#44574B]">
            {ticket.posLocation}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {ticket.createdAt}
          </span>
        </div>
      </div>
    </div>
  )
}
