import React, { useState, useEffect } from 'react'
import { X, ShieldCheck, FileCheck, CheckCircle2, Loader2 } from 'lucide-react'
import type { ClaimTicket } from '../../types/lostFound'
import { INITIAL_CLAIM_TICKETS } from '../../data/mockItems'
import { ClaimTicketCard } from './claim/ClaimTicketCard'
import { ClaimHistoryCard } from './claim/ClaimHistoryCard'
import { ClaimTicketSkeleton } from './claim/ClaimTicketSkeleton'

interface CekKlaimModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToPos?: (posName: string) => void
}

export const CekKlaimModal: React.FC<CekKlaimModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPos,
}) => {
  const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat'>('aktif')
  const [tickets, setTickets] = useState<ClaimTicket[]>(INITIAL_CLAIM_TICKETS)
  const [cancelModalTicketId, setCancelModalTicketId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [isOpen, activeTab])

  if (!isOpen) return null

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
            ? {
                ...t,
                status: 'cancelled' as const,
                statusLabel: 'Dibatalkan oleh Pengguna',
              }
            : t
        )
      )
      setIsCancelling(false)
      setCancelModalTicketId(null)
    }, 500)
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
          <button
            type="button"
            onClick={() => setActiveTab('aktif')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'aktif'
                ? 'bg-white text-[#155E38] shadow-xs font-bold'
                : 'text-[#44574B] hover:text-[#14261B]'
            }`}
          >
            <span>Klaim Aktif</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'aktif'
                  ? 'bg-[#155E38] text-white'
                  : 'bg-slate-200 text-[#44574B]'
              }`}
            >
              {activeTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'riwayat'
                ? 'bg-white text-[#155E38] shadow-xs font-bold'
                : 'text-[#44574B] hover:text-[#14261B]'
            }`}
          >
            <span>Riwayat Selesai</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'riwayat'
                  ? 'bg-[#155E38] text-white'
                  : 'bg-slate-200 text-[#44574B]'
              }`}
            >
              {historyTickets.length}
            </span>
          </button>
        </div>

        {/* Konten Tab Aktif / Riwayat dengan Skeleton State */}
        {isLoading ? (
          <ClaimTicketSkeleton />
        ) : activeTab === 'aktif' ? (
          activeTickets.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <FileCheck className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-[#14261B]">Tidak Ada Klaim Aktif</p>
              <p className="text-[11px] text-[#44574B] mt-1 max-w-xs">
                Anda belum mengajukan klaim barang. Jika menemukan barang Anda di feed, klik kartu dan pilih "Klaim Barang Ini".
              </p>
            </div>
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
        ) : (
          /* Konten Tab Riwayat */
          historyTickets.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-[#14261B]">Belum Ada Riwayat Klaim</p>
              <p className="text-[11px] text-[#44574B] mt-1 max-w-xs">
                Barang yang sudah berhasil Anda ambil akan tercatat rapi di sini.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {historyTickets.map((ticket) => (
                <ClaimHistoryCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )
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
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
