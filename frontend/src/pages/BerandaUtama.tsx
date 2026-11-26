import React, { useState, useEffect, lazy, Suspense } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import type { AiMatchItem, ClaimTicket, LostFoundItem } from '../types/lostFound'
import { DEFAULT_FILTER_CRITERIA } from '../types/lostFound'
import { INITIAL_ITEMS, INITIAL_AI_MATCHES, POS_SATPAM_LIST, INITIAL_CLAIM_TICKETS } from '../data/mockItems'
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications'
import { useLostFoundFilter } from '../hooks/useLostFoundFilter'
import { HomeHeader } from '../components/home/HomeHeader'
import { OfflineStatusBanner } from '../components/common/OfflineStatusBanner'
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
import { CekKlaimModal } from '../components/modals/CekKlaimModal'
import { ChallengeResponseModal } from '../components/modals/claim/ChallengeResponseModal'
import { getClaimTickets, saveClaimTicket, updateClaimTicketStatus } from '../services/userDataService'
import { FilterModal } from '../components/modals/FilterModal'
import { QuickReportSheet } from '../components/modals/QuickReportSheet'
import { NotificationDrawer, type AppNotification } from '../components/modals/NotificationDrawer'
import { EksplorPage } from './EksplorPage'
import { ProfilePage } from './ProfilePage'
import { AiMatchSkeleton } from '../components/modals/aimatch/AiMatchSkeleton'

const CocokAiPage = lazy(() =>
  import('./CocokAiPage').then((m) => ({ default: m.CocokAiPage }))
)

const ScanQrModal = lazy(() =>
  import('../components/modals/ScanQrModal').then((m) => ({ default: m.ScanQrModal }))
)

