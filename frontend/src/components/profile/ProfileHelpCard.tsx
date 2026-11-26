import React from 'react'
import { Phone } from 'lucide-react'

export const ProfileHelpCard: React.FC = () => {
  return (
    <aside
      aria-label="Informasi Penitipan Pos Satpam FST"
      className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 flex flex-col gap-2 text-left text-xs"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-bold text-[#14261B]">Pos Satpam Utama FST</h3>
        <span className="text-[11px] font-medium text-[#44574B]">Siaga 24 Jam</span>
      </div>

      <p className="text-[11px] text-[#44574B] leading-relaxed">
        Barang temuan yang dititipkan di pos satpam disimpan maksimal 30 hari kalender sesuai ketentuan UU PDP No. 27/2022.
      </p>

      <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
        <a
          href="tel:0274512474"
          className="min-h-[36px] inline-flex items-center gap-1.5 text-xs font-bold text-[#155E38] hover:underline rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
        >
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Hotline Satpam (0274) 512474</span>
        </a>
      </div>
    </aside>
  )
}
