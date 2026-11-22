import React, { useState, useRef } from 'react'
import {
  Camera,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Upload,
} from 'lucide-react'
import { compressReportImage, formatBytes } from '../../utils/imageCompression'

interface PhotoUploadBoxProps {
  isFound: boolean
  photoUrl: string
  onPhotoChange: (url: string) => void
  onPhotoFileChange?: (file: File | null) => void
  hasRefPhoto: boolean
  onHasRefPhotoChange: (has: boolean) => void
  isPrivacyBlur: boolean
  onPrivacyBlurToggle: (blur: boolean) => void
}

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=600&auto=format&fit=crop',
]

export const PhotoUploadBox: React.FC<PhotoUploadBoxProps> = ({
  isFound,
  photoUrl,
  onPhotoChange,
  onPhotoFileChange,
  hasRefPhoto,
  onHasRefPhotoChange,
  isPrivacyBlur,
  onPrivacyBlurToggle,
}) => {
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<{
    original: string
    compressed: string
    percent: number
  } | null>(null)

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleProcessFile = async (file: File) => {
    try {
      setIsCompressing(true)
      const result = await compressReportImage(file)
      onPhotoChange(result.previewUrl)
      onPhotoFileChange?.(result.file)
      if (!isFound) onHasRefPhotoChange(true)

      const savedPercent = Math.round(
        ((result.originalSize - result.compressedSize) / result.originalSize) * 100
      )
      setCompressionInfo({
        original: formatBytes(result.originalSize),
        compressed: formatBytes(result.compressedSize),
        percent: Math.max(0, savedPercent),
      })
    } catch {
      const fallbackUrl = URL.createObjectURL(file)
      onPhotoChange(fallbackUrl)
      onPhotoFileChange?.(file)
      if (!isFound) onHasRefPhotoChange(true)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleProcessFile(file)
    e.target.value = ''
  }

  const handleSamplePhoto = () => {
    const nextIdx = (SAMPLE_PHOTOS.indexOf(photoUrl) + 1) % SAMPLE_PHOTOS.length
    onPhotoChange(SAMPLE_PHOTOS[nextIdx >= 0 ? nextIdx : 0])
    onPhotoFileChange?.(null)
    setCompressionInfo(null)
    if (!isFound) onHasRefPhotoChange(true)
  }

  const handleRemovePhoto = () => {
    onHasRefPhotoChange(false)
    onPhotoFileChange?.(null)
    setCompressionInfo(null)
  }

  const hasPhotoDisplay = isFound || hasRefPhoto

  return (
    <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
          {isFound ? <Camera className="w-4 h-4 text-[#155E38]" /> : <ImageIcon className="w-4 h-4 text-[#155E38]" />}
          {isFound ? 'Foto Barang Temuan' : 'Foto Referensi Barang'}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isFound ? 'bg-[#E4F1E8] text-[#0F4A2C]' : 'bg-slate-100 text-slate-500'}`}>
          {isFound ? 'Wajib' : 'Opsional'}
        </span>
      </div>

      {hasPhotoDisplay ? (
        <div className="flex flex-col gap-2">
          <div className={`relative w-full ${isFound ? 'h-48' : 'h-40'} rounded-2xl bg-slate-100 overflow-hidden border border-slate-200`}>
            <img
              src={photoUrl}
              alt="Foto barang"
              className={`w-full h-full object-cover transition-all ${isFound && isPrivacyBlur ? 'blur-md scale-105' : ''}`}
            />

            {/* Compressing Spinner Overlay */}
            {isCompressing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white z-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-2" />
                <span className="text-xs font-bold">Mengompresi Foto...</span>
                <span className="text-[10px] text-white/80 mt-0.5">WebWorker aktif &bull; Maks 1,5 MB</span>
              </div>
            )}

            {/* Privacy Overlay (Found only) */}
            {!isCompressing && isFound && isPrivacyBlur && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1.5 border border-white/20">
                  <EyeOff className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold leading-tight">Data Pribadi Disamarkan</span>
                <span className="text-[10px] text-white/90 mt-0.5">Sesuai UU PDP No. 27/2022</span>
              </div>
            )}

            {/* Delete Button for Optional Lost Photo */}
            {!isFound && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-[#B3261E] text-[10px] font-bold shadow-xs hover:bg-white"
              >
                Hapus Foto
              </button>
            )}
          </div>

          {/* Compression Stats Badge */}
          {compressionInfo && (
            <div className="p-2 rounded-xl bg-[#E4F1E8]/60 border border-[#155E38]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#0F4A2C]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" />
                <span className="text-[11px] font-semibold">
                  {compressionInfo.original} &rarr; <strong>{compressionInfo.compressed}</strong>
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#155E38] bg-white px-2 py-0.5 rounded-md border border-[#155E38]/20">
                Hemat {compressionInfo.percent}%
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isCompressing}
              className="py-2.5 px-3 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-2xs disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Buka Kamera</span>
            </button>

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={isCompressing}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14261B] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Pilih Galeri</span>
            </button>
          </div>

          {/* Privacy Checkbox & Sample Link */}
          <div className="flex items-center justify-between pt-1">
            {isFound ? (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPrivacyBlur}
                  onChange={(e) => onPrivacyBlurToggle(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#155E38] accent-[#155E38]"
                />
                <span className="text-xs font-semibold text-[#44574B] flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-[#155E38]" />
                  Samarkan Wajah &amp; Data Pribadi
                </span>
              </label>
            ) : (
              <span className="text-[10px] text-slate-400">Format: JPEG/PNG &le; 1,5 MB</span>
            )}

            <button
              type="button"
              onClick={handleSamplePhoto}
              className="text-[10px] text-slate-400 hover:text-[#155E38] underline"
            >
              Gunakan Contoh Demo
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="h-20 rounded-2xl border border-dashed border-slate-200 hover:border-[#155E38] bg-slate-50 flex flex-col items-center justify-center gap-1 text-[#44574B] transition-colors"
            >
              <Camera className="w-4 h-4 text-[#155E38]" />
              <span className="text-xs font-medium">Buka Kamera</span>
            </button>

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="h-20 rounded-2xl border border-dashed border-slate-200 hover:border-[#155E38] bg-slate-50 flex flex-col items-center justify-center gap-1 text-[#44574B] transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium">Pilih Galeri</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSamplePhoto}
            className="text-[10px] text-center text-slate-400 hover:text-[#155E38] underline py-0.5"
          >
            Atau gunakan foto sampel demo
          </button>
        </div>
      )}
    </div>
  )
}
