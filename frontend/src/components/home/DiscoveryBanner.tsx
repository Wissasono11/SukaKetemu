import React from 'react'
import { MapPin, X } from 'lucide-react'

interface DiscoveryBannerProps {
  onDismiss?: () => void
}

export const DiscoveryBanner: React.FC<DiscoveryBannerProps> = ({ onDismiss }) => {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4A2C] via-[#155E38] to-[#0A331E] p-3.5 text-white shadow-[0_4px_16px_rgba(15,74,44,0.14)]">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <div className="inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full bg-[#C59B27]/25 border border-[#C59B27]/30 backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-[#FFDF98]" />
              <span className="text-[10px] font-bold text-[#FFDF98] tracking-wide">
                Location-Aware Discovery
              </span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight mt-0.5 leading-snug">
              Lacak Titik Keberadaan Barang
            </h2>
            <p className="text-[11px] text-[#E4F1E8]/90 leading-relaxed">
              Cek apakah barang dititipkan di Pos Satpam atau masih dibawa penemu di gedung kampus.
            </p>
          </div>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Tutup Banner"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0 -mr-0.5 -mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#C59B27]/10 pointer-events-none blur-2xl" />
      </div>
    </section>
  )
}
