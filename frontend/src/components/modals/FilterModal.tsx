import React, { useState, useMemo, useEffect } from 'react'
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Shield,
  User,
  Calendar,
  Layers,
  Check,
  Headphones,
  FileText,
  CupSoda,
  Briefcase,
  Shapes,
  LayoutGrid,
} from 'lucide-react'
import type {
  FilterCriteria,
  ItemCategory,
  DateRangeOption,
  LostFoundItem,
} from '../../types/lostFound'
import {
  CATEGORIES,
  POS_SATPAM_LIST,
  INITIAL_ITEMS,
} from '../../data/mockItems'
import { DEFAULT_FILTER_CRITERIA } from '../../types/lostFound'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  currentCriteria: FilterCriteria
  onApply: (criteria: FilterCriteria) => void
  onReset: () => void
  searchQuery?: string
}

const renderCategoryIcon = (category: ItemCategory, className: string) => {
  switch (category) {
    case 'all':
      return <LayoutGrid className={className} />
    case 'elektronik':
      return <Headphones className={className} />
    case 'dokumen':
      return <FileText className={className} />
    case 'botol':
      return <CupSoda className={className} />
    case 'tas':
      return <Briefcase className={className} />
    case 'ibadah':
      return <Layers className={className} />
    case 'lainnya':
      return <Shapes className={className} />
    default:
      return null
  }
}

