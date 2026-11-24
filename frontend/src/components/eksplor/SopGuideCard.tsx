import React from 'react'
import { ShieldCheck, Phone } from 'lucide-react'

const SOP_REQUIREMENTS = [
  {
    label: '1. Identitas Mahasiswa Aktif',
    detail: 'Wajib membawa Kartu Tanda Mahasiswa (KTM) fisik atau identitas resmi berfoto (KTP/SIM) untuk pencocokan data pengambil.',
  },
  {
    label: '2. Kode Otorisasi Digital',
    detail: 'Tunjukkan QR tiket klaim dari aplikasi SukaKetemu atau sebutkan 6-digit OTP dinamis kepada petugas jaga di pos.',
  },
  {
    label: '3. Verifikasi Ciri Fisik Bersama',
    detail: 'Periksa ciri khusus (goresan, isi dompet, nomor seri) bersama satpam sebelum status serah terima diselesaikan di sistem.',
  },
]

export const SopGuideCard: React.FC = () => {
  return (
    <section
      aria-labelledby="sop-heading"
      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3 text-left"
    >
      <div className="flex items-start gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-[#E4F1E8] text-[#155E38] flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-[#155E38]" />
        </div>
        <div className="flex flex-col">
          <h3 id="sop-heading" className="text-xs font-bold text-[#14261B]">
            Tata Cara Pengambilan Barang di Pos Satpam
          </h3>
          <p className="text-[11px] text-[#44574B] mt-0.5">
            Prosedur serah terima fisik kampus UIN Sunan Kalijaga
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-0.5">
        {SOP_REQUIREMENTS.map((item) => (
          <div
            key={item.label}
            className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1"
          >
            <span className="text-xs font-bold text-[#14261B]">
              {item.label}
            </span>
            <p className="text-[11px] text-[#44574B] leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Kendala serah terima fisik?</span>
        <a
          href="tel:+62274512474"
          className="font-bold text-[#155E38] hover:text-[#0F4A2C] transition-colors inline-flex items-center gap-1"
        >
          <Phone className="w-3 h-3 text-[#155E38]" />
          <span>Hubungi Hotline Satpam FST</span>
        </a>
      </div>
    </section>
  )
}
export default SopGuideCard
