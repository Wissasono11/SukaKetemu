import React from 'react'
import { Shield, User, MapPin, EyeOff, Lock, FileText } from 'lucide-react'
import type { AiMatchItem } from '../../../types/lostFound'

interface AiMatchHeroCardProps {
  item: AiMatchItem
  onClaim: (item: AiMatchItem) => void
  onReject: (id: string) => void
}

export const AiMatchHeroCard: React.FC<AiMatchHeroCardProps> = ({
  item,
  onClaim,
  onReject,
}) => {
  const isPosSatpam = item.custody === 'pos_satpam'

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3.5 text-left">
      {/* Baris Identitas Kandidat */}
      <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-[#14261B] tabular-nums">
            Kandidat #{item.rank}
          </span>
          <span className="text-xs font-bold text-[#155E38] tabular-nums">
            {item.matchScore}% cocok
          </span>
        </div>
        <span className="text-xs text-[#44574B] whitespace-nowrap">
          {item.timeAgo}
        </span>
      </div>

      {/* Komparasi: Mode Foto vs Mode Teks */}
      {item.hasReferencePhoto && item.lostItemImageUrl ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="relative aspect-4/3 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
              <img
                src={item.lostItemImageUrl}
                alt={`Foto referensi ${item.lostItemTitle}`}
                width={320}
                height={240}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-[#44574B]">
                Laporan Anda
              </span>
              <span className="text-xs font-semibold text-[#14261B] truncate">
                {item.lostItemTitle}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="relative aspect-4/3 rounded-lg bg-slate-100 overflow-hidden border border-[#155E38]/40">
              <img
                src={item.foundItemImageUrl}
                alt={item.foundItemTitle}
                width={320}
                height={240}
                className={`w-full h-full object-cover ${
                  item.isPrivacySensitive ? 'blur-md scale-110' : ''
                }`}
              />
              {item.isPrivacySensitive && (
                <div className="absolute inset-0 bg-[#14261B]/55 flex flex-col items-center justify-center p-2 text-center">
                  <EyeOff className="w-4 h-4 text-white mb-1" aria-hidden="true" />
                  <span className="text-[11px] font-bold text-white">
                    Foto Disamarkan
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-[#155E38]">
                Temuan Kampus
              </span>
              <span className="text-xs font-bold text-[#14261B] truncate">
                {item.foundItemTitle}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2.5 text-xs text-[#44574B] border-l-2 border-slate-300 pl-3 py-0.5">
            <FileText className="w-4 h-4 text-[#44574B] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[#14261B]">
                {item.lostItemTitle}
              </span>
              {item.lostItemDescription && (
                <p className="text-xs text-[#44574B] mt-0.5 leading-snug">
                  {item.lostItemDescription}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="relative aspect-video rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
              <img
                src={item.foundItemImageUrl}
                alt={item.foundItemTitle}
                width={480}
                height={270}
                className={`w-full h-full object-cover ${
                  item.isPrivacySensitive ? 'blur-md scale-110' : ''
                }`}
              />
              {item.isPrivacySensitive && (
                <div className="absolute inset-0 bg-[#14261B]/60 flex flex-col items-center justify-center p-3 text-center">
                  <EyeOff className="w-5 h-5 text-white mb-1" aria-hidden="true" />
                  <span className="text-xs font-bold text-white">
                    Disamarkan untuk Perlindungan Data Pribadi
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-[#14261B]">
              {item.foundItemTitle}
            </span>
          </div>
        </div>
      )}

      {/* Informasi Lokasi & Kustodi */}
      <div
        className={`flex flex-col gap-1.5 pl-3 py-1 border-l-2 text-xs ${
          isPosSatpam ? 'border-[#155E38]' : 'border-[#92400E]'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[#14261B]">
          {isPosSatpam ? (
            <Shield className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" aria-hidden="true" />
          ) : (
            <User className="w-3.5 h-3.5 text-[#92400E] flex-shrink-0" aria-hidden="true" />
          )}
          <span>
            {isPosSatpam ? (
              <>
                Dititipkan di <strong>{item.custodyPos || 'Pos Satpam FST'}</strong>
              </>
            ) : (
              <strong>Masih dibawa penemu di area kampus</strong>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#44574B]">
          <MapPin className="w-3.5 h-3.5 text-[#44574B] flex-shrink-0" aria-hidden="true" />
          <span>Titik temuan: {item.foundLocation}</span>
        </div>

        {!isPosSatpam && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#92400E]">
            <Lock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span>Kontak penemu dibuka setelah verifikasi ciri rahasia.</span>
          </div>
        )}
      </div>

      {/* Ringkasan Alasan Kecocokan (Ringkas, Tanpa Jargon Teknis) */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xs font-bold text-[#14261B]">
            Alasan Kecocokan
          </h3>
          {!item.hasReferencePhoto && (
            <span className="text-[11px] text-[#44574B]">
              Tanpa foto referensi
            </span>
          )}
        </div>

        <ul className="flex flex-col divide-y divide-slate-100 text-xs">
          {item.evidenceList.map((ev) => (
            <li
              key={ev.signal}
              className="py-1.5 flex items-baseline justify-between gap-3"
            >
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-[#14261B]">
                  {ev.factor}
                </span>
                <span className="text-[11px] text-[#44574B] leading-snug">
                  {ev.description}
                </span>
              </div>
              <span className="font-semibold text-[#155E38] tabular-nums flex-shrink-0">
                {ev.scorePercent}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={() => onClaim(item)}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] active:scale-[0.99] text-white text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2"
        >
          Klaim &amp; Verifikasi Kepemilikan
        </button>

        <button
          type="button"
          onClick={() => onReject(item.id)}
          className="min-h-[44px] py-2 text-xs font-semibold text-[#44574B] hover:text-[#14261B] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
        >
          Bukan Barang Saya
        </button>
      </div>
    </article>
  )
}
