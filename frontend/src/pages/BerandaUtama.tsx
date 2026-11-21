import React, { useState, useMemo } from 'react'
import { ChevronRight, Search, X } from 'lucide-react'
import type { ItemCategory, LostFoundItem, FilterCriteria } from '../types/lostFound'
import { INITIAL_ITEMS, POS_SATPAM_LIST, filterLostFoundItems } from '../data/mockItems'
import { DEFAULT_FILTER_CRITERIA } from '../types/lostFound'
import { HomeHeader } from '../components/home/HomeHeader'
import { SearchBar } from '../components/home/SearchBar'
import { QuickActions } from '../components/home/QuickActions'
import { DiscoveryBanner } from '../components/home/DiscoveryBanner'
import { CategoryChips } from '../components/home/CategoryChips'
import { ItemCard } from '../components/home/ItemCard'
import { ItemDetailModal } from '../components/home/ItemDetailModal'
import { StewardshipCard } from '../components/home/StewardshipCard'
import { BottomNav, type TabId } from '../components/home/BottomNav'
import { ActionModal } from '../components/modals/ActionModal'
import { ScanQrModal } from '../components/modals/ScanQrModal'
import { CekKlaimModal } from '../components/modals/CekKlaimModal'
import { AiMatchModal } from '../components/modals/AiMatchModal'
import { FilterModal } from '../components/modals/FilterModal'
import { QuickReportSheet } from '../components/modals/QuickReportSheet'

interface BerandaUtamaProps {
  onNavigateToLapor?: (type: 'lost' | 'found') => void
}

