import React from 'react'
import { Bell, ShieldCheck, BadgeCheck } from 'lucide-react'

interface HomeHeaderProps {
  onNotificationClick: () => void
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 transition-all text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          {/* Avatar Civitas dengan Badge Verifikasi */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C59B27]/40 shadow-xs bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop"
                alt="Foto Profil Bayu Wicaksono"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              title="Civitas Terverifikasi FST"
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#155E38] text-white flex items-center justify-center ring-2 ring-white shadow-xs"
            >
              <BadgeCheck className="w-3 h-3 text-[#FFDF98]" />
            </div>
          </div>

          {/* Sapaan & Identitas Kampus */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#44574B]">Assalamu'alaikum,</span>
              <span className="text-sm font-bold text-[#14261B] tracking-tight">Bayu</span>
              <span className="text-xs">👋</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F4A2C] bg-[#E4F1E8] px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-[#155E38]" />
                Mahasiswa FST • TI '22
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Lonceng Notifikasi dengan Badge Counter */}
        <button
          type="button"
          aria-label="Notifikasi Kampus (2 baru)"
          onClick={onNotificationClick}
          className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 active:scale-95 transition-all text-[#14261B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-[#44574B]" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B3261E] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
            2
          </span>
        </button>
      </div>
    </header>
  )
}
