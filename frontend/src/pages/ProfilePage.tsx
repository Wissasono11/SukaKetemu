import React, { useState, useEffect, useCallback } from 'react'
import { sileo } from 'sileo'
import { Plus, AlertTriangle } from 'lucide-react'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileStats } from '../components/profile/ProfileStats'
import { MyReportCard } from '../components/profile/MyReportCard'
import { MyReportCardSkeleton } from '../components/profile/MyReportCardSkeleton'
import { ProfileHelpCard } from '../components/profile/ProfileHelpCard'
import { ClaimTicketCard } from '../components/modals/claim/ClaimTicketCard'
import { ClaimHistoryCard } from '../components/modals/claim/ClaimHistoryCard'
import { ClaimTicketSkeleton } from '../components/modals/claim/ClaimTicketSkeleton'
import type { ClaimTicket, UserReportItem } from '../types/lostFound'
import { getClaimTickets, getMyReports, updateClaimTicketStatus } from '../services/userDataService'

interface ProfilePageProps {
  onNavigateToLapor?: (type: 'lost' | 'found') => void
  onOpenAiMatch?: () => void
  onNavigateToPos?: (posName: string) => void
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToLapor,
  onOpenAiMatch,
  onNavigateToPos,
}) => {
  const [activeTab, setActiveTab] = useState<'laporan' | 'klaim'>('laporan')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [myReports, setMyReports] = useState<UserReportItem[]>([])
  const [claimTickets, setClaimTickets] = useState<ClaimTicket[]>([])
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)

  const loadProfileData = useCallback(async () => {
    const [loadedReports, loadedTickets] = await Promise.all([
      getMyReports(),
      getClaimTickets(),
    ])
    setMyReports(loadedReports)
    setClaimTickets(loadedTickets)
  }, [])

  useEffect(() => {
    let active = true
    const minSkeletonDelay = new Promise<void>((resolve) =>
      window.setTimeout(resolve, 220)
    )

    Promise.all([getMyReports(), getClaimTickets(), minSkeletonDelay])
      .then(([loadedReports, loadedTickets]) => {
        if (!active) return
        setMyReports(loadedReports)
        setClaimTickets(loadedTickets)
        setLoadError(null)
      })
      .catch(() => {
        if (active) {
          setLoadError('Gagal memuat data laporan dan tiket dari perangkat.')
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!cancelTargetId) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCancelTargetId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cancelTargetId])

  const handleRetry = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      await loadProfileData()
    } catch {
      setLoadError('Gagal memuat ulang data profil. Coba beberapa saat lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const activeReportsCount = myReports.filter((r) => r.status !== 'selesai').length
  const activeTickets = claimTickets.filter(
    (t) => t.status === 'ready_for_pickup' || t.status === 'waiting_review'
  )
  const historyTickets = claimTickets.filter(
    (t) => t.status === 'completed' || t.status === 'cancelled'
  )
  const completedCount = myReports.filter((r) => r.status === 'selesai').length

  const handleConfirmCancelTicket = () => {
    if (!cancelTargetId) return
    const targetId = cancelTargetId
    setCancelTargetId(null)
    setClaimTickets((prev) =>
      prev.map((t) =>
        t.id === targetId
          ? { ...t, status: 'cancelled' as const, statusLabel: 'Dibatalkan Pengguna' }
          : t
      )
    )
    void updateClaimTicketStatus(targetId, 'cancelled', 'Dibatalkan Pengguna')
    sileo.info({
      title: 'Tiket klaim dibatalkan',
      description: 'Tiket dipindahkan ke riwayat. Anda dapat mengajukan klaim ulang.',
    })
  }

  const cancelTargetTicket = claimTickets.find((t) => t.id === cancelTargetId)

  return (
    <main className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-4 text-left">
      {/* 1. Header Mahasiswa & SSO */}
      <ProfileHeader />

      {/* 2. Ringkasan Aktivitas (1 Baris Terpadu) */}
      <ProfileStats
        reportCount={activeReportsCount}
        activeTicketCount={activeTickets.length}
        completedCount={completedCount}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 3. Tab Navigasi */}
      <div
        role="tablist"
        aria-label="Daftar Aktivitas Profil"
        className="flex border-b border-slate-200 gap-6 px-1 text-xs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'laporan'}
          onClick={() => setActiveTab('laporan')}
          className={`min-h-[44px] pb-2 font-bold transition-colors relative flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] rounded-t-md ${
            activeTab === 'laporan'
              ? 'text-[#155E38]'
              : 'text-[#44574B] hover:text-[#14261B]'
          }`}
        >
          <span>Laporan Saya</span>
          <span className="text-[11px] font-semibold text-[#44574B] tabular-nums">
            ({myReports.length})
          </span>
          {activeTab === 'laporan' && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 inset-x-0 h-0.5 bg-[#155E38]"
            />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'klaim'}
          onClick={() => setActiveTab('klaim')}
          className={`min-h-[44px] pb-2 font-bold transition-colors relative flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] rounded-t-md ${
            activeTab === 'klaim'
              ? 'text-[#155E38]'
              : 'text-[#44574B] hover:text-[#14261B]'
          }`}
        >
          <span>Tiket Klaim</span>
          <span className="text-[11px] font-semibold text-[#44574B] tabular-nums">
            ({activeTickets.length})
          </span>
          {activeTab === 'klaim' && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 inset-x-0 h-0.5 bg-[#155E38]"
            />
          )}
        </button>
      </div>

      {/* State Error */}
      {loadError && !isLoading ? (
        <section
          role="alert"
          className="p-5 rounded-xl bg-white border border-red-200 flex flex-col gap-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#B3261E] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-[#14261B]">
                Data Profil Gagal Dimuat
              </h3>
              <p className="text-xs text-[#44574B] leading-relaxed">
                {loadError} Periksa penyimpanan browser lalu coba lagi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2"
          >
            Muat Ulang Data
          </button>
        </section>
      ) : activeTab === 'laporan' ? (
        /* 4. Konten Tab Laporan Saya */
        <section aria-label="Daftar Laporan Saya" className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs text-[#44574B] font-medium">
              {myReports.length} riwayat laporan
            </span>
            {onNavigateToLapor && (
              <button
                type="button"
                onClick={() => onNavigateToLapor('lost')}
                className="min-h-[44px] px-2 text-xs font-bold text-[#155E38] hover:text-[#0F4A2C] inline-flex items-center gap-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Lapor Baru</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <MyReportCardSkeleton count={3} />
          ) : myReports.length === 0 ? (
            <div className="p-6 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center gap-2.5">
              <p className="text-xs font-bold text-[#14261B]">
                Belum Ada Laporan Terdaftar
              </p>
              <p className="text-xs text-[#44574B] max-w-xs leading-relaxed">
                Laporan barang hilang atau temuan yang Anda kirim akan tercatat di sini untuk dipantau statusnya.
              </p>
              {onNavigateToLapor && (
                <button
                  type="button"
                  onClick={() => onNavigateToLapor('lost')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38] focus-visible:ring-offset-2"
                >
                  Buat Laporan Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-200 overflow-hidden">
              {myReports.map((report) => (
                <MyReportCard
                  key={report.id}
                  item={report}
                  onOpenAiMatch={onOpenAiMatch}
                  onNavigateToPos={onNavigateToPos}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* 5. Konten Tab Tiket Klaim */
        <section aria-label="Tiket Klaim" className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-0.5 text-xs text-[#44574B] font-medium">
            <span>Tunjukkan QR &amp; OTP saat mengambil barang di pos</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              <ClaimTicketSkeleton />
            </div>
          ) : activeTickets.length === 0 && historyTickets.length === 0 ? (
            <div className="p-6 rounded-xl bg-white border border-slate-200 text-center flex flex-col items-center gap-2">
              <p className="text-xs font-bold text-[#14261B]">
                Belum Ada Tiket Klaim
              </p>
              <p className="text-xs text-[#44574B] max-w-xs leading-relaxed">
                Tiket pengambilan beserta QR &amp; OTP akan muncul setelah Anda mengajukan klaim barang di Beranda atau Radar AI.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeTickets.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {activeTickets.map((ticket) => (
                    <ClaimTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onNavigateToPos={onNavigateToPos}
                      onRequestCancel={(id) => setCancelTargetId(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-[#44574B]">
                  Tidak ada tiket pengambilan yang sedang aktif saat ini.
                </div>
              )}

              {historyTickets.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-[#14261B] px-0.5">
                    Riwayat Klaim ({historyTickets.length})
                  </h3>
                  <div className="flex flex-col gap-2">
                    {historyTickets.map((ticket) => (
                      <ClaimHistoryCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 6. Informasi Bantuan Pos Satpam */}
      <ProfileHelpCard />

      {/* Dialog Konfirmasi Pembatalan Tiket */}
      {cancelTargetTicket && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-ticket-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCancelTargetId(null)
          }}
        >
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-slate-200 flex flex-col gap-3 text-left shadow-lg">
            <h3 id="cancel-ticket-title" className="text-sm font-bold text-[#14261B]">
              Batalkan Tiket #{cancelTargetTicket.ticketNumber}?
            </h3>
            <p className="text-xs text-[#44574B] leading-relaxed">
              Kode QR dan OTP pengambilan untuk <strong>{cancelTargetTicket.itemTitle}</strong> akan dinonaktifkan. Anda perlu mengajukan klaim ulang jika ingin mengambil barang ini.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelTargetId(null)}
                className="min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#44574B] hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
              >
                Pertahankan Tiket
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelTicket}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#B3261E] hover:bg-[#8C1D18] text-white text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B3261E] focus-visible:ring-offset-2"
              >
                Batalkan Klaim
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProfilePage
