import React, { useEffect, useRef, useState } from 'react'
import {
  Shield,
  User,
  MapPin,
  EyeOff,
  Lock,
  FileText,
  ZoomIn,
  X,
  ChevronDown,
} from 'lucide-react'
import type { AiMatchItem } from '../../types/lostFound'

interface AiMatchHeroCardProps {
  item: AiMatchItem
  onClaim: (item: AiMatchItem) => void
  onReject: (id: string) => void
}

interface PreviewPhoto {
  url: string
  alt: string
  caption: string
  tag: string
}

function getScoreTier(score: number) {
  if (score >= 85) {
    return {
      label: 'Sangat Cocok',
      badgeClass: 'bg-[#E4F1E8] text-[#0F4A2C] border-[#155E38]/20',
      textClass: 'text-[#155E38]',
    }
  }
  if (score >= 65) {
    return {
      label: 'Cukup Mirip',
      badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#92400E]/20',
      textClass: 'text-[#92400E]',
    }
  }
  return {
    label: 'Kemungkinan Kecil',
    badgeClass: 'bg-slate-100 text-[#44574B] border-slate-200',
    textClass: 'text-[#44574B]',
  }
}

const SHORT_SIGNAL_LABEL: Record<string, string> = {
  visual: 'Foto',
  text: 'Teks',
  location: 'Lokasi',
  time: 'Waktu',
}

