import React, { useState, useEffect, useCallback, useRef } from 'react'
import { RefreshCw, FileCheck, Clock, Plus, AlertTriangle } from 'lucide-react'
import type { AiMatchItem, UserReportItem } from '../types/lostFound'
import { getMyReports } from '../services/userDataService'
import { AiMatchHeroCard } from '../components/modals/aimatch/AiMatchHeroCard'
import { AiMatchAlternativeItem } from '../components/modals/aimatch/AiMatchAlternativeItem'
import { AiMatchSkeleton } from '../components/modals/aimatch/AiMatchSkeleton'

interface CocokAiPageProps {
  matches: AiMatchItem[]
  onRejectMatch: (matchId: string) => void
  onRequestClaim: (match: AiMatchItem) => void
  onNavigateToLapor?: (type: 'lost' | 'found') => void
  onBrowseBeranda?: () => void
}

export const CocokAiPage: React.FC<CocokAiPageProps> = ({
  matches,
  onRejectMatch,
  onRequestClaim,
  onNavigateToLapor,
  onBrowseBeranda,
}) => {
  const [lostReports, setLostReports] = useState<UserReportItem[]>([])
  const [selectedReportId, setSelectedReportId] = useState<string>('')
  const [heroByReport, setHeroByReport] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSwitchingReport, setIsSwitchingReport] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const switchTimerRef = useRef<number | null>(null)

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
      if (switchTimerRef.current) {
        clearTimeout(switchTimerRef.current)
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

  const handleSelectReport = (reportId: string) => {
    if (reportId === selectedReportId) return
    setSelectedReportId(reportId)
    setIsSwitchingReport(true)
    if (switchTimerRef.current) {
      clearTimeout(switchTimerRef.current)
    }
    switchTimerRef.current = window.setTimeout(() => {
      setIsSwitchingReport(false)
      switchTimerRef.current = null
    }, 180)
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
  const alternativeMatches = reportMatches.filter((m) => m.id !== currentHero?.id)

  const handleSelectHero = (match: AiMatchItem) => {
    if (!selectedReport) return
    setHeroByReport((prev) => ({ ...prev, [selectedReport.id]: match.id }))
  }

  return (
    <main className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-4 text-left">
      {/* Header Ringkas Radar AI */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <h2 className="text-base font-extrabold text-[#14261B]">
            Radar Kecocokan
          </h2>
          <p className="text-xs text-[#44574B] mt-0.5">
            5 kandidat temuan paling sesuai untuk laporan hilang Anda
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading || isRefreshing}
          onClick={handleRefresh}
          className="min-h-[44px] px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#14261B] inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
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

      {/* Pemilih Laporan Hilang Aktif (Underline Tabs) */}
      {!isLoading && !loadError && lostReports.length > 0 && (
        <div
          role="tablist"
          aria-label="Laporan Barang Hilang Aktif"
          className="flex items-center gap-5 border-b border-slate-200 overflow-x-auto no-scrollbar"
        >
          {lostReports.map((rep) => {
            const isSelected = selectedReport?.id === rep.id
            const unresolvedCount = matches.filter(
              (m) => m.lostReportId === rep.id && m.status === 'unresolved'
            ).length
            const isPending = rep.aiStatus === 'PENDING_VECTOR'

            return (
              <button
                key={rep.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectReport(rep.id)}
                className={`relative min-h-[44px] pb-2.5 text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] rounded-t-md ${
                  isSelected
                    ? 'font-bold text-[#155E38]'
                    : 'font-medium text-[#44574B] hover:text-[#14261B]'
                }`}
              >
                <span className="max-w-[165px] truncate">{rep.title}</span>
                <span className="text-[11px] font-semibold text-[#44574B] tabular-nums">
                  {isPending ? '(Proses)' : `(${unresolvedCount})`}
                </span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#155E38]"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Konten Utama */}
      {isLoading || isRefreshing || isSwitchingReport ? (
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
        <div className="flex flex-col gap-4">
          <AiMatchHeroCard
            item={currentHero}
            onClaim={onRequestClaim}
            onReject={onRejectMatch}
          />

          {alternativeMatches.length > 0 && (
            <section aria-label="Kandidat Lainnya" className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between px-0.5">
                <h3 className="text-xs font-bold text-[#14261B]">
                  Kandidat Lainnya ({alternativeMatches.length})
                </h3>
                <span className="text-[11px] text-[#44574B]">
                  Pilih baris untuk meninjau
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-200 overflow-hidden">
                {alternativeMatches.map((alt) => (
                  <AiMatchAlternativeItem
                    key={alt.id}
                    item={alt}
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
    </main>
  )
}

export default CocokAiPage
