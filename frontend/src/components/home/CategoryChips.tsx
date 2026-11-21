import React, { useMemo } from 'react'
import {
  LayoutGrid,
  Headphones,
  FileText,
  CupSoda,
  Briefcase,
  Layers,
  Shapes,
} from 'lucide-react'
import type { ItemCategory } from '../../types/lostFound'
import { CATEGORIES, INITIAL_ITEMS } from '../../data/mockItems'

interface CategoryChipsProps {
  selectedCategory: ItemCategory
  onSelectCategory: (category: ItemCategory) => void
  totalCount?: number
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

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: INITIAL_ITEMS.length }
    INITIAL_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
  }, [])

  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-xs font-bold text-[#14261B] tracking-tight">
          Kategori Barang
        </h3>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-4 px-4 scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          const count = categoryCounts[cat.id] || 0

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 focus:outline-none ${
                isActive
                  ? 'bg-[#155E38] text-white shadow-sm ring-1 ring-[#155E38]'
                  : 'bg-white text-[#44574B] border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {renderCategoryIcon(
                cat.id,
                `w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#155E38]'}`
              )}
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-[#44574B]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
