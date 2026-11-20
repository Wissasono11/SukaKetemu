import React from 'react'
import { Home, Compass, Plus, ScanSearch, User } from 'lucide-react'

export type TabId = 'beranda' | 'eksplor' | 'cocok-ai' | 'profil'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  onPlusClick: () => void
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onPlusClick,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-safe">
      <div className="max-w-md mx-auto px-4 pb-3">
        <nav
          aria-label="Navigasi Bawah"
          className="pointer-events-auto relative flex items-center justify-between px-2 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_8px_24px_rgba(15,74,44,0.12)]"
        >
          <div className="flex items-center justify-around flex-1">
            <button
              type="button"
              onClick={() => onTabChange('beranda')}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
                activeTab === 'beranda' ? 'text-[#155E38] font-bold' : 'text-[#44574B] hover:text-[#155E38]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Beranda</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('eksplor')}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
                activeTab === 'eksplor' ? 'text-[#155E38] font-bold' : 'text-[#44574B] hover:text-[#155E38]'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px]">Eksplor</span>
            </button>
          </div>

          <div className="relative -top-4 px-2 flex justify-center">
            <button
              type="button"
              aria-label="Buat Laporan Baru"
              onClick={onPlusClick}
              className="w-13 h-13 rounded-full bg-[#155E38] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(15,74,44,0.3)] hover:bg-[#0F4A2C] active:scale-95 transition-all ring-4 ring-[#F8FAFC]"
            >
              <Plus className="w-6 h-6 text-white stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-center justify-around flex-1">
            <button
              type="button"
              onClick={() => onTabChange('cocok-ai')}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
                activeTab === 'cocok-ai' ? 'text-[#155E38] font-bold' : 'text-[#44574B] hover:text-[#155E38]'
              }`}
            >
              <ScanSearch className="w-5 h-5" />
              <span className="text-[10px]">Cocok AI</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('profil')}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] gap-0.5 transition-colors ${
                activeTab === 'profil' ? 'text-[#155E38] font-bold' : 'text-[#44574B] hover:text-[#155E38]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
