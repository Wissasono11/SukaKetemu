import React, { useState } from 'react'
import {
  X,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import type { LostFoundItem, ClaimTicket } from '../../../types/lostFound'

interface ChallengeResponseModalProps {
  isOpen: boolean
  item: LostFoundItem | null
  onClose: () => void
  onSuccess: (newTicket: ClaimTicket) => void
}

export const ChallengeResponseModal: React.FC<ChallengeResponseModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}) => {
  const [answer, setAnswer] = useState('')
  const [proofNote, setProofNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen || !item) return null

  const isPosSatpam = item.custody === 'pos_satpam'

  const getChallengePrompt = () => {
    switch (item.category) {
      case 'elektronik':
        return 'Sebutkan ciri khusus fisik (warna casing/wallpaper, stiker khusus, goresan khas, atau 4-digit PIN)?'
      case 'dokumen':
        return 'Sebutkan nama lengkap pemilik atau nomor identitas/NIM yang tertera?'
      case 'tas':
        return 'Sebutkan gantungan kunci, warna resleting, atau barang spesifik di saku dalam?'
      case 'botol':
        return 'Sebutkan warna tutup, stiker penanda, atau grafir nama pada botol?'
      case 'ibadah':
        return 'Sebutkan warna pouch/tas mukena, bordiran nama, atau motif sajadah?'
      default:
        return 'Sebutkan ciri unik yang hanya diketahui oleh pemilik asli barang ini?'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim() || answer.trim().length < 5) {
      setErrorMsg('Tuliskan ciri khusus minimal 5 karakter untuk verifikasi.')
      return
    }

    setErrorMsg(null)
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      const randomNum = Math.floor(1000 + Math.random() * 9000)
      const generatedTicket: ClaimTicket = {
        id: `TKT-${randomNum}`,
        ticketNumber: `SK-2026-${randomNum}`,
        itemTitle: item.title,
        itemCategory: item.category,
        categoryLabel: item.categoryLabel,
        itemImageUrl: item.imageUrl,
        posLocation: isPosSatpam
          ? item.locationDetail.split('•')[0].trim() || 'Pos Satpam FST'
          : 'Masih Dibawa Penemu (Area Kampus)',
        status: 'ready_for_pickup',
        statusLabel: isPosSatpam ? 'Siap Diambil di Pos' : 'Menunggu Handshake Penemu',
        otpCode: String(Math.floor(100000 + Math.random() * 900000)),
        createdAt: new Date().toISOString(),
        pickupDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        matchedSecretFeature: answer.trim(),
        timeline: [
          { step: 1, title: 'Klaim Diajukan', desc: 'Verifikasi kepemilikan berhasil dicocokkan.', isDone: true, isCurrent: false },
          { step: 2, title: 'Tiket Terbit', desc: 'Tunjukkan QR/OTP saat serah terima fisik.', isDone: true, isCurrent: true },
          { step: 3, title: 'Selesai', desc: 'Pengecekan fisik oleh satpam/penemu.', isDone: false, isCurrent: false },
        ],
      }

      setTimeout(() => {
        onSuccess(generatedTicket)
        setIsSuccess(false)
        setAnswer('')
        setProofNote('')
        onClose()
      }, 900)
    }, 600)
  }

  return (
    <div
      className="fixed inset-0 z-60 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 text-left"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto overscroll-contain p-5 border border-slate-200 flex flex-col gap-4 text-left">
        {/* Header Modal Bersih & Natural */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#14261B]">Verifikasi Kepemilikan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klaim untuk: <span className="font-semibold text-slate-800">{item.title}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Verifikasi Klaim"
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Challenge-Response Fungsional */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="challenge-answer" className="text-xs font-bold text-[#14261B]">
              Pertanyaan Verifikasi
            </label>
            <p className="text-xs text-slate-600 leading-relaxed">
              {getChallengePrompt()}
            </p>
            <textarea
              id="challenge-answer"
              rows={3}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Jelaskan ciri khusus yang Anda ketahui..."
              className="w-full bg-slate-50 text-xs font-medium text-[#14261B] rounded-xl p-3 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#155E38] focus:ring-1 focus:ring-[#155E38] transition-colors placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="proof-note" className="text-xs font-bold text-[#14261B]">
              Bukti Tambahan (Opsional)
            </label>
            <input
              id="proof-note"
              type="text"
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              placeholder="Contoh: Ada struk, dus di kos, atau foto lama"
              className="w-full bg-slate-50 text-xs font-medium text-[#14261B] rounded-xl px-3 py-2.5 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#155E38] focus:ring-1 focus:ring-[#155E38] transition-colors placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span>Jawaban hanya diverifikasi saat serah terima dan tidak dipublikasikan ke feed.</span>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                isSuccess
                  ? 'bg-[#155E38] text-white'
                  : isSubmitting
                  ? 'bg-[#155E38]/80 text-white cursor-wait'
                  : 'bg-[#155E38] hover:bg-[#0F4A2C] text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Memverifikasi Bukti...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Verifikasi Diterima, Membuka Tiket...</span>
                </>
              ) : (
                <>
                  <span>Kirim &amp; Dapatkan Tiket Ambil</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Batalkan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