export const BerandaUtama: React.FC<BerandaUtamaProps> = ({ onNavigateToLapor }) => {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(DEFAULT_FILTER_CRITERIA)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('beranda')
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null)
  const [showDiscoveryBanner, setShowDiscoveryBanner] = useState(true)
  const [showQuickReportSheet, setShowQuickReportSheet] = useState(false)
  const [showScanQrModal, setShowScanQrModal] = useState(false)
  const [showCekKlaimModal, setShowCekKlaimModal] = useState(false)
  const [showAiMatchModal, setShowAiMatchModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)

  const selectedCategory = filterCriteria.category
  const handleSelectCategory = (cat: ItemCategory) => {
    setFilterCriteria((prev) => ({ ...prev, category: cat }))
  }

  const activePosLabel = filterCriteria.posId !== 'all'
    ? (filterCriteria.posId === 'dibawa_penemu'
        ? 'Dibawa Penemu'
        : POS_SATPAM_LIST.find((p) => p.id === filterCriteria.posId)?.name.replace('Pos Satpam ', '') || filterCriteria.posId)
    : null

  const activeDateLabel =
    filterCriteria.dateRange === 'today'
      ? 'Hari Ini (<24 Jam)'
      : filterCriteria.dateRange === '3days'
      ? '3 Hari Terakhir'
      : filterCriteria.dateRange === '7days'
      ? '7 Hari Terakhir'
      : filterCriteria.dateRange === '30days'
      ? '30 Hari Terakhir'
      : null

  const activeCustodyLabel =
    filterCriteria.custody === 'pos_satpam'
      ? 'Di Pos Satpam'
      : filterCriteria.custody === 'dibawa_penemu'
      ? 'Di Penemu'
      : null

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterCriteria.category !== 'all') count++
    if (filterCriteria.posId !== 'all') count++
    if (filterCriteria.custody !== 'all') count++
    if (filterCriteria.dateRange !== 'all') count++
    return count
  }, [filterCriteria])

  const isFiltered = searchQuery.trim() !== '' || activeFilterCount > 0
  const hasHiddenFilters =
    searchQuery.trim() !== '' ||
    filterCriteria.posId !== 'all' ||
    filterCriteria.custody !== 'all' ||
    filterCriteria.dateRange !== 'all'

  const filteredItems = useMemo(() => {
    return filterLostFoundItems(INITIAL_ITEMS, filterCriteria, searchQuery)
  }, [filterCriteria, searchQuery])

  const handleResetFilters = () => {
    setFilterCriteria(DEFAULT_FILTER_CRITERIA)
    setSearchQuery('')
  }

  const handleFilterByPosName = (posName: string) => {
    const matched = POS_SATPAM_LIST.find(
      (p) => posName.includes(p.code) || posName.includes(p.name)
    )
    if (matched) {
      setFilterCriteria((prev) => ({ ...prev, posId: matched.id }))
    } else {
      setSearchQuery(posName)
    }
  }

  const handleActionClick = (title: string) => {
    if (title === 'Lapor Barang Hilang') {
      if (onNavigateToLapor) onNavigateToLapor('lost')
    } else if (title === 'Lapor Barang Temuan') {
      if (onNavigateToLapor) onNavigateToLapor('found')
    } else if (title === 'Scan QR Pos Satpam') {
      setShowScanQrModal(true)
    } else if (title === 'Cek Status Klaim') {
      setShowCekKlaimModal(true)
    } else if (title === 'Pencocokan AI Multimodal') {
      setShowAiMatchModal(true)
    } else {
      setActiveActionModal(title)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#14261B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center">
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.06)]">
        <HomeHeader onNotificationClick={() => setActiveActionModal('Notifikasi')} />

        <main className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterClick={() => setShowFilterModal(true)}
            activeFilterCount={activeFilterCount}
          />

          <QuickActions onActionClick={handleActionClick} />

          {showDiscoveryBanner && (
            <DiscoveryBanner onDismiss={() => setShowDiscoveryBanner(false)} />
          )}

          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            totalCount={filteredItems.length}
          />

          {/* Grid Barang Temuan */}
          <section className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-0.5">
              <h3 className="text-sm font-bold text-[#14261B]">
                {isFiltered ? `Hasil Temuan (${filteredItems.length})` : 'Barang Temuan Terbaru'}
              </h3>
              {isFiltered ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#155E38] hover:text-[#0F4A2C] transition-colors"
                >
                  Reset Filter
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#155E38] hover:text-[#0F4A2C] flex items-center gap-0.5"
                >
                  Lihat Semua ({INITIAL_ITEMS.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Micro-pills hanya jika ada filter spesifik dari modal/pencarian */}
            {hasHiddenFilters && (
              <div className="flex flex-wrap items-center gap-1.5 px-0.5 animate-in fade-in duration-150">
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[#14261B] text-[11px] font-medium border border-slate-200">
                    "{searchQuery}"
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-700 ml-0.5"
                      aria-label="Hapus filter kata kunci"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {activePosLabel && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] text-[11px] font-semibold border border-[#155E38]/20">
                    Pos: {activePosLabel}
                    <button
                      type="button"
                      onClick={() => setFilterCriteria((p) => ({ ...p, posId: 'all' }))}
                      className="hover:text-red-700 ml-0.5"
                      aria-label="Hapus filter pos"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {activeCustodyLabel && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] text-[11px] font-semibold border border-[#155E38]/20">
                    {activeCustodyLabel}
                    <button
                      type="button"
                      onClick={() => setFilterCriteria((p) => ({ ...p, custody: 'all' }))}
                      className="hover:text-red-700 ml-0.5"
                      aria-label="Hapus filter status fisik"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {activeDateLabel && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#0F4A2C] text-[11px] font-semibold border border-[#155E38]/20">
                    Waktu: {activeDateLabel}
                    <button
                      type="button"
                      onClick={() => setFilterCriteria((p) => ({ ...p, dateRange: 'all' }))}
                      className="hover:text-red-700 ml-0.5"
                      aria-label="Hapus filter waktu"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#14261B]">Tidak ada barang ditemukan</p>
                <p className="text-xs text-[#44574B] mt-1 max-w-xs">
                  Coba kata kunci lain atau reset filter untuk melihat daftar lengkap.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-1.5 rounded-full bg-[#155E38] text-white text-xs font-medium hover:bg-[#0F4A2C]"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </section>

          <StewardshipCard />
        </main>

        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            if (tab === 'cocok-ai') {
              setShowAiMatchModal(true)
            }
          }}
          onPlusClick={() => setShowQuickReportSheet(true)}
        />

        {/* Quick Report Bottom Sheet */}
        <QuickReportSheet
          isOpen={showQuickReportSheet}
          onClose={() => setShowQuickReportSheet(false)}
          onSelectType={(type) => onNavigateToLapor?.(type)}
        />

        <ActionModal
          title={activeActionModal}
          onClose={() => setActiveActionModal(null)}
        />

        {/* Modal Detail Barang Temuan */}
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        {/* Modal Scanner QR Pos Satpam */}
        <ScanQrModal
          isOpen={showScanQrModal}
          onClose={() => setShowScanQrModal(false)}
          onTitipBarang={() => onNavigateToLapor?.('found')}
          onFilterByPos={handleFilterByPosName}
        />

        {/* Modal Cek Tiket & Status Klaim */}
        <CekKlaimModal
          isOpen={showCekKlaimModal}
          onClose={() => setShowCekKlaimModal(false)}
          onNavigateToPos={handleFilterByPosName}
        />

        {/* Modal Radar AI Match */}
        <AiMatchModal
          isOpen={showAiMatchModal}
          onClose={() => setShowAiMatchModal(false)}
          onClaimSuccess={() => setShowCekKlaimModal(true)}
        />

        {/* Modal Filter Lanjutan */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          currentCriteria={filterCriteria}
          onApply={(newCriteria) => setFilterCriteria(newCriteria)}
          onReset={() => setFilterCriteria(DEFAULT_FILTER_CRITERIA)}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
}

export default BerandaUtama
