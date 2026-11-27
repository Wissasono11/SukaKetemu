import React from 'react'
import { FileSearch, Camera, QrCode, ShieldCheck } from 'lucide-react'

interface QuickActionsProps {
  onActionClick: (title: string) => void
}

const QUICK_BTN_CLASS =
  'flex flex-col items-center gap-1.5 group rounded-xl py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2'

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <section aria-label="Aksi Cepat Layanan" className="w-full">
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onActionClick('Lapor Barang Hilang')}
          className={QUICK_BTN_CLASS}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#155E38] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0F4A2C] group-active:scale-95 transition-all">
            <FileSearch className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-bold text-[#155E38] text-center leading-tight">
            Lapor Hilang
          </span>
        </button>

        <button
          type="button"
          onClick={() => onActionClick('Lapor Barang Temuan')}
          className={QUICK_BTN_CLASS}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#155E38] shadow-[0_2px_6px_rgba(20,38,27,0.03)] group-hover:bg-slate-50 group-active:scale-95 transition-all">
            <Camera className="w-5 h-5 text-[#155E38]" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-medium text-[#44574B] text-center leading-tight">
            Temuan
          </span>
        </button>

        <button
          type="button"
          onClick={() => onActionClick('Scan QR Pos Satpam')}
          className={QUICK_BTN_CLASS}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#155E38] shadow-[0_2px_6px_rgba(20,38,27,0.03)] group-hover:bg-slate-50 group-active:scale-95 transition-all">
            <QrCode className="w-5 h-5 text-[#155E38]" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-medium text-[#44574B] text-center leading-tight">
            Scan QR
          </span>
        </button>

        <button
          type="button"
          onClick={() => onActionClick('Cek Status Klaim')}
          className={QUICK_BTN_CLASS}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#155E38] shadow-[0_2px_6px_rgba(20,38,27,0.03)] group-hover:bg-slate-50 group-active:scale-95 transition-all">
            <ShieldCheck className="w-5 h-5 text-[#155E38]" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-medium text-[#44574B] text-center leading-tight">
            Cek Klaim
          </span>
        </button>
      </div>
    </section>
  )
}
