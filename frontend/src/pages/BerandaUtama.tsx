import React, { useState, useMemo } from 'react'
import { ChevronRight, Search, FileSearch, Camera, X } from 'lucide-react'
import type { ItemCategory, LostFoundItem, FilterCriteria } from '../types/lostFound'
import { INITIAL_ITEMS, CATEGORIES, POS_SATPAM_LIST } from '../data/mockItems'
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

  const activePosLabel = useMemo(() => {
    if (filterCriteria.posId === 'all') return null
    if (filterCriteria.posId === 'dibawa_penemu') return 'Dibawa Penemu'
    const p = POS_SATPAM_LIST.find((pos) => pos.id === filterCriteria.posId)
    return p ? p.name.replace('Pos Satpam ', '') : filterCriteria.posId
  }, [filterCriteria.posId])

  const activeDateLabel = useMemo(() => {
    switch (filterCriteria.dateRange) {
      case 'today':
        return 'Hari Ini (<24 Jam)'
      case '3days':
        return '3 Hari Terakhir'
      case '7days':
        return '7 Hari Terakhir'
      case '30days':
        return '30 Hari Terakhir'
      default:
        return null
    }
  }, [filterCriteria.dateRange])

  const activeCustodyLabel = useMemo(() => {
    if (filterCriteria.custody === 'pos_satpam') return 'Di Pos Satpam'
    if (filterCriteria.custody === 'dibawa_penemu') return 'Di Penemu'
    return null
  }, [filterCriteria.custody])

  const activeCategoryLabel = useMemo(() => {
    if (filterCriteria.category === 'all') return null
    const c = CATEGORIES.find((cat) => cat.id === filterCriteria.category)
    return c ? c.label : filterCriteria.category
  }, [filterCriteria.category])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterCriteria.category !== 'all') count++
    if (filterCriteria.posId !== 'all') count++
    if (filterCriteria.custody !== 'all') count++
    if (filterCriteria.dateRange !== 'all') count++
    return count
  }, [filterCriteria])

  const filteredItems = useMemo(() => {
    return INITIAL_ITEMS.filter((item) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchSearch =
          item.title.toLowerCase().includes(q) ||
          item.locationDetail.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q)
        if (!matchSearch) return false
      }

      // 2. Kategori
      if (filterCriteria.category !== 'all' && item.category !== filterCriteria.category) {
        return false
      }

      // 3. Custody Status
      if (filterCriteria.custody !== 'all' && item.custody !== filterCriteria.custody) {
        return false
      }

      // 4. Pos Satpam / Lokasi
      if (filterCriteria.posId !== 'all') {
        if (filterCriteria.posId === 'dibawa_penemu') {
          if (item.custody !== 'dibawa_penemu') return false
        } else if (item.posId !== filterCriteria.posId) {
          return false
        }
      }

      // 5. Rentang Waktu (Reference date: 2026-11-21T19:39:00Z)
      if (filterCriteria.dateRange !== 'all' && item.reportedDate) {
        const itemTime = new Date(item.reportedDate).getTime()
        const now = new Date('2026-11-21T19:39:00').getTime()
        const diffHours = (now - itemTime) / (1000 * 60 * 60)

        if (filterCriteria.dateRange === 'today' && diffHours > 24) return false
        if (filterCriteria.dateRange === '3days' && diffHours > 72) return false
        if (filterCriteria.dateRange === '7days' && diffHours > 168) return false
        if (filterCriteria.dateRange === '30days' && diffHours > 720) return false
      }

      return true
    })
  }, [filterCriteria, searchQuery])

  const handleResetFilters = () => {
    setFilterCriteria(DEFAULT_FILTER_CRITERIA)
    setSearchQuery('')
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
              <h3 className="text-sm font-bold text-[#14261B]">Barang Temuan Terbaru</h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#155E38] hover:text-[#0F4A2C] flex items-center gap-0.5"
              >
                Lihat Semua ({INITIAL_ITEMS.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feedback Status Filter / Pencarian Aktif */}
            {(searchQuery.trim() !== '' || activeFilterCount > 0) && (
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs text-[#14261B] text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#44574B]">
                    Menemukan <strong>{filteredItems.length}</strong> barang
                    {searchQuery.trim() && <> untuk "<strong>{searchQuery}</strong>"</>}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-[#155E38] hover:text-[#0F4A2C]"
                  >
                    Reset Semua
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                  {searchQuery.trim() && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[#14261B] text-[10px] font-medium border border-slate-200">
                      Kata kunci: "{searchQuery}"
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="hover:text-red-600 ml-0.5"
                        aria-label="Hapus filter kata kunci"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {activeCategoryLabel && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E4F1E8] text-[#0F4A2C] text-[10px] font-bold border border-[#155E38]/20">
                      {activeCategoryLabel}
                      <button
                        type="button"
                        onClick={() => setFilterCriteria((p) => ({ ...p, category: 'all' }))}
                        className="hover:text-red-700 ml-0.5"
                        aria-label="Hapus filter kategori"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {activePosLabel && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E4F1E8] text-[#0F4A2C] text-[10px] font-bold border border-[#155E38]/20">
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E4F1E8] text-[#0F4A2C] text-[10px] font-bold border border-[#155E38]/20">
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E4F1E8] text-[#0F4A2C] text-[10px] font-bold border border-[#155E38]/20">
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
        {showQuickReportSheet && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex flex-col">
                  <h4 className="text-base font-bold text-[#14261B]">Pilih Jenis Laporan</h4>
                  <p className="text-xs text-[#44574B]">Pilih layanan cepat Lost &amp; Found FST</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickReportSheet(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickReportSheet(false)
                    if (onNavigateToLapor) onNavigateToLapor('lost')
                  }}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#155E38]/20 bg-[#E4F1E8]/50 hover:bg-[#E4F1E8] text-left transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#155E38] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F4A2C]">
                    <FileSearch className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#0F4A2C]">Lapor Barang Hilang</span>
                    <span className="text-[11px] text-[#44574B]">Saya kehilangan barang di area kampus</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowQuickReportSheet(false)
                    if (onNavigateToLapor) onNavigateToLapor('found')
                  }}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#155E38] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Camera className="w-5 h-5 text-[#155E38]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#14261B]">Lapor Barang Temuan</span>
                    <span className="text-[11px] text-[#44574B]">Saya menemukan barang milik orang lain</span>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowQuickReportSheet(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 mt-1"
              >
                Batal
              </button>
            </div>
          </div>
        )}

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
          onFilterByPos={(posName) => {
            const matchedPos = POS_SATPAM_LIST.find(
              (p) => posName.includes(p.code) || posName.includes(p.name)
            )
            if (matchedPos) {
              setFilterCriteria((prev) => ({ ...prev, posId: matchedPos.id }))
            } else {
              setSearchQuery(posName)
            }
          }}
        />

        {/* Modal Cek Tiket & Status Klaim */}
        <CekKlaimModal
          isOpen={showCekKlaimModal}
          onClose={() => setShowCekKlaimModal(false)}
          onNavigateToPos={(posName) => {
            const matchedPos = POS_SATPAM_LIST.find(
              (p) => posName.includes(p.code) || posName.includes(p.name)
            )
            if (matchedPos) {
              setFilterCriteria((prev) => ({ ...prev, posId: matchedPos.id }))
            } else {
              setSearchQuery(posName)
            }
          }}
        />

        {/* Modal Radar AI Match */}
        <AiMatchModal
          isOpen={showAiMatchModal}
          onClose={() => setShowAiMatchModal(false)}
          onClaimSuccess={() => {
            setShowCekKlaimModal(true)
          }}
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
