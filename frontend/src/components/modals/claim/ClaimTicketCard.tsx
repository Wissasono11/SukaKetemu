import React from 'react'
import {
  MapPin,
  QrCode,
  Copy,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react'
import type { ClaimTicket } from '../../../types/lostFound'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'

interface ClaimTicketCardProps {
  ticket: ClaimTicket
  onNavigateToPos?: (posName: string) => void
  onRequestCancel: (ticketId: string) => void
}

export const ClaimTicketCard: React.FC<ClaimTicketCardProps> = ({
  ticket,
  onNavigateToPos,
  onRequestCancel,
}) => {
  const { copied: copiedOtp, copy: copyOtp } = useCopyToClipboard()

  const handleCopyOtp = (otp: string) => {
    copyOtp(otp)
  }

  return (
    <div className="flex flex-col gap-3">
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 transition-all min-h-[36px]"
              aria-label={`Salin kode OTP ${ticket.otpCode}`}
              title="Klik untuk menyalin kode"
            >
              <span className="font-mono text-base font-black tracking-[0.3em] text-[#155E38]">
                {ticket.otpCode.split('').join(' ')}
              </span>
              <span role="status" aria-live="polite" className="inline-flex items-center">
                {copiedOtp ? (
                  <Check className="w-3.5 h-3.5 text-[#155E38]" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                )}
              </span>
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
          onClick={() => onNavigateToPos?.(ticket.posLocation)}
          className="w-full py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <MapPin className="w-4 h-4 text-white" />
          <span>Rute Lokasi ke {ticket.posLocation.split('(')[0]}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onRequestCancel(ticket.id)}
          className="py-2 text-[11px] font-semibold text-slate-500 hover:text-[#B3261E] transition-colors"
        >
          Batalkan Pengajuan Klaim Ini
        </button>
      </div>
    </div>
  )
}
