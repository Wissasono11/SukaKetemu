import React, { useState, useMemo, useEffect } from 'react'
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Shield,
  User,
  Calendar,
  Check,
  LayoutGrid,
} from 'lucide-react'
import type {
  FilterCriteria,
  DateRangeOption,
} from '../../types/lostFound'
import {
  CATEGORIES,
  POS_SATPAM_LIST,
  INITIAL_ITEMS,
  filterLostFoundItems,
} from '../../data/mockItems'
import { DEFAULT_FILTER_CRITERIA } from '../../types/lostFound'
import { getCategoryIcon } from '../../utils/categoryIcons'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  currentCriteria: FilterCriteria
  onApply: (criteria: FilterCriteria) => void
  onReset: () => void
  searchQuery?: string
}

const DATE_OPTIONS: { id: DateRangeOption; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'today', label: 'Hari Ini' },
  { id: '3days', label: '3 Hari' },
  { id: '7days', label: '7 Hari' },
  { id: '30days', label: '30 Hari' },
]

const CUSTODY_OPTIONS: { id: FilterCriteria['custody']; label: string; icon?: React.ElementType }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'pos_satpam', label: 'Di Pos', icon: Shield },
  { id: 'dibawa_penemu', label: 'Di Penemu', icon: User },
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

  useEffect(() => {
    setTemp(currentCriteria)
  }, [isOpen, currentCriteria])

  const activeCount = [temp.category, temp.posId, temp.custody, temp.dateRange].filter(
    (v) => v !== 'all'
  ).length

  const previewMatches = useMemo(() => {
    return filterLostFoundItems(INITIAL_ITEMS, temp, searchQuery)
  }, [temp, searchQuery])

  if (!isOpen) return null

  const storageOptions = [
    { id: 'all', name: 'Semua Titik Penyimpanan', detail: 'Semua pos satpam & penemu', icon: LayoutGrid },
    ...POS_SATPAM_LIST.map((pos) => ({
      id: pos.id,
      name: pos.name,
      detail: `${pos.code} • ${pos.location.split(',')[0]}`,
      icon: Shield,
    })),
    { id: 'dibawa_penemu', name: 'Masih Dibawa Penemu', detail: 'Belum diserahkan ke pos satpam', icon: User },
  ]

  const segmentBtnClass = (active: boolean) =>
    `py-2 rounded-lg text-xs font-semibold transition-all ${
      active ? 'bg-white text-[#0F4A2C] shadow-xs font-bold' : 'text-[#44574B] hover:text-[#14261B]'
    }`

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 text-left overscroll-contain">
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
                onClick={() => setTemp(DEFAULT_FILTER_CRITERIA)}
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
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 flex flex-col gap-5 text-left">
          {/* Section 1: Kategori Barang */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#14261B]">Kategori Barang</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = temp.category === cat.id
                const CatIcon = getCategoryIcon(cat.id)
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
                    <CatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#155E38]'}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Pos Satpam / Tempat Penyimpanan */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14261B]">Pos Satpam &amp; Penyimpanan</label>
              <span className="text-[10px] text-[#44574B]">Kampus UIN</span>
            </div>

            <div className="flex flex-col gap-2">
              {storageOptions.map((opt) => {
                const isSelected = temp.posId === opt.id
                const OptIcon = opt.icon
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, posId: opt.id }))}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all text-left ${
                      isSelected
                        ? 'border-[#155E38] bg-[#E4F1E8]/40 ring-1 ring-[#155E38]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#155E38] text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <OptIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#14261B]">{opt.name}</span>
                        <span className="text-[10px] text-[#44574B]">{opt.detail}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#155E38]" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Status Pengamanan */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#14261B]">Status Fisik Barang</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
              {CUSTODY_OPTIONS.map((opt) => {
                const isSelected = temp.custody === opt.id
                const CustodyIcon = opt.icon
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, custody: opt.id }))}
                    className={`${segmentBtnClass(isSelected)} flex items-center justify-center gap-1`}
                  >
                    {CustodyIcon && <CustodyIcon className="w-3 h-3 text-[#155E38]" />}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 4: Rentang Waktu */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#155E38]" />
              <label className="text-xs font-bold text-[#14261B]">Waktu Pelaporan</label>
            </div>
            <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl text-center">
              {DATE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTemp((prev) => ({ ...prev, dateRange: opt.id }))}
                  className={`${segmentBtnClass(temp.dateRange === opt.id)} truncate`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setTemp(DEFAULT_FILTER_CRITERIA)
              onReset()
              onClose()
            }}
            className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(temp)
              onClose()
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#155E38] hover:bg-[#0F4A2C] text-white text-xs font-bold shadow-md shadow-[#155E38]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>Terapkan Filter</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">
              {previewMatches.length} Hasil
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
