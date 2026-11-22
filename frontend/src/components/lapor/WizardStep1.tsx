import React, { useState, useRef } from 'react'
import {
  Camera,
  EyeOff,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  Image as ImageIcon,
  Scan,
  Loader2,
  CheckCircle2,
  Upload,
} from 'lucide-react'
import { compressReportImage, formatBytes } from '../../utils/imageCompression'

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
  onNext: () => void
}

export const WizardStep1: React.FC<WizardStep1Props> = ({
  isFound,
  photoUrl,
  onPhotoChange,
  photoFile: _photoFile,
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
  onNext,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false)
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
    } catch (err) {
      console.error('Kompresi gagal, menggunakan file asli:', err)
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
    if (file) {
      handleProcessFile(file)
    }
    e.target.value = ''
  }

  const handleSimulateNewPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=600&auto=format&fit=crop',
    ]
    const next = samplePhotos[(samplePhotos.indexOf(photoUrl) + 1) % samplePhotos.length]
    onPhotoChange(next)
    onPhotoFileChange?.(null)
    setCompressionInfo(null)
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

      {/* Hidden File Inputs for Real Camera & Gallery */}
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

      {/* Area Foto */}
      <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
            {isFound ? <Camera className="w-4 h-4 text-[#155E38]" /> : <ImageIcon className="w-4 h-4 text-[#155E38]" />}
            {isFound ? 'Foto Barang Temuan' : 'Foto Referensi Barang'}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isFound ? 'bg-[#E4F1E8] text-[#0F4A2C]' : 'bg-slate-100 text-slate-500'}`}>
            {isFound ? 'Wajib' : 'Opsional'}
          </span>
        </div>

        {isFound ? (
          <div className="flex flex-col gap-2">
            <div className="relative w-full h-48 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
              <img
                src={photoUrl}
                alt="Foto barang"
                className={`w-full h-full object-cover transition-all ${isPrivacyBlur ? 'blur-md scale-105' : ''}`}
              />

              {/* Overlay Sedang Mengompresi */}
              {isCompressing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white z-20 animate-in fade-in duration-150">
                  <Loader2 className="w-8 h-8 animate-spin text-[#22C55E] mb-2" />
                  <span className="text-xs font-bold">Mengompresi Foto...</span>
                  <span className="text-[10px] text-white/80 mt-0.5">
                    WebWorker aktif &bull; Menjaga berkas &le; 1,5 MB (Vercel)
                  </span>
                </div>
              )}

              {/* Overlay Privasi UU PDP */}
              {!isCompressing && isPrivacyBlur && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center text-white">
                  <EyeOff className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Privasi Dilindungi (UU PDP)</span>
                  <span className="text-[10px] text-white/90">Wajah/nomor disamarkan otomatis</span>
                </div>
              )}
            </div>

            {/* Statistik Kompresi (Jika ada berkas yang diunggah) */}
            {compressionInfo && (
              <div className="p-2 rounded-xl bg-[#E4F1E8]/60 border border-[#155E38]/20 flex items-center justify-between text-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 text-[#0F4A2C]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" />
                  <span className="text-[11px] font-semibold">
                    Ukuran: <strong>{compressionInfo.original}</strong> &rarr; <strong>{compressionInfo.compressed}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#155E38] bg-white px-2 py-0.5 rounded-md border border-[#155E38]/20">
                  Hemat {compressionInfo.percent}%
                </span>
              </div>
            )}

            {/* Tombol Aksi Kamera & Galeri */}
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPrivacyBlur}
                  onChange={(e) => onPrivacyBlurToggle(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#155E38] accent-[#155E38]"
                />
                <span className="text-xs font-semibold text-[#44574B] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C59B27]" />
                  Blur Privasi Wajah/Data
                </span>
              </label>

              <button
                type="button"
                onClick={handleSimulateNewPhoto}
                className="text-[10px] text-slate-400 hover:text-[#155E38] underline"
              >
                Gunakan Contoh Demo
              </button>
            </div>
          </div>
        ) : (
          <div>
            {hasRefPhoto ? (
              <div className="flex flex-col gap-2">
                <div className="relative w-full h-36 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                  <img src={photoUrl} alt="Foto referensi" className="w-full h-full object-cover" />

                  {isCompressing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white z-20">
                      <Loader2 className="w-6 h-6 animate-spin text-[#22C55E] mb-1" />
                      <span className="text-xs font-bold">Mengompresi Foto...</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onHasRefPhotoChange(false)
                      onPhotoFileChange?.(null)
                      setCompressionInfo(null)
                    }}
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-[#B3261E] text-[10px] font-bold shadow-xs hover:bg-white"
                  >
                    Hapus Foto
                  </button>
                </div>

                {compressionInfo && (
                  <div className="p-2 rounded-xl bg-[#E4F1E8]/60 border border-[#155E38]/20 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#0F4A2C] font-semibold">
                      Terkompresi: <strong>{compressionInfo.compressed}</strong> (&le; 1.5 MB)
                    </span>
                    <span className="text-[10px] font-bold text-[#155E38]">
                      Hemat {compressionInfo.percent}%
                    </span>
                  </div>
                )}
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
                  onClick={() => {
                    onPhotoChange('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop')
                    onHasRefPhotoChange(true)
                  }}
                  className="text-[10px] text-center text-slate-400 hover:text-[#155E38] underline py-0.5"
                >
                  Atau gunakan foto sampel demo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Titik Lokasi Kampus */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#155E38]" />
            {isFound ? 'Lokasi Ditemukan' : 'Area Rute Terakhir'}
          </span>
          {isFound && (
            <button
              type="button"
              onClick={() => {
                onGedungChange('FST (Saintek)')
                onLantaiChange('Lantai 2')
                onRuanganChange('Lab Terpadu 204')
              }}
              className="text-[11px] font-bold text-[#155E38] flex items-center gap-1 hover:underline"
            >
              <Scan className="w-3.5 h-3.5" />
              Scan QR Checkpoint
            </button>
          )}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#1B7A43] uppercase tracking-wider">
              Titik Kampus
            </span>
            <span className="text-xs font-bold text-[#14261B] mt-0.5">
              Gedung {gedung} — {lantai}, {ruangan}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#155E38] hover:bg-slate-50"
          >
            Ubah
          </button>
        </div>

        {showLocationPicker && (
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-1">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-[#44574B] mb-1">Gedung</label>
              <select
                value={gedung}
                onChange={(e) => onGedungChange(e.target.value)}
                className="bg-white text-xs font-semibold rounded-lg p-1.5 border border-slate-200"
              >
                <option value="FST (Saintek)">FST</option>
                <option value="FISHUM">FISHUM</option>
                <option value="FEBI">FEBI</option>
                <option value="FITK">FITK</option>
                <option value="Perpustakaan">Perpus</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-[#44574B] mb-1">Lantai</label>
              <select
                value={lantai}
                onChange={(e) => onLantaiChange(e.target.value)}
                className="bg-white text-xs font-semibold rounded-lg p-1.5 border border-slate-200"
              >
                <option value="Lantai 1">Lt. 1</option>
                <option value="Lantai 2">Lt. 2</option>
                <option value="Lantai 3">Lt. 3</option>
                <option value="Lantai 4">Lt. 4</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-[#44574B] mb-1">Ruangan</label>
              <select
                value={ruangan}
                onChange={(e) => onRuanganChange(e.target.value)}
                className="bg-white text-xs font-semibold rounded-lg p-1.5 border border-slate-200"
              >
                <option value="Lab Terpadu 204">Lab 204</option>
                <option value="R. Kuliah 201">R. 201</option>
                <option value="Selasar Barat">Selasar</option>
                <option value="Pos Satpam FST">Pos Satpam</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full mt-2 py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-all"
      >
        <span>Lanjut ke Kategori &amp; Detail</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
