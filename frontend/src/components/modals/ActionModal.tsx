import React from 'react'
import { X } from 'lucide-react'

interface ActionModalProps {
  title: string | null
  onClose: () => void
}

export const ActionModal: React.FC<ActionModalProps> = ({ title, onClose }) => {
  if (!title) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-sm font-bold text-[#14261B]">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-[#44574B] py-3 leading-relaxed">
          Fitur <strong>{title}</strong> siap diintegrasikan dengan database laporan kampus atau scanner QR Pos Satpam UIN Sunan Kalijaga.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-[#155E38] text-white text-xs font-semibold hover:bg-[#0F4A2C]"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
