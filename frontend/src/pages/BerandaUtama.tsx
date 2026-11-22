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
import { ItemCardSkeleton } from '../components/home/ItemCardSkeleton'
import { ItemDetailModal } from '../components/home/ItemDetailModal'
import { StewardshipCard } from '../components/home/StewardshipCard'
import { BottomNav, type TabId } from '../components/home/BottomNav'
import { ScanQrModal } from '../components/modals/ScanQrModal'
import { CekKlaimModal } from '../components/modals/CekKlaimModal'
import { AiMatchModal } from '../components/modals/AiMatchModal'
import { FilterModal } from '../components/modals/FilterModal'
import { QuickReportSheet } from '../components/modals/QuickReportSheet'
import { NotificationDrawer, type AppNotification } from '../components/modals/NotificationDrawer'
import { EksplorPage } from './EksplorPage'
import { ShieldCheck, Ticket } from 'lucide-react'

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
    isLoading,
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

        {activeTab === 'beranda' && (
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

              {isLoading ? (
                <div
                  className="grid grid-cols-2 gap-3"
                  aria-busy="true"
                  aria-label="Memuat daftar barang temuan"
                >
                  <ItemCardSkeleton count={4} />
                </div>
              ) : filteredItems.length === 0 ? (
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
        )}

        {activeTab === 'eksplor' && (
          <EksplorPage
            onNavigateToPos={(posName) => {
              handleFilterByPosName(posName)
              setActiveTab('beranda')
            }}
            onScanQr={() => setShowScanQrModal(true)}
          />
        )}

        {activeTab === 'profil' && (
          <main className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-4 text-left">
            <section className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#E4F1E8] text-[#155E38] flex items-center justify-center font-bold text-lg border border-[#155E38]/20 shadow-2xs">
                  BW
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-extrabold text-[#14261B]">Bayu Wicaksono</h3>
                  <span className="text-xs text-slate-500 font-mono">NIM: 23106050012</span>
                  <span className="text-[11px] text-[#155E38] font-semibold mt-0.5">
                    Teknik Informatika &bull; FST UIN Sunan Kalijaga
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCekKlaimModal(true)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <Ticket className="w-4 h-4 text-[#155E38]" />
                    <span className="text-xs font-bold text-[#155E38]">2 Tiket</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#14261B]">Status Klaim</span>
                  <span className="text-[10px] text-slate-500">Tiket QR &amp; OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAiMatchModal(true)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                    <span className="text-xs font-bold text-[#C59B27]">3 Cocok</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#14261B]">Radar AI</span>
                  <span className="text-[10px] text-slate-500">Pencocokan Cerdas</span>
                </button>
              </div>
            </section>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#14261B]">Akun Terverifikasi SSO UIN</span>
              <p className="text-[11px] text-[#44574B] leading-relaxed">
                Akun terhubung dengan Sistem Informasi Akademik (SIA) UIN Sunan Kalijaga Yogyakarta. Data kepemilikan barang dilindungi UU Perlindungan Data Pribadi (UU PDP).
              </p>
            </div>
          </main>
        )}

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
