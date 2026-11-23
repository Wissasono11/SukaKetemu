import React, { useState, useEffect } from 'react'
import {
  MapPin,
  Copy,
  ChevronRight,
  AlertCircle,
  Check,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
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
  const [secondsLeft, setSecondsLeft] = useState(285) // TTL 5 Menit (default 4m 45s)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentOtp, setCurrentOtp] = useState(ticket.otpCode)

  const isReady = ticket.status === 'ready_for_pickup'

  useEffect(() => {
    if (!isReady || secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isReady, secondsLeft])

  const handleCopyOtp = (otp: string) => {
    copyOtp(otp)
  }

  const handleRegenerateOtp = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setCurrentOtp(randomOtp)
      setSecondsLeft(300) // Reset 5 menit TTL
      setIsRefreshing(false)
    }, 450)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTtl = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

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
            <div className="w-28 h-28 bg-white rounded-lg p-2 flex items-center justify-center border border-slate-100 shadow-xs">
              <QRCodeSVG
                value={`SUKA-TKT:${ticket.ticketNumber}:${currentOtp}`}
                size={96}
                level="M"
              />
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1">
              SCANNER RESMI POS SATPAM
            </span>
          </div>

          {/* Kode OTP 6-Digit Dinamis (TTL 5 Menit via Redis) */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[10px] text-[#44574B] font-semibold">
                KODE OTP PENGAMBILAN (6-DIGIT):
              </span>
              {isReady && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full transition-colors ${
                    secondsLeft === 0
                      ? 'bg-rose-100 text-rose-700'
                      : secondsLeft < 60
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-[#E4F1E8] text-[#155E38]'
                  }`}
                  title="Waktu aktif OTP di server Redis"
                >
                  <Clock className="w-3 h-3" />
                  <span>{secondsLeft > 0 ? `TTL: ${formattedTtl}` : 'Kadaluarsa'}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyOtp(currentOtp)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 transition-all min-h-[38px]"
                aria-label={`Salin kode OTP 6-digit ${currentOtp}`}
                title="Klik untuk menyalin kode"
              >
                <span className="font-mono text-base font-black tracking-[0.25em] text-[#155E38]">
                  {currentOtp.slice(0, 3)} {currentOtp.slice(3)}
                </span>
                <span role="status" aria-live="polite" className="inline-flex items-center">
                  {copiedOtp ? (
                    <Check className="w-3.5 h-3.5 text-[#155E38]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  )}
                </span>
              </button>

              {isReady && (
                <button
                  type="button"
                  onClick={handleRegenerateOtp}
                  disabled={isRefreshing}
                  title="Perbarui OTP Dinamis via Redis"
                  aria-label="Perbarui OTP Dinamis"
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#155E38] active:scale-95 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#155E38]' : ''}`} />
                </button>
              )}
            </div>

            <span className="text-[9px] text-slate-400">
              *OTP 6-digit dinamis (TTL 5 mnt via Redis) untuk verifikasi satpam
            </span>
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
