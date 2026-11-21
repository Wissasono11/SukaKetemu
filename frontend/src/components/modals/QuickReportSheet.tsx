import React from 'react'
import { X, FileSearch, Camera } from 'lucide-react'

interface QuickReportSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: 'lost' | 'found') => void
}

export const QuickReportSheet: React.FC<QuickReportSheetProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex flex-col text-left">
            <h4 className="text-base font-bold text-[#14261B]">Pilih Jenis Laporan</h4>
            <p className="text-xs text-[#44574B]">Pilih layanan cepat Lost &amp; Found FST</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pilihan laporan"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose()
              onSelectType('lost')
            }}
            className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#155E38]/20 bg-[#E4F1E8]/50 hover:bg-[#E4F1E8] text-left transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#155E38] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F4A2C] transition-colors">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#0F4A2C]">Lapor Barang Hilang</span>
              <span className="text-[11px] text-[#44574B]">Saya kehilangan barang di area kampus</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              onSelectType('found')
            }}
            className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#155E38] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Camera className="w-5 h-5 text-[#155E38]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#14261B]">Lapor Barang Temuan</span>
              <span className="text-[11px] text-[#44574B]">Saya menemukan barang milik orang lain</span>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 mt-1 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  )
}
