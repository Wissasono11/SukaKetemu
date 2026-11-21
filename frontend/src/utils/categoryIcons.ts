import React from 'react'
import {
  LayoutGrid,
  Headphones,
  FileText,
  CupSoda,
  Briefcase,
  Layers,
  Shapes,
} from 'lucide-react'
import type { ItemCategory } from '../types/lostFound'

export const CATEGORY_ICONS: Record<ItemCategory, React.ElementType> = {
  all: LayoutGrid,
  elektronik: Headphones,
  dokumen: FileText,
  botol: CupSoda,
  tas: Briefcase,
  ibadah: Layers,
  lainnya: Shapes,
}

export function getCategoryIcon(category: ItemCategory): React.ElementType {
  return CATEGORY_ICONS[category] || LayoutGrid
}
