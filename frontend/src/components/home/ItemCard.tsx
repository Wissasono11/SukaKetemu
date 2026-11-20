import React from 'react'
import {
  Headphones,
  FileText,
  CupSoda,
  Briefcase,
  Layers,
  Shield,
  User,
  MapPin,
  EyeOff,
  Shapes,
} from 'lucide-react'
import type { LostFoundItem } from '../../types/lostFound'

interface ItemCardProps {
  item: LostFoundItem
  onClick?: () => void
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const isPosSatpam = item.custody === 'pos_satpam'

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.04)] hover:shadow-md hover:border-[#155E38]/30 transition-all group cursor-pointer active:scale-[0.99] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#155E38]"
    >
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            item.isPrivacySensitive ? 'blur-md scale-110' : ''
          }`}
        />

        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
          {item.category === 'elektronik' && <Headphones className="w-3 h-3 text-[#44574B]" />}
          {item.category === 'dokumen' && <FileText className="w-3 h-3 text-[#44574B]" />}
          {item.category === 'botol' && <CupSoda className="w-3 h-3 text-[#44574B]" />}
          {item.category === 'tas' && <Briefcase className="w-3 h-3 text-[#44574B]" />}
          {item.category === 'ibadah' && <Layers className="w-3 h-3 text-[#44574B]" />}
          {item.category === 'lainnya' && <Shapes className="w-3 h-3 text-[#44574B]" />}
          <span className="text-[10px] font-medium text-[#14261B]">
            {item.categoryLabel}
          </span>
        </div>

        {item.isPrivacySensitive && (
          <div className="absolute inset-0 bg-[#14261B]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
            <EyeOff className="w-4 h-4 text-white drop-shadow-sm mb-1" />
            <span className="text-[9px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full tracking-wide">
              {item.privacyReason || 'Privasi UU PDP'}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div
            className={`inline-flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              isPosSatpam
                ? 'bg-[#E4F1E8] text-[#0F4A2C]'
                : 'bg-[#FEF3C7] text-[#92400E]'
            }`}
          >
            {isPosSatpam ? (
              <Shield className="w-3 h-3 text-[#0F4A2C]" />
            ) : (
              <User className="w-3 h-3 text-[#92400E]" />
            )}
            <span>{isPosSatpam ? 'Pos Satpam' : 'Dibawa Penemu'}</span>
          </div>

          <h4 className="text-xs font-bold text-[#14261B] line-clamp-1 mt-0.5 group-hover:text-[#155E38] transition-colors">
            {item.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 text-[#44574B] text-[11px]">
          <MapPin className="w-3 h-3 text-[#155E38] flex-shrink-0" />
          <span className="truncate">{item.locationDetail}</span>
        </div>
      </div>
    </article>
  )
}
