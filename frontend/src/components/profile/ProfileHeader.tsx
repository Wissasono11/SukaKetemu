import React, { useState } from 'react'
import { LogOut } from 'lucide-react'

interface ProfileHeaderProps {
  onLogout?: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false)
    if (onLogout) onLogout()
    else alert('Sesi SSO telah berakhir. Silakan login kembali melalui Superapp.')
  }

  return (
    <>
      <section className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#155E38] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
              BW
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#14261B] truncate">
                  Bayu Wicaksono
                </h3>
                <span className="text-[10px] font-semibold text-[#155E38] bg-[#E4F1E8] px-2 py-0.5 rounded-md">
                  SSO Aktif
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                NIM 23106050012
              </span>
              <span className="text-[11px] text-[#44574B] truncate mt-0.5">
                Teknik Informatika &bull; FST UIN Sunan Kalijaga
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Keluar dari akun"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Modal Dialog Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 flex flex-col gap-3 text-left shadow-xl">
            <h4 className="text-sm font-bold text-[#14261B]">Keluar dari Akun?</h4>
            <p className="text-xs text-[#44574B] leading-relaxed">
              Sesi SSO SIA Anda akan ditutup. Draft laporan lokal di perangkat ini tetap tersimpan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default ProfileHeader
