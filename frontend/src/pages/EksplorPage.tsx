import React, { useState } from 'react'
import { Phone, Building2, Shield, Info } from 'lucide-react'
import { POS_SATPAM_LIST, INITIAL_ITEMS } from '../data/mockItems'
import { CampusMapTeaser } from '../components/eksplor/CampusMapTeaser'
import { PosSatpamCard } from '../components/eksplor/PosSatpamCard'
import { SopGuideCard } from '../components/eksplor/SopGuideCard'

interface EksplorPageProps {
  onNavigateToPos: (posName: string) => void
  onScanQr: () => void
}

export const EksplorPage: React.FC<EksplorPageProps> = ({
  onNavigateToPos,
  onScanQr,
}) => {
  const [selectedPosId, setSelectedPosId] = useState<string | null>(null)

  const handleSelectPosFromMap = (posId: string) => {
    setSelectedPosId(posId)
    const element = document.getElementById(`pos-card-${posId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Calculate items held at pos satpam
  const getStoredItemsForPos = (posId: string) => {
    return INITIAL_ITEMS.filter((item) => item.posId === posId)
  }

  const totalHeldItems = POS_SATPAM_LIST.reduce(
    (sum, pos) => sum + getStoredItemsForPos(pos.id).length,
    0
  )

  return (
    <div className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-4 text-left">
      {/* Header Info */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#155E38]" />
            <h2 className="text-base font-extrabold text-[#14261B]">
              Sentra Pos Keamanan FST
            </h2>
          </div>
          <a
            href="tel:+62274512474"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155E38] bg-[#E4F1E8] px-3 py-1 rounded-full hover:bg-[#D4E8DC] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#155E38]" />
            <span>Hotline Satpam</span>
          </a>
        </div>
        <p className="text-xs text-[#44574B]">
          Titik penitipan resmi dan serah terima barang temuan di lingkungan FST UIN Sunan Kalijaga
        </p>
      </header>

      {/* Campus Checkpoint Schematic */}
      <CampusMapTeaser
        selectedPosId={selectedPosId}
        onSelectPos={handleSelectPosFromMap}
      />

      {/* Checkpoint Cards List */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#155E38]" />
            Daftar Pos Jaga Aktif ({POS_SATPAM_LIST.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Total {totalHeldItems} barang diamankan
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {POS_SATPAM_LIST.map((pos) => {
            const stored = getStoredItemsForPos(pos.id)
            return (
              <PosSatpamCard
                key={pos.id}
                pos={pos}
                storedItems={stored}
                isSelected={selectedPosId === pos.id}
                onFilterByPos={() => onNavigateToPos(pos.name)}
                onScanQr={onScanQr}
              />
            )
          })}
        </div>
      </section>

      {/* Handover Guidelines */}
      <SopGuideCard />

      {/* Institutional Security Notice */}
      <aside
        aria-label="Ketentuan Penitipan Barang Kampus"
        className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-start gap-2.5 text-slate-700"
      >
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Ketentuan Pengamanan FST:</strong> Barang temuan tanpa konfirmasi pemilik disimpan maksimal 30 hari kalender di Pos Satpam sebelum diserahkan ke Subbagian Layanan Akademik &amp; Kemahasiswaan FST UIN Sunan Kalijaga.
        </p>
      </aside>
    </div>
  )
}
export default EksplorPage
