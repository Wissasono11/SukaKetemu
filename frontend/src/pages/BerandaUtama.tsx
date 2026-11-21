import React, { useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import type { LostFoundItem } from '../types/lostFound'
import { DEFAULT_FILTER_CRITERIA } from '../types/lostFound'
import { INITIAL_ITEMS, POS_SATPAM_LIST } from '../data/mockItems'
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications'
import { useLostFoundFilter } from '../hooks/useLostFoundFilter'
import { HomeHeader } from '../components/home/HomeHeader'
import { SearchBar } from '../components/home/SearchBar'
import { QuickActions } from '../components/home/QuickActions'
import { DiscoveryBanner } from '../components/home/DiscoveryBanner'
import { CategoryChips } from '../components/home/CategoryChips'
import { ActiveFilterTags } from '../components/home/ActiveFilterTags'
import { ItemCard } from '../components/home/ItemCard'
import { ItemDetailModal } from '../components/home/ItemDetailModal'
import { StewardshipCard } from '../components/home/StewardshipCard'
import { BottomNav, type TabId } from '../components/home/BottomNav'
import { ScanQrModal } from '../components/modals/ScanQrModal'
import { CekKlaimModal } from '../components/modals/CekKlaimModal'
import { AiMatchModal } from '../components/modals/AiMatchModal'
import { FilterModal } from '../components/modals/FilterModal'
import { QuickReportSheet } from '../components/modals/QuickReportSheet'
import { NotificationDrawer, type AppNotification } from '../components/modals/NotificationDrawer'

interface BerandaUtamaProps {
  onNavigateToLapor?: (type: 'lost' | 'found') => void
}

export const BerandaUtama: React.FC<BerandaUtamaProps> = ({ onNavigateToLapor }) => {
  const {
    criteria: filterCriteria,
    setCriteria: setFilterCriteria,
    searchQuery,
    setSearchQuery,
    setCategory: handleSelectCategory,
    filteredItems,
    labels: { activeCount, posLabel, dateLabel, custodyLabel },
    isFiltered,
    resetFilters: handleResetFilters,
    filterByPosName: handleFilterByPosName,
  } = useLostFoundFilter(INITIAL_ITEMS, POS_SATPAM_LIST)

  const [activeTab, setActiveTab] = useState<TabId>('beranda')
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false)
  const [showDiscoveryBanner, setShowDiscoveryBanner] = useState(true)
  const [showQuickReportSheet, setShowQuickReportSheet] = useState(false)
  const [showScanQrModal, setShowScanQrModal] = useState(false)
  const [showCekKlaimModal, setShowCekKlaimModal] = useState(false)
  const [showAiMatchModal, setShowAiMatchModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)

  const hasUnreadNotifications = notifications.some((n) => !n.isRead)

  const handleActionClick = (title: string) => {
    switch (title) {
      case 'Lapor Barang Hilang':
        onNavigateToLapor?.('lost')
        break
      case 'Lapor Barang Temuan':
        onNavigateToLapor?.('found')
        break
      case 'Scan QR Pos Satpam':
        setShowScanQrModal(true)
        break
      case 'Cek Status Klaim':
        setShowCekKlaimModal(true)
        break
      case 'Pencocokan AI Multimodal':
        setShowAiMatchModal(true)
        break
      case 'Notifikasi':
        setShowNotificationDrawer(true)
        break
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#14261B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center">
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.06)]">
        <HomeHeader
          onNotificationClick={() => setShowNotificationDrawer(true)}
          hasUnread={hasUnreadNotifications}
        />

        <main className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterClick={() => setShowFilterModal(true)}
            activeFilterCount={activeCount}
          />

          <QuickActions onActionClick={handleActionClick} />

          {showDiscoveryBanner && (
            <DiscoveryBanner onDismiss={() => setShowDiscoveryBanner(false)} />
          )}

          <CategoryChips
            selectedCategory={filterCriteria.category}
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

            {/* Pill Tags Filter Tersembunyi */}
            <ActiveFilterTags
              searchQuery={searchQuery}
              posLabel={posLabel}
              custodyLabel={custodyLabel}
              dateLabel={dateLabel}
              onClearQuery={() => setSearchQuery('')}
              onClearPos={() => setFilterCriteria((p) => ({ ...p, posId: 'all' }))}
              onClearCustody={() => setFilterCriteria((p) => ({ ...p, custody: 'all' }))}
              onClearDate={() => setFilterCriteria((p) => ({ ...p, dateRange: 'all' }))}
            />

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

        {/* Drawer Notifikasi */}
        <NotificationDrawer
          isOpen={showNotificationDrawer}
          onClose={() => setShowNotificationDrawer(false)}
          notifications={notifications}
          onMarkAllAsRead={() => setNotifications((p) => p.map((n) => ({ ...n, isRead: true })))}
          onSelectNotification={(item) => {
            setNotifications((p) =>
              p.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
            )
            setShowNotificationDrawer(false)
            if (item.actionTarget === 'aimatch') setShowAiMatchModal(true)
            if (item.actionTarget === 'claim') setShowCekKlaimModal(true)
          }}
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
