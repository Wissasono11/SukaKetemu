import React from 'react'
import { Home, Compass, Plus, Radar, User } from 'lucide-react'

export type TabId = 'beranda' | 'eksplor' | 'cocok-ai' | 'profil'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  onPlusClick: () => void
  aiMatchCount?: number
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onPlusClick,
  aiMatchCount = 0,
}) => {
  const navBtnClass = (tab: TabId) =>
    `relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1.5 rounded-lg gap-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-1 ${
      activeTab === tab
        ? 'text-[#155E38] font-bold'
        : 'text-[#44574B] hover:text-[#14261B] font-medium'
    }`

  const activeIndicator = (tab: TabId) =>
    activeTab === tab ? (
      <span
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#155E38]"
      />
    ) : null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pb-safe">
      <div className="max-w-md mx-auto bg-white border-t border-slate-200">
        <nav
          aria-label="Navigasi Bawah"
          className="flex items-center justify-between px-2 py-1"
        >
          <div className="flex items-center justify-around flex-1">
            <button
              type="button"
              onClick={() => onTabChange('beranda')}
              aria-current={activeTab === 'beranda' ? 'page' : undefined}
              className={navBtnClass('beranda')}
            >
              {activeIndicator('beranda')}
              <Home className="w-5 h-5" aria-hidden="true" />
              <span className="text-[11px] leading-none">Beranda</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('eksplor')}
              aria-current={activeTab === 'eksplor' ? 'page' : undefined}
              className={navBtnClass('eksplor')}
            >
              {activeIndicator('eksplor')}
              <Compass className="w-5 h-5" aria-hidden="true" />
              <span className="text-[11px] leading-none">Eksplor</span>
            </button>
          </div>

          <div className="px-2 flex justify-center">
            <button
              type="button"
              aria-label="Buat Laporan Baru"
              onClick={onPlusClick}
              className="w-11 h-11 rounded-xl bg-[#155E38] text-white flex items-center justify-center hover:bg-[#0F4A2C] active:scale-95 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2"
            >
              <Plus className="w-5 h-5 text-white stroke-[2.5]" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-around flex-1">
            <button
              type="button"
              onClick={() => onTabChange('cocok-ai')}
              aria-current={activeTab === 'cocok-ai' ? 'page' : undefined}
              aria-label={
                aiMatchCount > 0
                  ? `Radar AI, ${aiMatchCount} kecocokan baru`
                  : 'Radar AI'
              }
              className={navBtnClass('cocok-ai')}
            >
              {activeIndicator('cocok-ai')}
              <div className="relative">
                <Radar className="w-5 h-5" aria-hidden="true" />
                {aiMatchCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#155E38] text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {aiMatchCount > 9 ? '9+' : aiMatchCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-none">Radar AI</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('profil')}
              aria-current={activeTab === 'profil' ? 'page' : undefined}
              className={navBtnClass('profil')}
            >
              {activeIndicator('profil')}
              <User className="w-5 h-5" aria-hidden="true" />
              <span className="text-[11px] leading-none">Profil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
