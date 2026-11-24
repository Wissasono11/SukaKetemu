import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileStats } from '../components/profile/ProfileStats'
import { MyReportCard } from '../components/profile/MyReportCard'
import { ProfileHelpCard } from '../components/profile/ProfileHelpCard'
import { ClaimTicketCard } from '../components/modals/claim/ClaimTicketCard'
import { MY_USER_REPORTS, INITIAL_CLAIM_TICKETS } from '../data/mockItems'
import type { ClaimTicket, UserReportItem } from '../types/lostFound'

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
  const [myReports] = useState<UserReportItem[]>(MY_USER_REPORTS)
  const [claimTickets, setClaimTickets] = useState<ClaimTicket[]>(INITIAL_CLAIM_TICKETS)

  const activeReportsCount = myReports.filter((r) => r.status !== 'selesai').length
  const activeTicketsCount = claimTickets.filter(
    (t) => t.status === 'ready_for_pickup' || t.status === 'waiting_review'
  ).length
  const completedCount = myReports.filter((r) => r.status === 'selesai').length

  const handleCancelTicket = (ticketId: string) => {
    setClaimTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'cancelled' as const, statusLabel: 'Dibatalkan Pengguna' }
          : t
      )
    )
  }

  return (
    <main className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-4 text-left animate-in fade-in duration-200">
      {/* 1. Header Mahasiswa & SSO */}
      <ProfileHeader />

      {/* 2. Kartu Metrik Ringkas */}
      <ProfileStats
        reportCount={activeReportsCount}
        activeTicketCount={activeTicketsCount}
        completedCount={completedCount}
        onSelectTab={setActiveTab}
      />

      {/* 3. Tab Navigasi */}
      <div className="flex border-b border-slate-200 gap-6 px-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('laporan')}
          className={`pb-2.5 font-bold transition-all relative flex items-center gap-1.5 ${
            activeTab === 'laporan'
              ? 'text-[#155E38]'
              : 'text-[#44574B] hover:text-[#14261B]'
          }`}
        >
          <span>Laporan Saya</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'laporan'
                ? 'bg-[#E4F1E8] text-[#155E38]'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {myReports.length}
          </span>
          {activeTab === 'laporan' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#155E38] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('klaim')}
          className={`pb-2.5 font-bold transition-all relative flex items-center gap-1.5 ${
            activeTab === 'klaim'
              ? 'text-[#155E38]'
              : 'text-[#44574B] hover:text-[#14261B]'
          }`}
        >
          <span>Tiket Klaim</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'klaim'
                ? 'bg-[#E4F1E8] text-[#155E38]'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {claimTickets.length}
          </span>
          {activeTab === 'klaim' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#155E38] rounded-full" />
          )}
        </button>
      </div>

      {/* 4. Konten Tab Laporan Saya */}
      {activeTab === 'laporan' && (
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-500 font-medium">
              Menampilkan {myReports.length} laporan riwayat Anda
            </span>
            <button
              type="button"
              onClick={() => onNavigateToLapor?.('lost')}
              className="text-xs font-bold text-[#155E38] hover:text-[#0F4A2C] flex items-center gap-0.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Lapor Baru
            </button>
          </div>

          {myReports.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-500">
              Belum ada laporan aktif. Buat laporan barang temuan atau hilang.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
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
      )}

      {/* 5. Konten Tab Tiket Klaim */}
      {activeTab === 'klaim' && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 font-medium">
            <span>Tunjukkan QR &amp; OTP saat mengambil barang di pos</span>
          </div>

          {claimTickets.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-500">
              Tidak ada tiket klaim aktif saat ini.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {claimTickets.map((ticket) => (
                <ClaimTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onNavigateToPos={onNavigateToPos}
                  onRequestCancel={handleCancelTicket}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 6. Informasi Bantuan Pos Satpam */}
      <ProfileHelpCard />
    </main>
  )
}
export default ProfilePage
