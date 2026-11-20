import React from 'react'
import { Bell } from 'lucide-react'

interface HomeHeaderProps {
  onNotificationClick: () => void
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 transition-all text-left">
      <div className="flex items-center justify-between">
        {/* Profil Simple: Inisial BW + Nama */}
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-[#E4F1E8] border border-[#155E38]/15 text-[#0F4A2C] font-bold text-xs tracking-wider flex items-center justify-center flex-shrink-0 shadow-2xs">
            BW
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-medium text-slate-500 leading-tight">
              Assalamu'alaikum,
            </span>
            <span className="text-sm font-bold text-[#14261B] tracking-tight mt-0.5 leading-tight">
              Bayu Wicaksono
            </span>
          </div>
        </div>

        {/* Notifikasi Minimalist */}
        <button
          type="button"
          aria-label="Notifikasi Kampus"
          onClick={onNotificationClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#44574B] hover:bg-slate-100 hover:text-[#14261B] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] flex-shrink-0"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B3261E] ring-2 ring-white" />
        </button>
      </div>
    </header>
  )
}
