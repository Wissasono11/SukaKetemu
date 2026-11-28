import React, { useState, useEffect, useRef } from 'react'
import { sileo } from 'sileo'
import { X, ShieldCheck, FileCheck, CheckCircle2, Loader2 } from 'lucide-react'
import type { ClaimTicket } from '../../types/lostFound'
import { INITIAL_CLAIM_TICKETS } from '../../data/mockItems'
import { ClaimTicketCard } from './claim/ClaimTicketCard'
import { ClaimHistoryCard } from './claim/ClaimHistoryCard'
import { ClaimTicketSkeleton } from './claim/ClaimTicketSkeleton'
import { ClaimHistorySkeleton } from './claim/ClaimHistorySkeleton'

interface CekKlaimModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToPos?: (posName: string) => void
  tickets?: ClaimTicket[]
  onTicketsChange?: (tickets: ClaimTicket[]) => void
}

export const CekKlaimModal: React.FC<CekKlaimModalProps> = (props) => {
  if (!props.isOpen) return null
  return <CekKlaimModalContent {...props} />
}

const CekKlaimModalContent: React.FC<CekKlaimModalProps> = ({
  onClose,
  onNavigateToPos,
  tickets: propTickets,
  onTicketsChange,
}) => {
  const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat'>('aktif')
  const [internalTickets, setInternalTickets] = useState<ClaimTicket[]>(INITIAL_CLAIM_TICKETS)

  const tickets = propTickets ?? internalTickets
  const setTickets = (updater: React.SetStateAction<ClaimTicket[]>) => {
    if (onTicketsChange) {
      const nextTickets = typeof updater === 'function' ? updater(tickets) : updater
      onTicketsChange(nextTickets)
    } else {
      setInternalTickets(updater)
    }
  }
  const [cancelModalTicketId, setCancelModalTicketId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const tabTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350)
    return () => {
      window.clearTimeout(timer)
      if (tabTimerRef.current) window.clearTimeout(tabTimerRef.current)
    }
  }, [])

  const handleTabSwitch = (tab: 'aktif' | 'riwayat') => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setIsLoading(true)
    if (tabTimerRef.current) window.clearTimeout(tabTimerRef.current)
    tabTimerRef.current = window.setTimeout(() => {
      setIsLoading(false)
      tabTimerRef.current = null
    }, 250)
  }

  const activeTickets = tickets.filter(
    (t) => t.status === 'ready_for_pickup' || t.status === 'waiting_review'
  )
  const historyTickets = tickets.filter(
    (t) => t.status === 'completed' || t.status === 'cancelled'
  )

  const handleCancelClaim = (ticketId: string) => {
    setIsCancelling(true)
    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: 'cancelled' as const, statusLabel: 'Dibatalkan oleh Pengguna' }
            : t
        )
      )
      setIsCancelling(false)
      setCancelModalTicketId(null)
      sileo.info({
        title: 'Tiket klaim dibatalkan',
        description: 'Tiket dipindahkan ke riwayat. Anda dapat mengklaim ulang kapan saja.',
      })
    }, 500)
  }

  const renderEmptyState = (icon: React.ReactNode, title: string, desc: string) => (
    <div className="py-10 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
      {icon}
      <p className="text-xs font-bold text-[#14261B]">{title}</p>
      <p className="text-[11px] text-[#44574B] mt-1 max-w-xs">{desc}</p>
    </div>
  )

  const tabBtnClass = (tab: 'aktif' | 'riwayat') =>
    `flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
      activeTab === tab ? 'bg-white text-[#155E38] shadow-xs font-bold' : 'text-[#44574B] hover:text-[#14261B]'
    }`

  const tabBadgeClass = (tab: 'aktif' | 'riwayat') =>
    `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
      activeTab === tab ? 'bg-[#155E38] text-white' : 'bg-slate-200 text-[#44574B]'
    }`

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
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#14261B]">Tiket &amp; Status Klaim</h3>
              <p className="text-[11px] text-[#44574B]">Verifikasi serah terima civitas FST</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal Klaim"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Filter: Aktif vs Riwayat */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button type="button" onClick={() => handleTabSwitch('aktif')} className={tabBtnClass('aktif')}>
            <span>Klaim Aktif</span>
            <span className={tabBadgeClass('aktif')}>{activeTickets.length}</span>
          </button>

          <button type="button" onClick={() => handleTabSwitch('riwayat')} className={tabBtnClass('riwayat')}>
            <span>Riwayat Selesai</span>
            <span className={tabBadgeClass('riwayat')}>{historyTickets.length}</span>
          </button>
        </div>

        {/* Konten Tab Aktif / Riwayat */}
        {isLoading ? (
          activeTab === 'aktif' ? (
            <ClaimTicketSkeleton />
          ) : (
            <ClaimHistorySkeleton count={2} />
          )
        ) : activeTab === 'aktif' ? (
          activeTickets.length === 0 ? (
            renderEmptyState(
              <FileCheck className="w-8 h-8 text-slate-400 mb-2" />,
              'Tidak Ada Klaim Aktif',
              'Anda belum mengajukan klaim barang. Jika menemukan barang Anda di feed, klik kartu dan pilih "Klaim Barang Ini".'
            )
          ) : (
            activeTickets.map((ticket) => (
              <ClaimTicketCard
                key={ticket.id}
                ticket={ticket}
                onNavigateToPos={(pos) => {
                  onClose()
                  if (onNavigateToPos) onNavigateToPos(pos)
                }}
                onRequestCancel={(id) => setCancelModalTicketId(id)}
              />
            ))
          )
        ) : historyTickets.length === 0 ? (
          renderEmptyState(
            <CheckCircle2 className="w-8 h-8 text-slate-400 mb-2" />,
            'Belum Ada Riwayat Klaim',
            'Barang yang sudah berhasil Anda ambil akan tercatat rapi di sini.'
          )
        ) : (
          <div className="flex flex-col gap-3">
            {historyTickets.map((ticket) => (
              <ClaimHistoryCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}

        {/* Modal Konfirmasi Batal */}
        {cancelModalTicketId && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-xs w-full flex flex-col gap-3 shadow-xl">
              <h4 className="text-sm font-bold text-[#14261B]">Batalkan Pengajuan Klaim?</h4>
              <p className="text-xs text-[#44574B] leading-relaxed">
                Tiket QR dan kode OTP akan dinonaktifkan. Anda harus mengajukan ulang jika ingin mengklaim kembali.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => handleCancelClaim(cancelModalTicketId)}
                  className="flex-1 py-2 rounded-xl bg-[#B3261E] text-white text-xs font-bold hover:bg-[#8C1D18] disabled:opacity-75 flex items-center justify-center gap-1.5"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Membatalkan...</span>
                    </>
                  ) : (
                    'Ya, Batalkan'
                  )}
                </button>
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => setCancelModalTicketId(null)}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
