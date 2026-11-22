import React, { useState } from 'react'
import { Phone, Building2, Shield, Sparkles } from 'lucide-react'
import { POS_SATPAM_LIST, INITIAL_ITEMS } from '../data/mockItems'
import { CampusMapTeaser } from '../components/eksplor/CampusMapTeaser'
import { PosSatpamCard } from '../components/eksplor/PosSatpamCard'
import { SopGuideCard } from '../components/eksplor/SopGuideCard'

interface EksplorPageProps {
  onNavigateToPos: (posName: string) => void
  onScanQr: () => void
}

type FilterChip = 'all' | '24hours' | 'fst-lobby' | 'lab-terpadu'

export const EksplorPage: React.FC<EksplorPageProps> = ({
  onNavigateToPos,
  onScanQr,
}) => {
  const [selectedPosId, setSelectedPosId] = useState<string | null>(null)
  const [activeChip, setActiveChip] = useState<FilterChip>('all')

  const handleSelectPosFromMap = (posId: string) => {
    setSelectedPosId(posId)
    const element = document.getElementById(`pos-card-${posId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const filteredPosList = POS_SATPAM_LIST.filter((pos) => {
    if (activeChip === '24hours') return pos.operatingHours.includes('24')
    if (activeChip === 'fst-lobby') return pos.id === 'pos-fst-lobby'
    if (activeChip === 'lab-terpadu') return pos.id === 'pos-lab-terpadu'
    return true
  })

  // Group items by posId for live preview count
  const getStoredItemsForPos = (posId: string) => {
    return INITIAL_ITEMS.filter((item) => item.posId === posId)
  }

  return (
    <div className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-4 text-left">
      {/* Header Info */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#155E38]" />
            <h2 className="text-base font-extrabold text-[#14261B]">
              Eksplor Titik Kampus
            </h2>
          </div>
          <a
            href="tel:+62274512474"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#155E38] bg-[#E4F1E8] px-2.5 py-1 rounded-full hover:bg-[#D4E8DC] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#155E38]" />
            <span>Hotline Satpam</span>
          </a>
        </div>
        <p className="text-xs text-[#44574B]">
          Pantau titik penitipan resmi barang temuan di lingkungan FST UIN Sunan Kalijaga
        </p>
      </header>

      {/* Interactive Schematic Campus Map */}
      <CampusMapTeaser
        selectedPosId={selectedPosId}
        onSelectPos={handleSelectPosFromMap}
      />

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        <button
          type="button"
          onClick={() => setActiveChip('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeChip === 'all'
              ? 'bg-[#155E38] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-[#44574B] hover:border-slate-300'
          }`}
        >
          Semua Pos ({POS_SATPAM_LIST.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveChip('24hours')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeChip === '24hours'
              ? 'bg-[#155E38] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-[#44574B] hover:border-slate-300'
          }`}
        >
          Buka 24 Jam
        </button>
        <button
          type="button"
          onClick={() => setActiveChip('fst-lobby')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeChip === 'fst-lobby'
              ? 'bg-[#155E38] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-[#44574B] hover:border-slate-300'
          }`}
        >
          Lobby FST
        </button>
        <button
          type="button"
          onClick={() => setActiveChip('lab-terpadu')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeChip === 'lab-terpadu'
              ? 'bg-[#155E38] text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-[#44574B] hover:border-slate-300'
          }`}
        >
          Lab Terpadu
        </button>
      </div>

      {/* List of Pos Satpam Cards */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#14261B] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#155E38]" />
            Daftar Checkpoint Aktif ({filteredPosList.length})
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            3 Titik Terintegrasi QR
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {filteredPosList.map((pos) => {
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

      {/* Handover Standard Operating Procedure Guide */}
      <SopGuideCard />

      {/* Quick Tips */}
      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Tip Antigravity:</strong> Simpan tiket klaim Anda secara offline. Sistem tetap mengizinkan pengecekan OTP dan verifikasi fisik saat koneksi kampus sedang tidak stabil.
        </p>
      </div>
    </div>
  )
}
export default EksplorPage
