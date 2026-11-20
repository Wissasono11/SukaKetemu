import React from 'react'
import { HandHeart } from 'lucide-react'

export const StewardshipCard: React.FC = () => {
  return (
    <section className="w-full">
      <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 shadow-[0_2px_8px_rgba(20,38,27,0.02)]">
        <div className="w-10 h-10 rounded-2xl bg-[#E4F1E8] text-[#155E38] flex items-center justify-center flex-shrink-0">
          <HandHeart className="w-5 h-5 text-[#155E38]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#14261B]">
            Amanah &amp; Tanggung Jawab
          </span>
          <span className="text-[11px] text-[#44574B] leading-snug mt-0.5">
            Menemukan barang di area UIN Sunan Kalijaga? Serahkan segera ke Pos Satpam terdekat.
          </span>
        </div>
      </div>
    </section>
  )
}
