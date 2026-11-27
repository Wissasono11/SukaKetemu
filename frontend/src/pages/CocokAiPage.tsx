import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  RefreshCw,
  FileCheck,
  Clock,
  Plus,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import type { AiMatchItem, UserReportItem } from '../types/lostFound'
import { getMyReports } from '../services/userDataService'
import { AiMatchHeroCard } from '../components/cocok-ai/AiMatchHeroCard'
import { AiMatchAlternativeItem } from '../components/cocok-ai/AiMatchAlternativeItem'
import { AiMatchSkeleton } from '../components/cocok-ai/AiMatchSkeleton'

interface CocokAiPageProps {
  matches: AiMatchItem[]
  onRejectMatch: (matchId: string) => void
  onUndoRejectMatch?: (matchId: string) => void
  onRequestClaim: (match: AiMatchItem) => void
  onNavigateToLapor?: (type: 'lost' | 'found') => void
  onBrowseBeranda?: () => void
}

export const CocokAiPage: React.FC<CocokAiPageProps> = ({
  matches,
  onRejectMatch,
  onUndoRejectMatch,
  onRequestClaim,
  onNavigateToLapor,
  onBrowseBeranda,
}) => {
  const [lostReports, setLostReports] = useState<UserReportItem[]>([])
  const [selectedReportId, setSelectedReportId] = useState<string>('')
  const [heroByReport, setHeroByReport] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [undoMatch, setUndoMatch] = useState<AiMatchItem | null>(null)
  const undoTimerRef = useRef<number | null>(null)
  const heroSectionRef = useRef<HTMLDivElement | null>(null)

  const applyLoadedReports = useCallback((activeLost: UserReportItem[]) => {
    setLostReports(activeLost)
    if (activeLost.length > 0) {
      setSelectedReportId((prev) =>
        prev && activeLost.some((r) => r.id === prev) ? prev : activeLost[0].id
      )
    } else {
      setSelectedReportId('')
    }
  }, [])

  useEffect(() => {
    let active = true
    const minSkeletonDelay = new Promise<void>((resolve) =>
      window.setTimeout(resolve, 250)
    )

    Promise.all([getMyReports(), minSkeletonDelay])
      .then(([reports]) => {
        if (!active) return
        const activeLost = reports.filter(
          (r) => r.type === 'lost' && r.status !== 'selesai'
        )
        applyLoadedReports(activeLost)
        setLoadError(null)
      })
      .catch(() => {
        if (active) {
          setLoadError('Gagal memuat laporan kehilangan dari penyimpanan perangkat.')
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current)
      }
    }
  }, [applyLoadedReports])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLoadError(null)
    try {
      const [reports] = await Promise.all([
        getMyReports(),
        new Promise<void>((resolve) => window.setTimeout(resolve, 300)),
      ])
      const activeLost = reports.filter(
        (r) => r.type === 'lost' && r.status !== 'selesai'
      )
      applyLoadedReports(activeLost)
    } catch {
      setLoadError('Gagal memuat ulang laporan kehilangan. Coba beberapa saat lagi.')
    } finally {
      setIsRefreshing(false)
    }
  }

  const selectedReport =
    lostReports.find((r) => r.id === selectedReportId) || lostReports[0] || null

  const reportMatches = selectedReport
    ? matches
        .filter(
          (m) => m.lostReportId === selectedReport.id && m.status === 'unresolved'
        )
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5)
    : []

  const preferredHeroId = selectedReport ? heroByReport[selectedReport.id] : undefined
  const currentHero =
    reportMatches.find((m) => m.id === preferredHeroId) || reportMatches[0] || null

  const handleSelectHero = (match: AiMatchItem) => {
    if (!selectedReport) return
    setHeroByReport((prev) => ({ ...prev, [selectedReport.id]: match.id }))
    heroSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleRejectWithUndo = (matchId: string) => {
    const rejectedItem = reportMatches.find((m) => m.id === matchId) ?? null
    if (selectedReport && heroByReport[selectedReport.id] === matchId) {
      const nextFallback = reportMatches.find((m) => m.id !== matchId)
      setHeroByReport((prev) => ({
        ...prev,
        [selectedReport.id]: nextFallback ? nextFallback.id : '',
      }))
    }

    onRejectMatch(matchId)

    if (rejectedItem && onUndoRejectMatch) {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current)
      }
      setUndoMatch(rejectedItem)
      undoTimerRef.current = window.setTimeout(() => {
        setUndoMatch(null)
        undoTimerRef.current = null
      }, 5000)
    }
  }

  const handleUndoReject = () => {
    if (!undoMatch || !onUndoRejectMatch) return
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current)
      undoTimerRef.current = null
    }
    onUndoRejectMatch(undoMatch.id)
    setHeroByReport((prev) => ({
      ...prev,
      [undoMatch.lostReportId]: undoMatch.id,
    }))
    setSelectedReportId(undoMatch.lostReportId)
    setUndoMatch(null)
  }

  const headerSubtitle = isLoading
    ? 'Mencari kecocokan dari daftar temuan kampus...'
    : selectedReport?.aiStatus === 'PENDING_VECTOR'
      ? 'Laporan sedang dicocokkan dengan inventaris temuan'
      : reportMatches.length > 0
        ? `Menampilkan ${reportMatches.length} kandidat kecocokan teratas`
        : 'Mencocokkan laporan hilang Anda dengan temuan kampus'

  return (
    <main className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-3.5 text-left">
      {/* Header Ringkas Radar AI */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <h2 className="text-base font-extrabold text-[#14261B]">
            Radar Kecocokan
          </h2>
          <p className="text-xs text-[#44574B] mt-0.5">{headerSubtitle}</p>
        </div>

        <button
          type="button"
          disabled={isLoading || isRefreshing}
          onClick={handleRefresh}
          className="min-h-[44px] px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#14261B] inline-flex items-center gap-1.5 flex-shrink-0 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#155E38] ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            aria-hidden="true"
          />
          <span>{isRefreshing ? 'Memuat...' : 'Muat Ulang'}</span>
        </button>
      </header>

      {/* Pemilih Laporan Hilang Aktif */}
      {!isLoading && !loadError && lostReports.length > 0 && (
        <div
          role="tablist"
          aria-label="Laporan Barang Hilang Aktif"
          className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar"
        >
          {lostReports.map((rep) => {
            const isSelected = selectedReport?.id === rep.id
            const unresolvedCount = matches.filter(
              (m) => m.lostReportId === rep.id && m.status === 'unresolved'
            ).length
            const isPending = rep.aiStatus === 'PENDING_VECTOR'

            const statusDotClass = isPending
              ? 'bg-[#D97706]'
              : unresolvedCount > 0
                ? 'bg-[#155E38]'
                : 'bg-slate-300'

            return (
              <button
                key={rep.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedReportId(rep.id)}
                className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs whitespace-nowrap transition-colors flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] ${
                  isSelected
                    ? 'border-[#155E38] bg-[#E4F1E8]/60 font-bold text-[#0F4A2C]'
                    : 'border-slate-200 bg-white font-medium text-[#44574B] hover:border-slate-300 hover:text-[#14261B]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotClass}`}
                />
                <span className="max-w-[160px] truncate">{rep.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums ${
                    isPending
                      ? 'bg-[#FEF3C7] text-[#92400E]'
                      : unresolvedCount > 0
                        ? 'bg-white text-[#155E38] border border-[#155E38]/20'
                        : 'bg-slate-100 text-[#44574B]'
                  }`}
                >
                  {isPending ? 'Proses' : unresolvedCount}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Konten Utama */}
      {isLoading || isRefreshing ? (
        <AiMatchSkeleton showTabs={isLoading} />
      ) : loadError ? (
        <section
          role="alert"
          className="p-5 rounded-xl bg-white border border-red-200 flex flex-col gap-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#B3261E] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-[#14261B]">
                Data Laporan Gagal Dimuat
              </h3>
              <p className="text-xs text-[#44574B] leading-relaxed">
                {loadError} Periksa penyimpanan browser Anda lalu muat ulang halaman.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2"
          >
            Coba Muat Ulang
          </button>
        </section>
      ) : !selectedReport ? (
        <section className="py-10 px-5 flex flex-col items-center justify-center text-center border border-slate-200 rounded-xl bg-white gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#14261B]">
              Belum Ada Laporan Hilang Aktif
            </h3>
            <p className="text-xs text-[#44574B] max-w-xs leading-relaxed">
              Radar Kecocokan mencocokkan laporan barang hilang Anda dengan temuan di Pos Satpam. Buat laporan hilang agar pencocokan berjalan otomatis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToLapor?.('lost')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Buat Laporan Hilang</span>
          </button>
        </section>
      ) : selectedReport.aiStatus === 'PENDING_VECTOR' ? (
        <section className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-[#14261B]">
                Laporan Sedang Dicocokkan
              </h3>
              <p className="text-xs text-[#44574B] leading-relaxed">
                Laporan <strong>{selectedReport.title}</strong> sudah tersimpan aman. Sistem sedang mencocokkan ciri barang dengan daftar temuan terbaru, silakan cek kembali sebentar lagi.
              </p>
            </div>
          </div>

          {onBrowseBeranda && (
            <button
              type="button"
              onClick={onBrowseBeranda}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14261B] text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
            >
              Jelajahi Katalog Temuan
            </button>
          )}
        </section>
      ) : currentHero ? (
        <div ref={heroSectionRef} className="scroll-mt-16 flex flex-col gap-4">
          <AiMatchHeroCard
            item={currentHero}
            onClaim={onRequestClaim}
            onReject={handleRejectWithUndo}
          />

          {reportMatches.length > 1 && (
            <section aria-label="Daftar Semua Kandidat" className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between px-0.5">
                <h3 className="text-xs font-bold text-[#14261B]">
                  Semua Kandidat ({reportMatches.length})
                </h3>
                <span className="text-[11px] text-[#44574B]">
                  Urut kecocokan tertinggi
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-200 overflow-hidden">
                {reportMatches.map((candidate) => (
                  <AiMatchAlternativeItem
                    key={candidate.id}
                    item={candidate}
                    isActive={candidate.id === currentHero.id}
                    onSelect={handleSelectHero}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <section className="py-10 px-5 flex flex-col items-center justify-center text-center border border-slate-200 rounded-xl bg-white gap-3">
          <FileCheck className="w-7 h-7 text-[#44574B]" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#14261B]">
              Belum Ada Kandidat Kecocokan Baru
            </h3>
            <p className="text-xs text-[#44574B] max-w-xs leading-relaxed">
              Semua kandidat untuk laporan ini sudah ditinjau. Sistem akan memperbarui daftar saat ada temuan baru di Pos Satpam.
            </p>
          </div>
          {onBrowseBeranda && (
            <button
              type="button"
              onClick={onBrowseBeranda}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#14261B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
            >
              Lihat Daftar Barang di Beranda
            </button>
          )}
        </section>
      )}

      {/* Toast Urungkan Penolakan */}
      {undoMatch && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[416px]"
        >
          <div className="rounded-xl bg-[#14261B] text-white px-3.5 py-2.5 shadow-lg flex items-center justify-between gap-3">
            <span className="text-xs leading-snug truncate">
              Kandidat #{undoMatch.rank} ditandai bukan milik Anda
            </span>
            <button
              type="button"
              onClick={handleUndoReject}
              className="min-h-[36px] px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white inline-flex items-center gap-1 flex-shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Urungkan</span>
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default CocokAiPage
