import React, { useState, useEffect } from 'react'
import {
  X,
  ScanSearch,
  CheckCircle2,
  FileCheck,
  Radar,
  RefreshCw,
} from 'lucide-react'
import type { AiMatchItem } from '../../types/lostFound'
import { INITIAL_AI_MATCHES } from '../../data/mockItems'
import { AiMatchHeroCard } from './aimatch/AiMatchHeroCard'
import { AiMatchAlternativeItem } from './aimatch/AiMatchAlternativeItem'
import { AiMatchSkeleton } from './aimatch/AiMatchSkeleton'

interface AiMatchModalProps {
  isOpen: boolean
  onClose: () => void
  onClaimSuccess?: (posName: string) => void
}

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  isOpen,
  onClose,
  onClaimSuccess,
}) => {
  const [matches, setMatches] = useState<AiMatchItem[]>(INITIAL_AI_MATCHES)
  const [heroItemId, setHeroItemId] = useState<string>(
    INITIAL_AI_MATCHES[0]?.id || ''
  )
  const [claimedItem, setClaimedItem] = useState<AiMatchItem | null>(null)
  const [isScanning, setIsScanning] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true)
      const timer = setTimeout(() => {
        setIsScanning(false)
      }, 750)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleRescan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 700)
  }

  const activeMatches = matches.filter((m) => m.status === 'unresolved')
  const currentHero =
    activeMatches.find((m) => m.id === heroItemId) || activeMatches[0] || null
  const alternativeMatches = activeMatches.filter(
    (m) => m.id !== currentHero?.id
  )

  const handleClaim = (item: AiMatchItem) => {
    setClaimedItem(item)
    setMatches((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: 'claimed' as const } : m))
    )
  }

  const handleReject = (id: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'rejected' as const } : m))
    )
    if (heroItemId === id && alternativeMatches.length > 0) {
      setHeroItemId(alternativeMatches[0].id)
    }
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E4F1E8] text-[#155E38] flex items-center justify-center">
              <ScanSearch className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#14261B]">Radar AI Match</h3>
              <p className="text-[11px] text-[#44574B]">Pencocokan multimodal inventaris FST</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isScanning}
              onClick={handleRescan}
              aria-label="Pindai Ulang Radar AI"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-[#155E38] transition-colors disabled:opacity-40"
              title="Pindai Ulang Radar AI"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#155E38]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Radar AI"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {claimedItem ? (
          /* State Sukses Klaim dari AI Match */
          <div className="p-5 rounded-2xl bg-[#E4F1E8] border border-[#155E38]/20 flex flex-col items-center text-center gap-3 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-[#155E38] text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#0F4A2C]">
                Klaim AI Berhasil Diterbitkan!
              </span>
              <p className="text-xs text-[#44574B] mt-1 leading-relaxed">
                Kecocokan 94% telah dikonfirmasi. Tiket pengambilan telah dibuat untuk <strong>{claimedItem.custodyPos}</strong>.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#155E38]/20 w-full flex items-center justify-between text-xs">
              <span className="text-[#44574B] font-medium">Tiket Baru:</span>
              <span className="font-mono font-bold text-[#155E38]">#CLM-FST-9902</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose()
                if (onClaimSuccess) onClaimSuccess(claimedItem.custodyPos)
              }}
              className="w-full py-3 rounded-xl bg-[#155E38] text-white text-xs font-bold hover:bg-[#0F4A2C] transition-all mt-1"
            >
              Lihat Tiket di "Cek Klaim"
            </button>
          </div>
        ) : (
          <>
            {/* Laporan Barang Hilang Aktif Anda */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="text-[#44574B] text-[11px] font-medium">
                Memindai temuan untuk:
              </span>
              <span className="font-bold text-[#14261B] text-[11px] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                TWS Soundcore R50i Hitam
              </span>
            </div>

            {isScanning ? (
              <AiMatchSkeleton />
            ) : currentHero ? (
              <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                {/* Kartu Utama Hero Match */}
                <AiMatchHeroCard
                  item={currentHero}
                  onClaim={handleClaim}
                  onReject={handleReject}
                />

                {/* Alternatif Kecocokan Lainnya */}
                {alternativeMatches.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
                    <span className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
                      <Radar className="w-3.5 h-3.5 text-[#155E38]" />
                      Potensi Kemiripan Lainnya ({alternativeMatches.length}):
                    </span>
                    <div className="flex flex-col gap-2">
                      {alternativeMatches.map((alt) => (
                        <AiMatchAlternativeItem
                          key={alt.id}
                          item={alt}
                          onSelect={(item) => setHeroItemId(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <FileCheck className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-[#14261B]">Semua Kemiripan Telah Ditinjau</p>
                <p className="text-[11px] text-[#44574B] mt-1 max-w-xs">
                  Radar AI terus memantau setiap ada barang temuan baru yang diserahkan ke Pos Satpam FST.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
