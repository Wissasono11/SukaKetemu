import React from 'react'

interface ItemCardSkeletonProps {
  count?: number
}

export const ItemCardSkeleton: React.FC<ItemCardSkeletonProps> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <article
          key={`item-skeleton-${idx}`}
          className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_8px_rgba(20,38,27,0.04)] text-left animate-pulse"
          aria-hidden="true"
        >
          {/* Thumbnail Skeleton (Aspect 4/3 identical to ItemCard) */}
          <div className="relative w-full aspect-[4/3] bg-slate-200/80 overflow-hidden">
            {/* Shimmer subtle highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            {/* Category Pill Placeholder top-left */}
            <div className="absolute top-2.5 left-2.5 w-16 h-5 rounded-full bg-white/60 backdrop-blur-xs" />
          </div>

          {/* Content Skeleton identical to ItemCard */}
          <div className="p-3 flex flex-col gap-2 flex-1 justify-between">
            <div className="flex flex-col gap-1.5">
              {/* Custody Pill Placeholder */}
              <div className="w-20 h-4.5 rounded-full bg-slate-200/80" />
              {/* Title Placeholder */}
              <div className="w-4/5 h-4 rounded-md bg-slate-200/90 mt-0.5" />
            </div>

            {/* Location & Time Placeholder */}
            <div className="w-3/5 h-3 rounded-md bg-slate-100 mt-1" />
          </div>
        </article>
      ))}
    </>
  )
}