export const AiMatchHeroCard: React.FC<AiMatchHeroCardProps> = ({
  item,
  onClaim,
  onReject,
}) => {
  const [previewPhoto, setPreviewPhoto] = useState<PreviewPhoto | null>(null)
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const isPosSatpam = item.custody === 'pos_satpam'
  const tier = getScoreTier(item.matchScore)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (previewPhoto) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else if (dialog.open) {
      dialog.close()
    }
  }, [previewPhoto])

  const openPhotoPreview = (photo: PreviewPhoto) => {
    setPreviewPhoto(photo)
  }

  return (
    <>
      <article className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 text-left shadow-[0_1px_2px_rgba(20,38,27,0.03)]">
        {/* Baris Identitas Kandidat */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-[#14261B] tabular-nums">
              Kandidat #{item.rank}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-bold tabular-nums ${tier.badgeClass}`}
            >
              {item.matchScore}% • {tier.label}
            </span>
          </div>
          <span className="text-[11px] text-[#44574B] whitespace-nowrap">
            {item.timeAgo}
          </span>
        </div>

        {/* Komparasi: Mode Foto vs Mode Teks */}
        {item.hasReferencePhoto && item.lostItemImageUrl ? (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() =>
                  openPhotoPreview({
                    url: item.lostItemImageUrl!,
                    alt: `Foto referensi ${item.lostItemTitle}`,
                    caption: item.lostItemTitle,
                    tag: 'Foto Laporan Anda',
                  })
                }
                aria-label={`Perbesar foto laporan Anda: ${item.lostItemTitle}`}
                className="group relative aspect-4/3 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
              >
                <img
                  src={item.lostItemImageUrl}
                  alt={`Foto referensi ${item.lostItemTitle}`}
                  width={320}
                  height={240}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#14261B]/80 text-white text-[10px] font-semibold">
                  Laporan Anda
                </span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </button>
              <span className="text-xs font-semibold text-[#14261B] truncate">
                {item.lostItemTitle}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {item.isPrivacySensitive ? (
                <div className="relative aspect-4/3 rounded-lg bg-slate-100 overflow-hidden border border-[#155E38]/40">
                  <img
                    src={item.foundItemImageUrl}
                    alt={item.foundItemTitle}
                    width={320}
                    height={240}
                    className="w-full h-full object-cover blur-md scale-110"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#155E38]/90 text-white text-[10px] font-semibold z-10">
                    Temuan
                  </span>
                  <div className="absolute inset-0 bg-[#14261B]/55 flex flex-col items-center justify-center p-2 text-center">
                    <EyeOff className="w-4 h-4 text-white mb-1" aria-hidden="true" />
                    <span className="text-[11px] font-bold text-white">
                      Foto Disamarkan
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    openPhotoPreview({
                      url: item.foundItemImageUrl,
                      alt: item.foundItemTitle,
                      caption: item.foundItemTitle,
                      tag: 'Foto Temuan Kampus',
                    })
                  }
                  aria-label={`Perbesar foto temuan: ${item.foundItemTitle}`}
                  className="group relative aspect-4/3 rounded-lg bg-slate-100 overflow-hidden border border-[#155E38]/40 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
                >
                  <img
                    src={item.foundItemImageUrl}
                    alt={item.foundItemTitle}
                    width={320}
                    height={240}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#155E38]/90 text-white text-[10px] font-semibold">
                    Temuan
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </span>
                </button>
              )}
              <span className="text-xs font-bold text-[#14261B] truncate">
                {item.foundItemTitle}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 border border-slate-200/80 p-2.5 text-xs text-[#44574B]">
              <FileText
                className="w-4 h-4 text-[#155E38] flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#44574B]">
                  Patokan Laporan Anda (Tanpa Foto)
                </span>
                <span className="font-bold text-[#14261B] mt-0.5">
                  {item.lostItemTitle}
                </span>
                {item.lostItemDescription && (
                  <p className="text-[11px] text-[#44574B] mt-0.5 leading-snug line-clamp-2">
                    {item.lostItemDescription}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {item.isPrivacySensitive ? (
                <div className="relative aspect-16/10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                  <img
                    src={item.foundItemImageUrl}
                    alt={item.foundItemTitle}
                    width={480}
                    height={300}
                    className="w-full h-full object-cover blur-md scale-110"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#155E38]/90 text-white text-[10px] font-semibold z-10">
                    Temuan Kampus
                  </span>
                  <div className="absolute inset-0 bg-[#14261B]/60 flex flex-col items-center justify-center p-3 text-center">
                    <EyeOff className="w-5 h-5 text-white mb-1" aria-hidden="true" />
                    <span className="text-xs font-bold text-white">
                      Disamarkan untuk Perlindungan Data Pribadi
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    openPhotoPreview({
                      url: item.foundItemImageUrl,
                      alt: item.foundItemTitle,
                      caption: item.foundItemTitle,
                      tag: 'Foto Temuan Kampus',
                    })
                  }
                  aria-label={`Perbesar foto temuan: ${item.foundItemTitle}`}
                  className="group relative aspect-16/10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
                >
                  <img
                    src={item.foundItemImageUrl}
                    alt={item.foundItemTitle}
                    width={480}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#155E38]/90 text-white text-[10px] font-semibold">
                    Temuan Kampus
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </button>
              )}
              <span className="text-xs font-bold text-[#14261B]">
                {item.foundItemTitle}
              </span>
            </div>
          </div>
        )}

        {/* Informasi Lokasi & Kustodi */}
        <div
          className={`flex flex-col gap-1 pl-3 py-1 border-l-2 text-xs ${
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

        {/* Ringkasan Alasan Kecocokan (Ringkas + Detail Expandable) */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-[#14261B]">
              Alasan Kecocokan
            </h3>
            {!item.hasReferencePhoto && (
              <span className="text-[11px] text-[#44574B]">
                Tanpa foto referensi
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {item.evidenceList.map((ev) => (
              <span
                key={ev.signal}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-[#14261B]"
              >
                <span className="text-[#44574B]">
                  {SHORT_SIGNAL_LABEL[ev.signal] ?? ev.factor}
                </span>
                <span className={`font-bold tabular-nums ${tier.textClass}`}>
                  {ev.scorePercent}%
                </span>
              </span>
            ))}
          </div>

          <details className="group">
            <summary className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#155E38] hover:text-[#0F4A2C] list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] rounded">
              <span>Lihat rincian ({item.evidenceList.length} faktor)</span>
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-150 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <ul className="mt-2 flex flex-col divide-y divide-slate-100 text-xs border-t border-slate-100">
              {item.evidenceList.map((ev) => (
                <li
                  key={ev.signal}
                  className="py-1.5 flex items-baseline justify-between gap-3"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#14261B]">
                      {ev.factor}{' '}
                      <span className="font-normal text-[11px] text-[#44574B]">
                        (bobot {ev.weightPercent}%)
                      </span>
                    </span>
                    <span className="text-[11px] text-[#44574B] leading-snug">
                      {ev.description}
                    </span>
                  </div>
                  <span className={`font-semibold tabular-nums flex-shrink-0 ${tier.textClass}`}>
                    {ev.scorePercent}%
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </div>

        {/* Tombol Aksi Sejajar */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onReject(item.id)}
            className="shrink-0 min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-[#B3261E] text-xs font-semibold text-[#44574B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
          >
            Bukan Milik Saya
          </button>

          <button
            type="button"
            onClick={() => onClaim(item)}
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] active:scale-[0.99] text-white text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2"
          >
            Klaim &amp; Verifikasi
          </button>
        </div>
      </article>

      {/* Lightbox Preview Foto */}
      <dialog
        ref={dialogRef}
        {...({ closedby: 'any' } as Record<string, string>)}
        onClose={() => setPreviewPhoto(null)}
        onClick={(e) => {
          if ('closedBy' in HTMLDialogElement.prototype) return
          const dialog = dialogRef.current
          if (!dialog || e.target !== dialog) return
          const rect = dialog.getBoundingClientRect()
          const isInsideContent =
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width
          if (!isInsideContent) setPreviewPhoto(null)
        }}
        aria-label={previewPhoto ? previewPhoto.caption : 'Pratinjau foto'}
        className="m-auto w-[min(92vw,420px)] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-xs"
      >
        {previewPhoto && (
          <div className="flex flex-col text-left">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-[#155E38]">
                  {previewPhoto.tag}
                </span>
                <span className="text-xs font-bold text-[#14261B] truncate">
                  {previewPhoto.caption}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                aria-label="Tutup pratinjau foto"
                className="min-w-[44px] min-h-[44px] -mr-2 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#44574B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-100 p-2 flex items-center justify-center">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.alt}
                className="w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
