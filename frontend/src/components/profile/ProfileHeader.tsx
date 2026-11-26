import React, { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'

interface ProfileHeaderProps {
  onLogout?: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [logoutNotice, setLogoutNotice] = useState(false)

  useEffect(() => {
    if (!showLogoutConfirm) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLogoutConfirm(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLogoutConfirm])

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false)
    if (onLogout) {
      onLogout()
    } else {
      setLogoutNotice(true)
    }
  }

  return (
    <>
      <section className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[#155E38] text-white flex items-center justify-center font-bold text-sm flex-shrink-0"
            >
              BW
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-extrabold text-[#14261B] truncate">
                Bayu Wicaksono
              </h2>
              <span className="text-xs text-[#44574B] tabular-nums">
                NIM 23106050012 · SSO SIA Aktif
              </span>
              <span className="text-[11px] text-[#44574B] truncate mt-0.5">
                Teknik Informatika, UIN Sunan Kalijaga
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Keluar dari akun SSO"
            title="Keluar dari akun"
            className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 rounded-lg text-[#44574B] hover:text-[#B3261E] hover:bg-slate-100 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {logoutNotice && (
          <div
            role="status"
            className="px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 text-xs text-[#14261B]"
          >
            <span>Sesi SSO SIA diakhiri. Draft laporan lokal tetap tersimpan.</span>
            <button
              type="button"
              onClick={() => setLogoutNotice(false)}
              className="text-xs font-bold text-[#155E38] hover:underline flex-shrink-0"
            >
              Tutup
            </button>
          </div>
        )}
      </section>

      {/* Dialog Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutConfirm(false)
          }}
        >
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-slate-200 flex flex-col gap-3 text-left shadow-lg">
            <h3 id="logout-dialog-title" className="text-sm font-bold text-[#14261B]">
              Keluar dari Akun SSO?
            </h3>
            <p className="text-xs text-[#44574B] leading-relaxed">
              Sesi SSO SIA Anda akan ditutup. Draft laporan lokal di perangkat ini tetap tersimpan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#44574B] hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
              >
                Tetap Masuk
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#B3261E] hover:bg-[#8C1D18] text-white text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B3261E] focus-visible:ring-offset-2"
              >
                Keluar Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileHeader
