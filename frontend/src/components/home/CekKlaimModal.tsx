import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  MapPin,
  QrCode,
  CheckCircle2,
  Copy,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Check,
} from 'lucide-react'
import type { ClaimTicket } from '../../types/lostFound'
import { INITIAL_CLAIM_TICKETS } from '../../data/mockItems'

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
  const [copiedOtp, setCopiedOtp] = useState(false)
  const [cancelModalTicketId, setCancelModalTicketId] = useState<string | null>(null)

  if (!isOpen) return null

  const activeTickets = tickets.filter(
    (t) => t.status === 'ready_for_pickup' || t.status === 'waiting_review'
  )
  const historyTickets = tickets.filter(
    (t) => t.status === 'completed' || t.status === 'cancelled'
  )

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard?.writeText(otp)
    setCopiedOtp(true)
    setTimeout(() => setCopiedOtp(false), 2000)
  }

  const handleCancelClaim = (ticketId: string) => {
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
    setCancelModalTicketId(null)
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

        {/* Konten Tab Aktif */}
        {activeTab === 'aktif' ? (
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
              <div key={ticket.id} className="flex flex-col gap-3">
                {/* Kartu Tiket Digital Berlubang (Boarding Pass Style) */}
                <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  {/* Bagian Atas Tiket */}
                  <div className="p-4 flex flex-col gap-3 bg-gradient-to-b from-[#E4F1E8]/30 to-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#155E38] bg-[#E4F1E8] px-2 py-0.5 rounded-md">
                        #{ticket.ticketNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0F4A2C] bg-[#E4F1E8] px-2.5 py-0.5 rounded-full border border-[#155E38]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#155E38] animate-pulse" />
                        {ticket.statusLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={ticket.itemImageUrl}
                        alt={ticket.itemTitle}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#14261B] line-clamp-1">
                          {ticket.itemTitle}
                        </span>
                        <span className="text-[11px] text-[#44574B] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#155E38] flex-shrink-0" />
                          <span className="truncate">{ticket.posLocation}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Batas Ambil: <strong>{ticket.pickupDeadline}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Garis Perforasi Sobekan Tiket */}
                  <div className="relative flex items-center justify-between px-2 py-1 bg-white">
                    <div className="w-3 h-6 rounded-r-full bg-slate-100 border-r border-slate-200 -ml-2" />
                    <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2" />
                    <div className="w-3 h-6 rounded-l-full bg-slate-100 border-l border-slate-200 -mr-2" />
                  </div>

                  {/* Bagian Bawah Tiket (QR & OTP Rahasia) */}
                  <div className="p-4 pt-2 flex flex-col items-center text-center gap-2.5 bg-white">
                    {/* Kotak QR Code */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center">
                      <div className="w-28 h-28 bg-slate-900 rounded-lg p-2 flex items-center justify-center text-white">
                        <QrCode className="w-24 h-24 text-white" />
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono mt-1">
                        SCANNER RESMI POS SATPAM
                      </span>
                    </div>

                    {/* Kode OTP 4-Digit */}
                    <div className="flex flex-col items-center gap-1 w-full">
                      <span className="text-[10px] text-[#44574B] font-semibold">
                        KODE OTP PENGAMBILAN:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyOtp(ticket.otpCode)}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 transition-all"
                        title="Klik untuk menyalin kode"
                      >
                        <span className="font-mono text-base font-black tracking-[0.3em] text-[#155E38]">
                          {ticket.otpCode.split('').join(' ')}
                        </span>
                        {copiedOtp ? (
                          <Check className="w-3.5 h-3.5 text-[#155E38]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-start gap-1.5 p-2 rounded-xl bg-[#FEF3C7]/60 border border-[#C59B27]/30 text-left w-full">
                      <AlertCircle className="w-3.5 h-3.5 text-[#92400E] flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-[#92400E] leading-relaxed">
                        Tunjukkan QR ini atau sebutkan OTP ke Satpam di <strong>{ticket.posLocation}</strong> beserta kartu identitas (KTM) Anda.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Status 3-Tahap */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-[#14261B]">
                    Proses Verifikasi Klaim:
                  </span>
                  <div className="flex flex-col gap-2 relative pl-4 border-l-2 border-[#155E38]/30 ml-2">
                    {ticket.timeline.map((step) => (
                      <div key={step.step} className="relative flex flex-col">
                        <div
                          className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            step.isDone
                              ? 'bg-[#155E38] text-white'
                              : step.isCurrent
                              ? 'bg-[#C59B27] text-white ring-2 ring-[#FEF3C7]'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {step.isDone ? '✓' : step.step}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            step.isCurrent
                              ? 'text-[#C59B27]'
                              : step.isDone
                              ? 'text-[#0F4A2C]'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] text-[#44574B]">
                          {step.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tombol Aksi Rute & Batalkan */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      if (onNavigateToPos) onNavigateToPos(ticket.posLocation)
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MapPin className="w-4 h-4 text-white" />
                    <span>Rute Lokasi ke {ticket.posLocation.split('(')[0]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCancelModalTicketId(ticket.id)}
                    className="py-2 text-[11px] font-semibold text-slate-500 hover:text-[#B3261E] transition-colors"
                  >
                    Batalkan Pengajuan Klaim Ini
                  </button>
                </div>
              </div>
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
                <div
                  key={ticket.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      #{ticket.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.status === 'completed'
                          ? 'bg-[#E4F1E8] text-[#0F4A2C]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ticket.statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={ticket.itemImageUrl}
                      alt={ticket.itemTitle}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#14261B] line-clamp-1">
                        {ticket.itemTitle}
                      </span>
                      <span className="text-[11px] text-[#44574B]">
                        {ticket.posLocation}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {ticket.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
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
                  onClick={() => handleCancelClaim(cancelModalTicketId)}
                  className="flex-1 py-2 rounded-xl bg-[#B3261E] text-white text-xs font-bold hover:bg-[#8C1D18]"
                >
                  Ya, Batalkan
                </button>
                <button
                  type="button"
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
