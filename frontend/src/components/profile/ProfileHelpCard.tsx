import React from 'react'
import { Phone } from 'lucide-react'

export const ProfileHelpCard: React.FC = () => {
  return (
    <section className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-2.5 text-left text-xs">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-[#14261B]">Bantuan &amp; Pos Satpam FST</h4>
        <span className="text-[10px] text-slate-500 font-mono">Pos Utama Lobby</span>
      </div>

      <p className="text-[11px] text-[#44574B] leading-relaxed">
        Barang temuan yang diserahkan ke pos satpam disimpan maksimal 30 hari kalender sesuai regulasi perlindungan data UU PDP No. 27/2022.
      </p>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <a
          href="tel:0274512474"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155E38] hover:underline"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>(0274) 512474 (Hotline FST)</span>
        </a>
        <span className="text-[10px] text-slate-400">Siaga 24 Jam</span>
      </div>
    </section>
  )
}
