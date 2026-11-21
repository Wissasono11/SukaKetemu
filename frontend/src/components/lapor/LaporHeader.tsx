import React from 'react'
import { ArrowLeft, X, Shield, CloudCheck } from 'lucide-react'

interface LaporHeaderProps {
  isFound: boolean
  onBack: () => void
  onClose: () => void
}

export const LaporHeader: React.FC<LaporHeaderProps> = ({ isFound, onBack, onClose }) => {
  return (
    <header className="flex flex-col w-full pb-2 border-b border-slate-100">
      <div className="flex items-center justify-between py-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#14261B] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-[#14261B]" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-[#155E38] uppercase">
            {isFound ? 'Mode Penemu' : 'Mode Pelapor'}
          </span>
          <h2 className="text-base font-bold text-[#14261B]">
            {isFound ? 'Lapor Barang Temuan' : 'Lapor Barang Hilang'}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#44574B] active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between px-1 mt-2 text-[11px] text-[#44574B]">
        <span className="inline-flex items-center gap-1 font-semibold text-[#0F4A2C]">
          <Shield className="w-3.5 h-3.5 text-[#155E38]" />
          Data Aman (UU PDP)
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-slate-500">
          <CloudCheck className="w-3.5 h-3.5 text-[#1B7A43]" />
          Auto-Sync Lokal
        </span>
      </div>
    </header>
  )
}