type ActiveModal = 'quickReport' | 'scanQr' | 'cekKlaim' | 'filter' | 'notification' | null

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
  const [modal, setModal] = useState<ActiveModal>(null)
  const [selectedPosForMap, setSelectedPosForMap] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)
  const [challengeItem, setChallengeItem] = useState<LostFoundItem | null>(null)
  const [pendingClaimMatchId, setPendingClaimMatchId] = useState<string | null>(null)
  const [aiMatches, setAiMatches] = useState<AiMatchItem[]>(INITIAL_AI_MATCHES)
  const [showDiscoveryBanner, setShowDiscoveryBanner] = useState(true)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const [claimTickets, setClaimTickets] = useState<ClaimTicket[]>(INITIAL_CLAIM_TICKETS)

  useEffect(() => {
    getClaimTickets().then((loaded) => {
      if (loaded.length > 0) setClaimTickets(loaded)
    })
  }, [])

  // Quick action dispatcher map
  const actionHandlers: Record<string, () => void> = {
    'Lapor Barang Hilang': () => onNavigateToLapor?.('lost'),
    'Lapor Barang Temuan': () => onNavigateToLapor?.('found'),
    'Scan QR Pos Satpam': () => setModal('scanQr'),
    'Cek Status Klaim': () => setModal('cekKlaim'),
    'Pencocokan AI Multimodal': () => setActiveTab('cocok-ai'),
  }

  const handleRequestAiMatchClaim = (match: AiMatchItem) => {
    const existingItem = INITIAL_ITEMS.find((it) => it.id === match.foundItemId)
    const targetItem: LostFoundItem = existingItem ?? {
      id: match.foundItemId,
      title: match.foundItemTitle,
      category: match.foundItemCategory,
      categoryLabel: match.foundItemCategoryLabel,
      imageUrl: match.foundItemImageUrl,
      imageAlt: match.foundItemTitle,
      custody: match.custody,
      locationDetail:
        match.custody === 'pos_satpam'
          ? `${match.custodyPos || 'Pos Satpam FST'} • ${match.foundLocation}`
          : `Dibawa Penemu • ${match.foundLocation}`,
      isPrivacySensitive: match.isPrivacySensitive,
    }
    setPendingClaimMatchId(match.id)
    setChallengeItem(targetItem)
  }

  const unresolvedAiMatchCount = aiMatches.filter((m) => m.status === 'unresolved').length

  const handleTicketsChange = (updated: ClaimTicket[]) => {
    setClaimTickets(updated)
    updated.forEach((t) => updateClaimTicketStatus(t.id, t.status, t.statusLabel))
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#14261B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center">
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.06)]">
        <HomeHeader
          onNotificationClick={() => setModal('notification')}
          hasUnread={notifications.some((n) => !n.isRead)}
        />
        <OfflineStatusBanner />

        {activeTab === 'beranda' && (
          <main className="flex-1 px-4 pt-4 pb-28 flex flex-col gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onFilterClick={() => setModal('filter')}
              activeFilterCount={activeCount}
            />

            <QuickActions onActionClick={(title) => actionHandlers[title]?.()} />

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
            initialSelectedPosId={selectedPosForMap}
            onNavigateToPos={(posName) => {
              handleFilterByPosName(posName)
              setActiveTab('beranda')
            }}
            onScanQr={() => setModal('scanQr')}
          />
        )}

        {activeTab === 'cocok-ai' && (
          <Suspense
            fallback={
              <main className="flex-1 px-4 pt-4 pb-24">
                <AiMatchSkeleton showHeader showTabs />
              </main>
            }
          >
            <CocokAiPage
              matches={aiMatches}
              onRejectMatch={(matchId) =>
                setAiMatches((prev) =>
                  prev.map((m) => (m.id === matchId ? { ...m, status: 'rejected' as const } : m))
                )
              }
              onRequestClaim={handleRequestAiMatchClaim}
              onNavigateToLapor={onNavigateToLapor}
              onBrowseBeranda={() => setActiveTab('beranda')}
            />
          </Suspense>
        )}

        {activeTab === 'profil' && (
          <ProfilePage
            onNavigateToLapor={onNavigateToLapor}
            onOpenAiMatch={() => setActiveTab('cocok-ai')}
            onNavigateToPos={(posName) => {
              const matched = POS_SATPAM_LIST.find((p) => p.name === posName || posName.includes(p.name) || p.name.includes(posName))
              setSelectedPosForMap(matched ? matched.id : null)
              setActiveTab('eksplor')
            }}
          />
        )}

        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onPlusClick={() => setModal('quickReport')}
          aiMatchCount={unresolvedAiMatchCount}
        />

        {/* Quick Report Bottom Sheet */}
        <QuickReportSheet
          isOpen={modal === 'quickReport'}
          onClose={() => setModal(null)}
          onSelectType={(type) => onNavigateToLapor?.(type)}
        />

        {/* Drawer Notifikasi */}
        <NotificationDrawer
          isOpen={modal === 'notification'}
          onClose={() => setModal(null)}
          notifications={notifications}
          onMarkAllAsRead={() => setNotifications((p) => p.map((n) => ({ ...n, isRead: true })))}
          onSelectNotification={(item) => {
            setNotifications((p) => p.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)))
            if (item.actionTarget === 'aimatch') {
              setModal(null)
              setActiveTab('cocok-ai')
            } else {
              setModal(item.actionTarget === 'claim' ? 'cekKlaim' : null)
            }
          }}
        />

        {/* Modal Detail Barang Temuan */}
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRequestChallengeClaim={(item) => {
            setSelectedItem(null)
            setPendingClaimMatchId(null)
            setChallengeItem(item)
          }}
        />

        {/* Modal Interaktif Challenge-Response Verifikasi Klaim */}
        <ChallengeResponseModal
          isOpen={!!challengeItem}
          item={challengeItem}
          onClose={() => {
            setChallengeItem(null)
            setPendingClaimMatchId(null)
          }}
          onSuccess={async (newTicket) => {
            await saveClaimTicket(newTicket)
            setClaimTickets((prev) => [newTicket, ...prev])
            if (pendingClaimMatchId) {
              setAiMatches((prev) =>
                prev.map((m) =>
                  m.id === pendingClaimMatchId ? { ...m, status: 'claimed' as const } : m
                )
              )
              setPendingClaimMatchId(null)
            }
            setModal('cekKlaim')
          }}
        />

        {/* Modal Scanner QR Pos Satpam */}
        {modal === 'scanQr' && (
          <Suspense fallback={null}>
            <ScanQrModal
              isOpen={true}
              onClose={() => setModal(null)}
              onTitipBarang={() => onNavigateToLapor?.('found')}
              onFilterByPos={handleFilterByPosName}
            />
          </Suspense>
        )}

        {/* Modal Cek Tiket & Status Klaim */}
        <CekKlaimModal
          isOpen={modal === 'cekKlaim'}
          onClose={() => setModal(null)}
          onNavigateToPos={(posName) => {
            // Find pos ID and navigate straight to Eksplor campus map
            const matched = POS_SATPAM_LIST.find((p) => p.name === posName || posName.includes(p.name) || p.name.includes(posName))
            setSelectedPosForMap(matched ? matched.id : null)
            setActiveTab('eksplor')
            setModal(null)
          }}
          tickets={claimTickets}
          onTicketsChange={handleTicketsChange}
        />

        {/* Modal Filter Lanjutan */}
        <FilterModal
          isOpen={modal === 'filter'}
          onClose={() => setModal(null)}
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
