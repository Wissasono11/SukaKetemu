import React from 'react'
import { FileCheck2, QrCode, ShieldCheck, HelpCircle } from 'lucide-react'

const SOP_STEPS = [
  {
    step: '1',
    icon: FileCheck2,
    title: 'Bawa KTM / Identitas Resmi',
    desc: 'Wajib membawa Kartu Tanda Mahasiswa (KTM) aktif atau KTP untuk verifikasi kepemilikan fisik.',
  },
  {
    step: '2',
    icon: QrCode,
    title: 'Tunjukkan QR Tiket / OTP 6-Digit',
    desc: 'Buka menu Cek Klaim pada aplikasi, tunjukkan kode QR tiket atau sebutkan 6 digit OTP dinamis kepada petugas.',
  },
  {
    step: '3',
    icon: ShieldCheck,
    title: 'Verifikasi Fisik & Serah Terima',
    desc: 'Cocokkan nomor seri/ciri khusus bersama satpam, lalu konfirmasi serah terima di aplikasi.',
  },
]

export const SopGuideCard: React.FC = () => {
  return (
    <section
      aria-labelledby="sop-heading"
      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E4F1E8] text-[#155E38] flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-[#155E38]" />
          </div>
          <div>
            <h3 id="sop-heading" className="text-xs font-bold text-[#14261B]">
              SOP Serah Terima Barang
            </h3>
            <p className="text-[10px] text-slate-500">
              Prosedur pengambilan barang di Pos Satpam FST
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#155E38] bg-[#E4F1E8] px-2 py-0.5 rounded-full font-bold">
          SOP-FST-04
        </span>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        {SOP_STEPS.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#155E38] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                {s.step}
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-[#155E38]" />
                  {s.title}
                </span>
                <span className="text-[11px] text-[#44574B] leading-relaxed mt-0.5">
                  {s.desc}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-600 font-medium">Butuh bantuan darurat?</span>
        <a
          href="tel:+62274512474"
          className="font-bold text-[#155E38] hover:underline flex items-center gap-1"
        >
          Hotline Satpam FST
        </a>
      </div>
    </section>
  )
}
