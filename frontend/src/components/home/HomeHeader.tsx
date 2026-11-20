import React from 'react'
import { User, Bell } from 'lucide-react'

interface HomeHeaderProps {
  onNotificationClick: () => void
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 transition-all text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#C59B27] to-[#FECE57] shadow-sm flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#155E38] text-white flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5 text-white/95" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-medium text-[#44574B] leading-tight block">
              Assalamu'alaikum,
            </span>
            <span className="text-sm font-bold text-[#14261B] tracking-tight mt-0.5 leading-tight block">
              Bayu Wicaksono
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notifikasi Kampus"
          onClick={onNotificationClick}
          className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#14261B] hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-[#44574B]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B3261E] ring-2 ring-white" />
        </button>
      </div>
    </header>
  )
}
