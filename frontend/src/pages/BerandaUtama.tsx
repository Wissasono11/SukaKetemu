import React, { useState, useMemo } from 'react'
import { ChevronRight, Search, FileSearch, Camera, X } from 'lucide-react'
import type { ItemCategory, LostFoundItem } from '../types/lostFound'
import { INITIAL_ITEMS } from '../data/mockItems'
import { HomeHeader } from '../components/home/HomeHeader'
import { SearchBar } from '../components/home/SearchBar'
import { QuickActions } from '../components/home/QuickActions'
import { DiscoveryBanner } from '../components/home/DiscoveryBanner'
import { CategoryChips } from '../components/home/CategoryChips'
import { ItemCard } from '../components/home/ItemCard'
import { ItemDetailModal } from '../components/home/ItemDetailModal'
import { ScanQrModal } from '../components/home/ScanQrModal'
import { StewardshipCard } from '../components/home/StewardshipCard'
import { BottomNav, type TabId } from '../components/home/BottomNav'
import { ActionModal } from '../components/home/ActionModal'

interface BerandaUtamaProps {
  onNavigateToLapor?: (type: 'lost' | 'found') => void
}

export const BerandaUtama: React.FC<BerandaUtamaProps> = ({ onNavigateToLapor }) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('beranda')
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null)
  const [showDiscoveryBanner, setShowDiscoveryBanner] = useState(true)
  const [showQuickReportSheet, setShowQuickReportSheet] = useState(false)
  const [showScanQrModal, setShowScanQrModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)

  const filteredItems = useMemo(() => {
    return INITIAL_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locationDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const handleActionClick = (title: string) => {
    if (title === 'Lapor Barang Hilang') {
      if (onNavigateToLapor) onNavigateToLapor('lost')
    } else if (title === 'Lapor Barang Temuan') {
      if (onNavigateToLapor) onNavigateToLapor('found')
    } else if (title === 'Scan QR Pos Satpam') {
      setShowScanQrModal(true)
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
            onFilterClick={() => setActiveActionModal('Filter Lanjutan')}
          />

          <QuickActions onActionClick={handleActionClick} />

          {showDiscoveryBanner && (
            <DiscoveryBanner onDismiss={() => setShowDiscoveryBanner(false)} />
          )}

          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totalCount={filteredItems.length}
          />

          {/* Grid Barang Temuan */}
          <section className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-0.5">
              <h3 className="text-sm font-bold text-[#14261B]">Barang Temuan Terbaru</h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="text-xs font-semibold text-[#155E38] hover:text-[#0F4A2C] flex items-center gap-0.5"
              >
                Lihat Semua ({INITIAL_ITEMS.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feedback Status Filter / Pencarian Aktif */}
            {(searchQuery.trim() !== '' || selectedCategory !== 'all') && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/90 border border-slate-200/60 text-xs text-[#14261B]">
                <span className="truncate mr-2">
                  Menampilkan <strong>{filteredItems.length}</strong> barang
                  {searchQuery.trim() && (
                    <> untuk "<strong>{searchQuery}</strong>"</>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="text-[#44574B]"> (kategori: {selectedCategory})</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="text-xs font-bold text-[#155E38] hover:text-[#0F4A2C] whitespace-nowrap"
                >
                  Reset
                </button>
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[#14261B]">Tidak ada barang ditemukan</p>
                <p className="text-xs text-[#44574B] mt-1 max-w-xs">
                  Coba kata kunci lain atau pilih kategori "Semua" untuk melihat daftar lengkap.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchQuery('')
                  }}
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
          onTabChange={setActiveTab}
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
            const query = posName.includes('Lobby')
              ? 'Pos Utama'
              : posName.includes('Barat')
              ? 'Gerbang Barat'
              : 'Lab Terpadu'
            setSearchQuery(query)
          }}
        />
      </div>
    </div>
  )
}

export default BerandaUtama
