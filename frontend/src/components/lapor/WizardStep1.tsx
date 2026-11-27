import React, { useState } from 'react'
import { ArrowRight, Clock, AlertCircle } from 'lucide-react'
import { PhotoUploadBox } from './PhotoUploadBox'
import { LocationPickerBox } from './LocationPickerBox'

interface WizardStep1Props {
  isFound: boolean
  photoUrl: string
  onPhotoChange: (url: string) => void
  photoFile?: File | null
  onPhotoFileChange?: (file: File | null) => void
  hasRefPhoto: boolean
  onHasRefPhotoChange: (has: boolean) => void
  isPrivacyBlur: boolean
  onPrivacyBlurToggle: (blur: boolean) => void
  timeLost: string
  onTimeLostChange: (val: string) => void
  gedung: string
  onGedungChange: (val: string) => void
  lantai: string
  onLantaiChange: (val: string) => void
  ruangan: string
  onRuanganChange: (val: string) => void
  onQrCheckpointChange?: (code: string | undefined) => void
  onNext: () => void
}

export const WizardStep1: React.FC<WizardStep1Props> = ({
  isFound,
  photoUrl,
  onPhotoChange,
  onPhotoFileChange,
  hasRefPhoto,
  onHasRefPhotoChange,
  isPrivacyBlur,
  onPrivacyBlurToggle,
  timeLost,
  onTimeLostChange,
  gedung,
  onGedungChange,
  lantai,
  onLantaiChange,
  ruangan,
  onRuanganChange,
  onQrCheckpointChange,
  onNext,
}) => {
  const [stepError, setStepError] = useState<string | null>(null)

  const handleNextStep = () => {
    if (isFound && !photoUrl) {
      setStepError('Unggah atau pilih foto barang temuan terlebih dahulu.')
      return
    }
    setStepError(null)
    onNext()
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Khusus Hilang: Input Waktu */}
      {!isFound && (
        <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
          <label htmlFor="time-lost" className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#155E38]" />
            Perkiraan Waktu Terakhir Membawa Barang
          </label>
          <input
            id="time-lost"
            type="text"
            value={timeLost}
            onChange={(e) => onTimeLostChange(e.target.value)}
            placeholder="Contoh: Hari ini, ~14:15 WIB setelah kuliah"
            className="w-full bg-slate-50 text-[#14261B] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#155E38]/20 border border-slate-200"
          />
        </div>
      )}

      {/* Area Upload & Kompresi Foto */}
      <PhotoUploadBox
        isFound={isFound}
        photoUrl={photoUrl}
        onPhotoChange={(url) => {
          setStepError(null)
          onPhotoChange(url)
        }}
        onPhotoFileChange={onPhotoFileChange}
        hasRefPhoto={hasRefPhoto}
        onHasRefPhotoChange={onHasRefPhotoChange}
        isPrivacyBlur={isPrivacyBlur}
        onPrivacyBlurToggle={onPrivacyBlurToggle}
      />

      {/* Titik Lokasi Kampus */}
      <LocationPickerBox
        isFound={isFound}
        gedung={gedung}
        onGedungChange={onGedungChange}
        lantai={lantai}
        onLantaiChange={onLantaiChange}
        ruangan={ruangan}
        onRuanganChange={onRuanganChange}
        onQrCheckpointChange={onQrCheckpointChange}
      />

      {stepError && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-[#B3261E]"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>{stepError}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleNextStep}
        className="w-full mt-2 py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-all"
      >
        <span>Lanjut ke Kategori &amp; Detail</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
