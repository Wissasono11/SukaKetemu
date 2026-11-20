import React, { useState } from 'react'
import {
  Camera,
  EyeOff,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  Image as ImageIcon,
  Scan,
} from 'lucide-react'

interface WizardStep1Props {
  isFound: boolean
  photoUrl: string
  onPhotoChange: (url: string) => void
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

  const handleSimulateNewPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=600&auto=format&fit=crop',
    ]
    const next = samplePhotos[(samplePhotos.indexOf(photoUrl) + 1) % samplePhotos.length]
    onPhotoChange(next)
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

      {/* Area Foto */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.03)]">
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
              {isPrivacyBlur && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center text-white">
                  <EyeOff className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Privasi Dilindungi (UU PDP)</span>
                  <span className="text-[10px] text-white/90">Wajah/nomor disamarkan otomatis</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <button
                type="button"
                onClick={handleSimulateNewPhoto}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14261B] text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#155E38]" />
                Ambil Foto
              </button>

              <label className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-semibold text-[#44574B] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C59B27]" />
                  Blur Privasi
                </span>
                <input
                  type="checkbox"
                  checked={isPrivacyBlur}
                  onChange={(e) => onPrivacyBlurToggle(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#155E38] accent-[#155E38]"
                />
              </label>
            </div>
          </div>
        ) : (
          <div>
            {hasRefPhoto ? (
              <div className="relative w-full h-36 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                <img src={photoUrl} alt="Foto referensi" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onHasRefPhotoChange(false)}
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-[#B3261E] text-[10px] font-bold shadow-xs hover:bg-white"
                >
                  Hapus Foto
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onPhotoChange('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop')
                  onHasRefPhotoChange(true)
                }}
                className="w-full h-24 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-[#44574B] hover:border-[#155E38] transition-colors"
              >
                <ImageIcon className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium">Unggah Foto Galeri (Jika Ada)</span>
              </button>
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
