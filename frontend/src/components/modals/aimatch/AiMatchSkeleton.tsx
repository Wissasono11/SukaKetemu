import React from 'react'

interface AiMatchSkeletonProps {
  showHeader?: boolean
  showTabs?: boolean
}

export const AiMatchSkeleton: React.FC<AiMatchSkeletonProps> = ({
  showHeader = false,
  showTabs = false,
}) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat kandidat kecocokan"
      className="flex flex-col gap-4 animate-pulse"
    >
      <span className="sr-only">Memuat daftar kandidat kecocokan...</span>

      {showHeader && (
        <div aria-hidden="true" className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="w-36 h-5 rounded bg-slate-200" />
            <div className="w-56 h-3.5 rounded bg-slate-100" />
          </div>
          <div className="w-24 h-11 rounded-lg bg-slate-200" />
        </div>
      )}

      {showTabs && (
        <div
          aria-hidden="true"
          className="flex items-center gap-5 border-b border-slate-200 pb-2.5"
        >
          <div className="w-36 h-4 rounded bg-slate-200" />
          <div className="w-32 h-4 rounded bg-slate-100" />
          <div className="w-28 h-4 rounded bg-slate-100" />
        </div>
      )}

      <div
        aria-hidden="true"
        className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3.5 text-left"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="w-36 h-4 rounded bg-slate-200" />
          <div className="w-20 h-3.5 rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="aspect-4/3 rounded-lg bg-slate-200" />
            <div className="w-2/3 h-3 rounded bg-slate-100" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="aspect-4/3 rounded-lg bg-slate-200" />
            <div className="w-3/4 h-3 rounded bg-slate-200" />
          </div>
        </div>

        <div className="border-l-2 border-slate-200 pl-3 py-1 flex flex-col gap-1.5">
          <div className="w-48 h-3.5 rounded bg-slate-200" />
          <div className="w-36 h-3 rounded bg-slate-100" />
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <div className="w-28 h-3.5 rounded bg-slate-200" />
          <div className="w-full h-4 rounded bg-slate-100" />
          <div className="w-5/6 h-4 rounded bg-slate-100" />
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <div className="w-full h-11 rounded-xl bg-slate-200" />
          <div className="w-32 h-8 rounded-lg bg-slate-100 mx-auto" />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-200 overflow-hidden"
      >
        {[1, 2].map((i) => (
          <div
            key={i}
            className="px-3.5 py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-3.5 rounded bg-slate-100" />
              <div className="w-11 h-11 rounded-md bg-slate-200 flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="w-36 h-3.5 rounded bg-slate-200" />
                <div className="w-24 h-3 rounded bg-slate-100" />
              </div>
            </div>
            <div className="w-9 h-4 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
