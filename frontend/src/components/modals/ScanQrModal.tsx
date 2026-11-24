import React, { useState, useEffect, useRef } from 'react'
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
  Loader2,
} from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import type { PosSatpamInfo } from '../../types/lostFound'
import { POS_SATPAM_LIST } from '../../data/mockItems'

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
  const [isCameraReady, setIsCameraReady] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop().catch(() => {})
      scannerRef.current.clear()
    }
    scannerRef.current = null
  }

  const selectPos = async (pos: PosSatpamInfo) => {
    await stopScanner()
    setScanProgress(true)
    setTimeout(() => {
      setScanProgress(false)
      setIsScanning(false)
      setScannedPos(pos)
    }, 400)
  }

  const parseQrText = (text: string) => {
    const q = text.toLowerCase()
    return POS_SATPAM_LIST.find(
      (p) => q.includes(p.id.toLowerCase()) || q.includes(p.code.toLowerCase()) || q.includes(p.name.toLowerCase())
    ) || POS_SATPAM_LIST[0]
  }

  useEffect(() => {
    let mounted = true
    if (!isOpen || !isScanning) {
      stopScanner()
      return
    }

    setIsCameraReady(false)
    const timer = setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('pos-qr-reader')
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 190, height: 190 } },
          (text) => mounted && selectPos(parseQrText(text)),
          () => {}
        )
        if (mounted) setIsCameraReady(true)
      } catch (err) {
        console.warn('Camera sensor fallback:', err)
        if (mounted) setIsCameraReady(false)
      }
    }, 300)

    return () => {
      mounted = false
      clearTimeout(timer)
      stopScanner()
    }
  }, [isOpen, isScanning])

  if (!isOpen) return null

  const toggleTorch = async () => {
    const next = !flashlightOn
    setFlashlightOn(next)
    try {
      // @ts-expect-error torch constraint
      await scannerRef.current?.applyVideoConstraints({ advanced: [{ torch: next }] })
    } catch {}
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto overscroll-contain p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E4F1E8] text-[#155E38] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#14261B]">Scan QR Pos Satpam</h3>
              <p className="text-[11px] text-[#44574B]">Verifikasi checkpoint resmi FST UIN</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isScanning && (
              <button
                type="button"
                onClick={toggleTorch}
                title="Lampu Senter"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  flashlightOn ? 'bg-[#FEF3C7] text-[#C59B27] ring-2 ring-[#C59B27]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
          <div className="flex flex-col gap-4">
            {/* Viewfinder Box */}
            <div className="relative w-full aspect-square max-h-64 rounded-2xl bg-black overflow-hidden flex flex-col items-center justify-center border border-black shadow-inner">
              <div
                id="pos-qr-reader"
                className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_#qr-shaded-region]:!hidden"
              />

              {!isCameraReady && (
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center gap-2 text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                    <Camera className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-300">Menghubungkan Sensor Kamera PWA...</span>
                  <span className="text-[10px] text-neutral-400">(Arahkan kamera ke stiker QR pos)</span>
                </div>
              )}

              {/* Dimmed Scrim with Clear Target Cutout (Apple/Lens style) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="relative w-48 h-48 rounded-2xl border border-white/20 transition-all"
                  style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)' }}
                >
                  {/* 4 Minimal Corner Guides */}
                  <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-[2.5px] border-l-[2.5px] border-white rounded-tl-xl" />
                  <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-[2.5px] border-r-[2.5px] border-white rounded-tr-xl" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-[2.5px] border-l-[2.5px] border-white rounded-bl-xl" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-[2.5px] border-r-[2.5px] border-white rounded-br-xl" />

                  {/* Scan Progress Feedback */}
                  {scanProgress && (
                    <div className="absolute inset-0 rounded-2xl bg-[#155E38]/20 border-2 border-[#155E38] animate-pulse" />
                  )}
                </div>
              </div>

              {flashlightOn && <div className="absolute inset-0 bg-amber-400/10 pointer-events-none" />}

              {/* Status Pill */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center z-10 pointer-events-none px-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white/95 text-[11px] font-medium border border-white/10 shadow-sm">
                  {scanProgress ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-[#4ADE80]" />
                      <span>Memverifikasi QR Checkpoint...</span>
                    </>
                  ) : (
                    <span>Posisikan stiker QR di dalam bingkai</span>
                  )}
                </span>
              </div>
            </div>

            {/* Simulation List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#14261B]">Uji Coba Checkpoint (Simulasi Scan):</span>
              <div className="grid grid-cols-1 gap-2">
                {POS_SATPAM_LIST.map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => selectPos(pos)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#E4F1E8] hover:border-[#155E38]/40 transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#155E38] shadow-2xs group-hover:bg-[#155E38] group-hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#14261B] group-hover:text-[#0F4A2C]">{pos.name}</span>
                        <span className="text-[10px] text-[#44574B]">{pos.location}</span>
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
          scannedPos && (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E4F1E8] border border-[#155E38]/20 text-[#0F4A2C]">
                <CheckCircle2 className="w-4 h-4 text-[#155E38] flex-shrink-0" />
                <span className="text-xs font-bold">QR Checkpoint Terverifikasi Resmi ({scannedPos.code})</span>
              </div>

              {/* Pos Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#155E38] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#14261B]">{scannedPos.name}</h4>
                    <p className="text-xs text-[#44574B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#155E38] flex-shrink-0" />
                      <span>{scannedPos.location}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-[#44574B]">
                  <div className="flex items-center gap-1.5 truncate">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate"><strong>Jaga:</strong> {scannedPos.officer}</span>
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onTitipBarang?.(scannedPos.name)
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
                >
                  <span>Serahkan Barang ke Pos Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onFilterByPos?.(scannedPos.name)
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#14261B] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PackageOpen className="w-3.5 h-3.5 text-[#155E38]" />
                    <span>Cek Barang di Pos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsScanning(true)
                      setScannedPos(null)
                      setScanProgress(false)
                    }}
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
