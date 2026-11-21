import React from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFilterClick: () => void
  activeFilterCount?: number
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFilterClick,
  activeFilterCount = 0,
}) => {
  return (
    <section aria-label="Pencarian Barang" className="w-full">
      <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-[0_2px_10px_rgba(20,38,27,0.04)] border border-slate-100 focus-within:border-[#155E38] focus-within:ring-2 focus-within:ring-[#155E38]/20 transition-all">
        <div className="pl-3 pr-2 flex items-center justify-center text-[#44574B]">
          <Search className="w-4 h-4 text-[#44574B]" />
        </div>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari barang, merek, atau gedung..."
          aria-label="Cari barang temuan atau hilang"
          className="w-full bg-transparent py-1.5 text-sm text-[#14261B] placeholder:text-[#44574B]/70 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Hapus pencarian"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label={
            activeFilterCount > 0
              ? `Filter lanjutan (${activeFilterCount} filter aktif)`
              : 'Filter berdasarkan kategori, pos satpam, atau tanggal'
          }
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#155E38] text-white hover:bg-[#0F4A2C] active:scale-95 transition-all shadow-sm flex-shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 text-white" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C59B27] text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-xs animate-in zoom-in-75">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </section>
  )
}
