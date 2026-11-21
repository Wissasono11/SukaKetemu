import React, { useState, useEffect } from 'react'
import {
  X,
  Flashlight,
  ShieldCheck,
  MapPin,
  Clock,
  UserCheck,
  PackageOpen,
  ArrowRight,
  RefreshCw,
  Camera,
  CheckCircle2,
} from 'lucide-react'

export interface PosSatpamInfo {
  id: string
  name: string
  code: string
  location: string
  officer: string
  shift: string
  storedItemsCount: number
  operatingHours: string
}

export const POS_SATPAM_LIST: PosSatpamInfo[] = [
  {
    id: 'pos-fst-lobby',
    name: 'Pos Satpam Utama Lobby FST',
    code: 'QR-FST-01',
    location: 'Lantai 1, Lobby Fakultas Sains & Teknologi',
    officer: 'Bpk. Agus Santoso',
    shift: 'Shift Pagi (07.00 - 15.00 WIB)',
    storedItemsCount: 6,
    operatingHours: '07.00 - 21.00 WIB',
  },
  {
    id: 'pos-gerbang-barat',
    name: 'Pos Satpam Gerbang Barat',
    code: 'QR-FST-02',
    location: 'Gerbang Masuk Barat UIN Sunan Kalijaga',
    officer: 'Bpk. Bambang Triyono',
    shift: 'Shift Siang (14.00 - 22.00 WIB)',
    storedItemsCount: 2,
    operatingHours: '24 Jam Operasional',
  },
  {
    id: 'pos-lab-terpadu',
    name: 'Pos Satpam Gedung Lab Terpadu',
    code: 'QR-FST-03',
    location: 'Selasar Barat Lab Sains & Komputer',
    officer: 'Bpk. Hendra Saputra',
    shift: 'Shift Pagi (07.00 - 15.00 WIB)',
    storedItemsCount: 4,
    operatingHours: '07.30 - 18.00 WIB',
  },
]

interface ScanQrModalProps {
  isOpen: boolean
  onClose: () => void
  onTitipBarang?: (posName: string) => void
  onFilterByPos?: (posName: string) => void
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({
  isOpen,
  onClose,
  onTitipBarang,
  onFilterByPos,
}) => {
  const [isScanning, setIsScanning] = useState(true)
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [scannedPos, setScannedPos] = useState<PosSatpamInfo | null>(null)
  const [scanProgress, setScanProgress] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true)
      setScannedPos(null)
      setScanProgress(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSimulateScan = (pos: PosSatpamInfo) => {
    setScanProgress(true)
    setTimeout(() => {
      setScanProgress(false)
      setIsScanning(false)
      setScannedPos(pos)
    }, 600)
  }

  const handleResetScan = () => {
    setIsScanning(true)
    setScannedPos(null)
    setScanProgress(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 text-left">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E4F1E8] text-[#155E38] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#14261B]">Scan QR Pos Satpam</h3>
              <p className="text-[11px] text-[#44574B]">Verifikasi checkpoint resmi FST UIN</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isScanning && (
              <button
                type="button"
                onClick={() => setFlashlightOn(!flashlightOn)}
                title="Nyalakan Lampu Senter"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  flashlightOn
                    ? 'bg-[#FEF3C7] text-[#C59B27] ring-2 ring-[#C59B27]'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Flashlight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Scanner"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isScanning ? (
          /* Mode Kamera Scanner */
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square max-h-64 rounded-2xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-inner">
              {/* Animasi Kamera & Sudut Viewfinder */}
              <div className="absolute inset-8 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-3 border-l-3 border-[#1B7A43] rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-3 border-r-3 border-[#1B7A43] rounded-tr-lg" />
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-3 border-l-3 border-[#1B7A43] rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-3 border-r-3 border-[#1B7A43] rounded-br-lg" />
                </div>
              </div>

              {/* Garis Laser Animasi Scan */}
              <div
                className={`absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_12px_#22C55E] ${
                  scanProgress ? 'top-1/2 scale-110' : 'animate-pulse top-1/3'
                }`}
              />

              {flashlightOn && (
                <div className="absolute inset-0 bg-[#FFDF98]/15 pointer-events-none" />
              )}

              <p className="relative z-10 text-xs font-semibold text-white/90 text-center px-6 drop-shadow-sm">
                {scanProgress
                  ? 'Memverifikasi QR Code Kampus...'
                  : 'Arahkan kamera ke QR Code resmi di Pos Satpam'}
              </p>
            </div>

            {/* Simulasi Pilih Pos Satpam */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#14261B]">
                Uji Coba Checkpoint (Simulasi Scan):
              </span>
              <div className="grid grid-cols-1 gap-2">
                {POS_SATPAM_LIST.map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => handleSimulateScan(pos)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#E4F1E8] hover:border-[#155E38]/40 transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#155E38] shadow-2xs group-hover:bg-[#155E38] group-hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#14261B] group-hover:text-[#0F4A2C]">
                          {pos.name}
                        </span>
                        <span className="text-[10px] text-[#44574B]">
                          {pos.location}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#155E38] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      Scan
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Mode Hasil Scan Berhasil */
          scannedPos && (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Badge Terverifikasi */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E4F1E8] border border-[#155E38]/20 text-[#0F4A2C]">
                <CheckCircle2 className="w-4 h-4 text-[#155E38] flex-shrink-0" />
                <span className="text-xs font-bold">
                  QR Checkpoint Terverifikasi Resmi ({scannedPos.code})
                </span>
              </div>

              {/* Kartu Detail Pos Satpam */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#155E38] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-[#14261B]">
                      {scannedPos.name}
                    </h4>
                    <p className="text-xs text-[#44574B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" />
                      <span>{scannedPos.location}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-[#44574B]">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">
                      <strong>Jaga:</strong> {scannedPos.officer}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{scannedPos.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 text-xs">
                  <span className="text-[#44574B] flex items-center gap-1.5">
                    <PackageOpen className="w-4 h-4 text-[#C59B27]" />
                    Barang Tersimpan di Pos:
                  </span>
                  <span className="font-bold text-[#0F4A2C] bg-[#E4F1E8] px-2 py-0.5 rounded-full">
                    {scannedPos.storedItemsCount} Barang Aktif
                  </span>
                </div>
              </div>

              {/* Tombol Aksi Langsung */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onTitipBarang) onTitipBarang(scannedPos.name)
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
                >
                  <span>Titipkan Barang Temuan di Pos Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      if (onFilterByPos) onFilterByPos(scannedPos.name)
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#14261B] transition-colors"
                  >
                    Lihat Barang di Pos Ini
                  </button>

                  <button
                    type="button"
                    onClick={handleResetScan}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#44574B] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan Ulang</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