const DATE_OPTIONS: { id: DateRangeOption; label: string; sub: string }[] = [
  { id: 'all', label: 'Semua Waktu', sub: 'Semua laporan' },
  { id: 'today', label: 'Hari Ini', sub: '< 24 Jam' },
  { id: '3days', label: '3 Hari', sub: 'Terakhir' },
  { id: '7days', label: '7 Hari', sub: '1 Minggu' },
  { id: '30days', label: '30 Hari', sub: '1 Bulan' },
]

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  currentCriteria,
  onApply,
  onReset,
  searchQuery = '',
}) => {
  const [temp, setTemp] = useState<FilterCriteria>(currentCriteria)

  // Sinkronisasi saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setTemp(currentCriteria)
    }
  }, [isOpen, currentCriteria])

  // Hitung jumlah filter yang sedang aktif dari default
  const activeCount = useMemo(() => {
    let count = 0
    if (temp.category !== 'all') count++
    if (temp.posId !== 'all') count++
    if (temp.custody !== 'all') count++
    if (temp.dateRange !== 'all') count++
    return count
  }, [temp])

  // Menghitung preview jumlah barang yang cocok secara real-time
  const previewMatches = useMemo(() => {
    return INITIAL_ITEMS.filter((item: LostFoundItem) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.locationDetail.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q)
        if (!matchesQuery) return false
      }

      // 2. Kategori
      if (temp.category !== 'all' && item.category !== temp.category) {
        return false
      }

      // 3. Custody Status
      if (temp.custody !== 'all' && item.custody !== temp.custody) {
        return false
      }

      // 4. Pos Satpam / Lokasi
      if (temp.posId !== 'all') {
        if (temp.posId === 'dibawa_penemu') {
          if (item.custody !== 'dibawa_penemu') return false
        } else if (item.posId !== temp.posId) {
          return false
        }
      }

      // 5. Rentang Waktu (Reference date: 2026-11-21T19:39:00Z)
      if (temp.dateRange !== 'all' && item.reportedDate) {
        const itemTime = new Date(item.reportedDate).getTime()
        const now = new Date('2026-11-21T19:39:00').getTime()
        const diffHours = (now - itemTime) / (1000 * 60 * 60)

        if (temp.dateRange === 'today' && diffHours > 24) return false
        if (temp.dateRange === '3days' && diffHours > 72) return false
        if (temp.dateRange === '7days' && diffHours > 168) return false
        if (temp.dateRange === '30days' && diffHours > 720) return false
      }

      return true
    })
  }, [temp, searchQuery])

  if (!isOpen) return null

  const handleResetInternal = () => {
    setTemp(DEFAULT_FILTER_CRITERIA)
  }

  const handleApply = () => {
    onApply(temp)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 text-left">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E4F1E8] text-[#155E38] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#14261B]">Filter Pencarian</h3>
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#155E38] text-white text-[10px] font-extrabold">
                    {activeCount} Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#44574B]">Kategori, pos satpam &amp; rentang waktu</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleResetInternal}
                className="text-xs font-semibold text-[#155E38] hover:text-[#0F4A2C] px-2 py-1 rounded-md transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup filter"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 text-left">
          {/* Section 1: Kategori Barang */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#14261B]">
              Kategori Barang
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = temp.category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, category: cat.id }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      isSelected
                        ? 'bg-[#155E38] text-white border-[#155E38] shadow-xs'
                        : 'bg-white text-[#44574B] border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {renderCategoryIcon(
                      cat.id,
                      `w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#155E38]'}`
                    )}
                    <span className="truncate">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Pos Satpam / Tempat Penyimpanan */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14261B]">
                Pos Satpam &amp; Penyimpanan
              </label>
              <span className="text-[10px] text-[#44574B]">Kampus FST UIN</span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Option: Semua Lokasi */}
              <button
                type="button"
                onClick={() => setTemp((prev) => ({ ...prev, posId: 'all' }))}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                  temp.posId === 'all'
                    ? 'border-[#155E38] bg-[#E4F1E8]/40 ring-1 ring-[#155E38]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      temp.posId === 'all'
                        ? 'bg-[#155E38] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#14261B]">Semua Titik Penyimpanan</span>
                    <span className="text-[10px] text-[#44574B]">Semua pos satpam &amp; penemu</span>
                  </div>
                </div>
                {temp.posId === 'all' && <Check className="w-4 h-4 text-[#155E38]" />}
              </button>

              {/* Pos Satpam List */}
              {POS_SATPAM_LIST.map((pos) => {
                const isSelected = temp.posId === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, posId: pos.id }))}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                      isSelected
                        ? 'border-[#155E38] bg-[#E4F1E8]/40 ring-1 ring-[#155E38]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#155E38] text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#14261B]">{pos.name}</span>
                        <span className="text-[10px] text-[#44574B]">
                          {pos.code} • {pos.location.split(',')[0]}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#155E38]" />}
                  </button>
                )
              })}

              {/* Option: Masih Dibawa Penemu */}
              <button
                type="button"
                onClick={() => setTemp((prev) => ({ ...prev, posId: 'dibawa_penemu' }))}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                  temp.posId === 'dibawa_penemu'
                    ? 'border-[#155E38] bg-[#E4F1E8]/40 ring-1 ring-[#155E38]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      temp.posId === 'dibawa_penemu'
                        ? 'bg-[#155E38] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#14261B]">Masih Dibawa Penemu</span>
                    <span className="text-[10px] text-[#44574B]">
                      Belum diserahkan ke pos satpam
                    </span>
                  </div>
                </div>
                {temp.posId === 'dibawa_penemu' && <Check className="w-4 h-4 text-[#155E38]" />}
              </button>
            </div>
          </div>

          {/* Section 3: Status Pengamanan (Custody Filter) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#14261B]">
              Status Fisik Barang
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTemp((prev) => ({ ...prev, custody: 'all' }))}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  temp.custody === 'all'
                    ? 'bg-white text-[#14261B] shadow-xs'
                    : 'text-[#44574B] hover:text-[#14261B]'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTemp((prev) => ({ ...prev, custody: 'pos_satpam' }))}
                className={`py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  temp.custody === 'pos_satpam'
                    ? 'bg-white text-[#0F4A2C] shadow-xs font-bold'
                    : 'text-[#44574B] hover:text-[#14261B]'
                }`}
              >
                <Shield className="w-3 h-3 text-[#155E38]" />
                Di Pos
              </button>
              <button
                type="button"
                onClick={() => setTemp((prev) => ({ ...prev, custody: 'dibawa_penemu' }))}
                className={`py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  temp.custody === 'dibawa_penemu'
                    ? 'bg-white text-[#14261B] shadow-xs font-bold'
                    : 'text-[#44574B] hover:text-[#14261B]'
                }`}
              >
                <User className="w-3 h-3 text-slate-500" />
                Di Penemu
              </button>
            </div>
          </div>

          {/* Section 4: Rentang Waktu Temuan */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#155E38]" />
              <label className="text-xs font-bold text-[#14261B]">
                Waktu Pelaporan
              </label>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {DATE_OPTIONS.map((opt) => {
                const isSelected = temp.dateRange === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, dateRange: opt.id }))}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'border-[#155E38] bg-[#E4F1E8] text-[#0F4A2C] font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-[#44574B] hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">{opt.label}</span>
                    <span className="text-[9px] opacity-75">{opt.sub}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              handleResetInternal()
              onReset()
              onClose()
            }}
            className="py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Terapkan ({previewMatches.length} Barang Ditemukan)</span>
          </button>
        </div>
      </div>
    </div>
  )
}