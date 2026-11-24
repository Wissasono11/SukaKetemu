import React from 'react'
import {
  ShieldCheck,
  Key,
  Lock,
  Phone,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react'

interface WizardStep3Props {
  isFound: boolean
  custodyStatus: 'satpam' | 'penemu'
  onCustodyChange: (val: 'satpam' | 'penemu') => void
  posSatpam: string
  onPosSatpamChange: (val: string) => void
  secretFeature: string
  onSecretFeatureChange: (val: string) => void
  contactPhone: string
  onContactPhoneChange: (val: string) => void
  isSubmitting: boolean
  isSuccess: boolean
  onPrev: () => void
}

const CUSTODY_ITEMS = [
  {
    id: 'satpam' as const,
    title: 'Dititipkan di Pos Satpam',
    badge: '(Dianjurkan)',
    desc: 'Aman dijaga satpam kampus. Pemilik mengambil dengan verifikasi resmi.',
    activeClass: 'bg-[#E4F1E8] border-[#155E38] ring-1 ring-[#155E38]',
    accentColor: '#155E38',
    textColor: 'text-[#0F4A2C]',
  },
  {
    id: 'penemu' as const,
    title: 'Masih Dibawa Penemu',
    desc: 'Serah terima memakai Tiket QR Interaktif di lokasi kampus yang disepakati.',
    activeClass: 'bg-[#FEF3C7] border-[#C59B27] ring-1 ring-[#C59B27]',
    accentColor: '#C59B27',
    textColor: 'text-[#92400E]',
  },
]

export const WizardStep3: React.FC<WizardStep3Props> = ({
  isFound,
  custodyStatus,
  onCustodyChange,
  posSatpam,
  onPosSatpamChange,
  secretFeature,
  onSecretFeatureChange,
  contactPhone,
  onContactPhoneChange,
  isSubmitting,
  isSuccess,
  onPrev,
}) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {isFound ? (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
          <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#155E38]" />
            Di Mana Fisik Barang Sekarang?
          </span>

          <div className="flex flex-col gap-2">
            {CUSTODY_ITEMS.map((item) => {
              const isSelected = custodyStatus === item.id
              return (
                <label
                  key={item.id}
                  onClick={() => onCustodyChange(item.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${isSelected ? item.activeClass : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="custody"
                      checked={isSelected}
                      onChange={() => onCustodyChange(item.id)}
                      className="w-4 h-4 mt-0.5"
                      style={{ accentColor: item.accentColor }}
                    />
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${item.textColor}`}>
                        {item.title} {item.badge && <span className="text-[11px] font-normal text-[#155E38]">{item.badge}</span>}
                      </span>
                      <span className="text-[11px] text-[#44574B] mt-0.5">{item.desc}</span>
                    </div>
                  </div>

                  {item.id === 'satpam' && isSelected && (
                    <div className="mt-2 pt-2 border-t border-[#155E38]/20 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0F4A2C]">Pilih Pos:</span>
                      <select
                        value={posSatpam}
                        onChange={(e) => onPosSatpamChange(e.target.value)}
                        className="bg-white text-xs font-semibold text-[#0F4A2C] rounded-lg p-1 border border-[#155E38]/30"
                      >
                        <option value="Pos Satpam Utama FST (Lobby)">Pos Lobby FST</option>
                        <option value="Pos Gerbang Barat">Gerbang Barat</option>
                        <option value="Pos Gerbang Timur">Gerbang Timur</option>
                      </select>
                    </div>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#155E38]" />
              Bukti Kepemilikan (Privat)
            </span>
            <span className="text-[10px] font-bold text-[#5A4300] bg-[#FFDF98] px-2 py-0.5 rounded-full">
              Zero-Knowledge
            </span>
          </div>

          <p className="text-[11px] text-[#44574B] leading-relaxed">
            Jawaban ini <strong>tidak pernah dipublikasikan di feed</strong>. Hanya dicocokkan otomatis oleh AI &amp; Satpam saat ada temuan.
          </p>

          <div className="flex flex-col gap-1">
            <label htmlFor="secret-feature" className="text-xs font-bold text-[#14261B] flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-[#C59B27]" />
              Ciri Rahasia Khusus Pemilik
            </label>
            <input
              id="secret-feature"
              type="text"
              value={secretFeature}
              onChange={(e) => onSecretFeatureChange(e.target.value)}
              placeholder="Contoh: PIN layar 4 digit, stiker dalam case, tanda khusus..."
              className="w-full bg-slate-50 text-[#14261B] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#155E38]/20 border border-slate-200"
            />
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <label htmlFor="contact-phone" className="text-xs font-bold text-[#14261B] flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#155E38]" />
              Nomor WhatsApp untuk Notifikasi AI Match
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => onContactPhoneChange(e.target.value)}
              placeholder="0812-3456-7890"
              className="w-full bg-slate-50 text-[#14261B] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#155E38]/20 border border-slate-200"
            />
          </div>
        </div>
      )}

      {/* Action Submit */}
      <div className="flex flex-col gap-2 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${isSuccess
            ? 'bg-[#1B7A43] text-white'
            : isSubmitting
              ? 'bg-[#155E38]/80 text-white cursor-wait'
              : 'bg-[#155E38] hover:bg-[#0F4A2C] text-white'
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{isFound ? 'Mengunggah Laporan Temuan...' : 'Menerbitkan Laporan Hilang...'}</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-white" />
              <span>{isFound ? 'Berhasil! Laporan Terpasang di Sistem' : 'Berhasil! Laporan Telah Terbit'}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-white" />
              <span>{isFound ? 'Kirim Laporan Temuan' : 'Kirim & Terbitkan Laporan Hilang'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Kembali ke Langkah Sebelumnya
        </button>
      </div>
    </div>
  )
}
