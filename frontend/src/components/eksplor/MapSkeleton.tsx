import React from 'react'
import { MapPin, Navigation } from 'lucide-react'

export const MapSkeleton: React.FC = () => {
  return (
    <div
      className="absolute inset-0 z-15 bg-slate-100 flex flex-col items-center justify-center p-4 text-center animate-pulse"
      aria-hidden="true"
    >
      {/* Background Grid Pattern Simulation */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#155E38_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Center Simulated Pin & Radar */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#E4F1E8] flex items-center justify-center text-[#155E38]">
            <MapPin className="w-5 h-5 text-[#155E38]" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#155E38] animate-ping" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-36 h-3 rounded bg-slate-300/80" />
          <div className="w-24 h-2.5 rounded bg-slate-200" />
        </div>
      </div>

      {/* Mini Controls Silhouette */}
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-md border border-slate-200">
        <Navigation className="w-3 h-3 text-slate-400" />
        <span className="text-[9px] font-medium text-slate-500">GIS UIN Sunan Kalijaga</span>
      </div>
    </div>
  )
}
