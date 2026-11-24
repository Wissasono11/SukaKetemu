import React from 'react'

interface MyReportCardSkeletonProps {
  count?: number
}

export const MyReportCardSkeleton: React.FC<MyReportCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="flex flex-col gap-2.5 animate-pulse" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <article
          key={i}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-2.5 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-200/80 flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
              <div className="flex items-center justify-between">
                <div className="w-16 h-3 rounded bg-slate-200" />
                <div className="w-12 h-2.5 rounded bg-slate-100" />
              </div>
              <div className="w-3/4 h-3.5 rounded bg-slate-200" />
              <div className="w-1/2 h-3 rounded bg-slate-100" />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="w-24 h-4 rounded bg-slate-100" />
            <div className="w-16 h-6 rounded-lg bg-slate-200/80" />
          </div>
        </article>
      ))}
    </div>
  )
}
