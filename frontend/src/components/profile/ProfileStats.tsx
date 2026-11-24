import React from 'react'
import { FileText, Ticket, CheckCircle2 } from 'lucide-react'

interface ProfileStatsProps {
  reportCount: number
  activeTicketCount: number
  completedCount: number
  onSelectTab: (tab: 'laporan' | 'klaim') => void
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  reportCount,
  activeTicketCount,
  completedCount,
  onSelectTab,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onSelectTab('laporan')}
        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-start gap-1 hover:border-[#155E38]/40 transition-colors text-left"
      >
        <div className="flex items-center justify-between w-full">
          <FileText className="w-4 h-4 text-[#155E38]" />
          <span className="text-base font-extrabold text-[#14261B]">{reportCount}</span>
        </div>
        <span className="text-[11px] font-bold text-[#14261B]">Laporan</span>
        <span className="text-[10px] text-slate-500">Barang Saya</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('klaim')}
        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-start gap-1 hover:border-[#155E38]/40 transition-colors text-left relative overflow-hidden"
      >
        <div className="flex items-center justify-between w-full">
          <Ticket className="w-4 h-4 text-[#C59B27]" />
          <div className="flex items-center gap-1">
            <span className="text-base font-extrabold text-[#14261B]">{activeTicketCount}</span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#14261B]">Tiket Aktif</span>
        <span className="text-[10px] text-slate-500">Perlu Diambil</span>
      </button>

      <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-start gap-1 text-left">
        <div className="flex items-center justify-between w-full">
          <CheckCircle2 className="w-4 h-4 text-[#155E38]" />
          <span className="text-base font-extrabold text-[#14261B]">{completedCount}</span>
        </div>
        <span className="text-[11px] font-bold text-[#14261B]">Kembali</span>
        <span className="text-[10px] text-slate-500">Selesai Temu</span>
      </div>
    </div>
  )
}
export default ProfileStats
