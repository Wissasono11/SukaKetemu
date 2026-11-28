import React, { useState } from 'react'
import { sileo } from 'sileo'
import {
  X,
  Shield,
  User,
  MapPin,
  EyeOff,
  CheckCircle2,
  Share2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import type { LostFoundItem } from '../../types/lostFound'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

interface ItemDetailModalProps {
  item: LostFoundItem | null
  onClose: () => void
  onRequestChallengeClaim?: (item: LostFoundItem) => void
  onClaimSuccess?: (item: LostFoundItem) => void
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onRequestChallengeClaim,
  onClaimSuccess,
}) => {
  const [isClaimed, setIsClaimed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null)
  const { copied, copy } = useCopyToClipboard()

  if (!item) return null

  const isImageLoading = loadedItemId !== item.id

  const isPosSatpam = item.custody === 'pos_satpam'

  const handleClaim = () => {
    if (onRequestChallengeClaim) {
      onRequestChallengeClaim(item)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsClaimed(true)
      if (onClaimSuccess) onClaimSuccess(item)
    }, 600)
  }

  const handleShare = async () => {
    const ok = await copy(window.location.href)
    if (ok) {
      sileo.success({
        title: 'Tautan barang disalin',
        description: 'Bagikan tautan ini ke pemilik atau rekan kampus.',
      })
    } else {
      sileo.error({
        title: 'Gagal menyalin tautan',
        description: 'Browser membatasi akses clipboard. Salin URL dari bilah alamat.',
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto overscroll-contain p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPosSatpam
                  ? 'bg-[#E4F1E8] text-[#0F4A2C]'
                  : 'bg-[#FEF3C7] text-[#92400E]'
              }`}
            >
              {isPosSatpam ? (
                <Shield className="w-3.5 h-3.5 text-[#0F4A2C]" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#92400E]" />
              )}
              {isPosSatpam ? 'Di Pos Satpam' : 'Dibawa Penemu'}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {item.categoryLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Detail"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Foto Barang */}
        <div className="relative w-full aspect-video rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
          {isImageLoading && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-10">
              <ImageIcon className="w-8 h-8 text-slate-400/70" />
            </div>
          )}
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            onLoad={() => setLoadedItemId(item.id)}
            onError={() => setLoadedItemId(item.id)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            } ${item.isPrivacySensitive ? 'blur-lg scale-110' : ''}`}
          />
          {item.isPrivacySensitive && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
              <EyeOff className="w-7 h-7 text-white mb-2" />
              <span className="text-xs font-bold text-white bg-black/70 px-3 py-1 rounded-full mb-1">
                Disamarkan Sesuai UU PDP No. 27/2022
              </span>
              <p className="text-[11px] text-white/90 max-w-xs leading-snug">
                Data sensitif kartu disamarkan untuk perlindungan privasi. Verifikasi langsung dengan satpam.
              </p>
            </div>
          )}
        </div>

        {/* Informasi Utama */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-[#14261B] leading-snug">
            {item.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#44574B]">
            <MapPin className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" />
            <span className="font-semibold">{item.locationDetail}</span>
          </div>
        </div>

        {/* Penjelasan Status Kustodi */}
        <div
          className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isPosSatpam
              ? 'bg-[#E4F1E8]/50 border-[#155E38]/20'
              : 'bg-[#FEF3C7]/40 border-[#C59B27]/30'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isPosSatpam ? 'bg-[#155E38] text-white' : 'bg-[#C59B27] text-white'
            }`}
          >
            {isPosSatpam ? (
              <ShieldCheck className="w-5 h-5 text-white" />
            ) : (
              <Clock className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`text-xs font-bold ${
                isPosSatpam ? 'text-[#0F4A2C]' : 'text-[#92400E]'
              }`}
            >
              {isPosSatpam
                ? 'Tersimpan Aman di Pos Satpam'
                : 'Masih Dipegang oleh Penemu'}
            </span>
            <p className="text-[11px] text-[#44574B] leading-relaxed mt-0.5">
              {isPosSatpam
                ? 'Barang sudah dititipkan di Pos Satpam FST. Silakan datangi pos dan tunjukkan kartu identitas untuk pengambilan fisik.'
                : 'Penemu mengamankan barang di area kampus. Ajukan klaim untuk membuat Tiket Interaktif dan atur titik temu.'}
            </p>
          </div>
        </div>

        {/* State Setelah Klaim vs Tombol Aksi */}
        {isClaimed ? (
          <div className="p-4 rounded-2xl bg-[#E4F1E8] border border-[#155E38]/20 flex flex-col items-center text-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-[#155E38]" />
            <span className="text-sm font-bold text-[#0F4A2C]">
              Klaim Berhasil Diajukan!
            </span>
            <p className="text-xs text-[#44574B] leading-relaxed">
              Tiket verifikasi telah diterbitkan. Satpam/penemu akan mencocokkan bukti kepemilikan Anda.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#155E38] text-white text-xs font-bold hover:bg-[#0F4A2C]"
            >
              Selesai &amp; Kembali
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={handleClaim}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] active:scale-[0.99] disabled:opacity-80 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menerbitkan Tiket Klaim...</span>
                </>
              ) : (
                <>
                  <span>Klaim Barang Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label={copied ? 'Tautan item telah disalin ke clipboard' : 'Bagikan info tautan item'}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#44574B] flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span role="status" aria-live="polite">
                  {copied ? 'Tautan Disalin!' : 'Bagikan Info'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#14261B] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
