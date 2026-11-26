import React from 'react'

interface ProfileStatsProps {
  reportCount: number
  activeTicketCount: number
  completedCount: number
  activeTab: 'laporan' | 'klaim'
  onSelectTab: (tab: 'laporan' | 'klaim') => void
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  reportCount,
  activeTicketCount,
  completedCount,
  activeTab,
  onSelectTab,
}) => {
  return (
    <section
      aria-label="Ringkasan Aktivitas"
      className="rounded-xl bg-white border border-slate-200 grid grid-cols-3 divide-x divide-slate-200 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => onSelectTab('laporan')}
        className={`px-3 py-3 flex flex-col items-start gap-0.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155E38] ${
          activeTab === 'laporan' ? 'bg-[#E4F1E8]/45' : 'hover:bg-slate-50'
        }`}
      >
        <span className="text-base font-extrabold text-[#14261B] tabular-nums">
          {reportCount}
        </span>
        <span className="text-xs font-bold text-[#155E38]">Laporan Aktif</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('klaim')}
        className={`px-3 py-3 flex flex-col items-start gap-0.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155E38] ${
          activeTab === 'klaim' ? 'bg-[#E4F1E8]/45' : 'hover:bg-slate-50'
        }`}
      >
        <span className="text-base font-extrabold text-[#14261B] tabular-nums">
          {activeTicketCount}
        </span>
        <span className="text-xs font-bold text-[#92400E]">Tiket Ambil</span>
      </button>

      <div className="px-3 py-3 flex flex-col items-start gap-0.5 text-left bg-slate-50/50">
        <span className="text-base font-extrabold text-[#14261B] tabular-nums">
          {completedCount}
        </span>
        <span className="text-xs font-semibold text-[#44574B]">Selesai</span>
      </div>
    </section>
  )
}

export default ProfileStats
