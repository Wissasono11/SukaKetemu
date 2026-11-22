import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Shield, Check, Compass, RotateCcw } from 'lucide-react'

interface CampusMapTeaserProps {
  selectedPosId: string | null
  onSelectPos: (posId: string) => void
}

interface CheckpointLocation {
  id: string
  name: string
  shortLabel: string
  building: string
  lat: number
  lng: number
  itemsCount: number
  is24h: boolean
  coordsSvg: { x: number; y: number }
}

const CHECKPOINTS: CheckpointLocation[] = [
  {
    id: 'pos-gerbang-barat',
    name: 'Pos Gerbang Barat',
    shortLabel: 'Gerbang Barat',
    building: 'Akses Masuk Kampus',
    lat: -7.78415,
    lng: 110.39340,
    itemsCount: 2,
    is24h: true,
    coordsSvg: { x: 22, y: 72 },
  },
  {
    id: 'pos-fst-lobby',
    name: 'Pos Utama Lobby FST',
    shortLabel: 'Lobby Utama',
    building: 'Gedung Amin Abdullah',
    lat: -7.78458,
    lng: 110.39445,
    itemsCount: 6,
    is24h: false,
    coordsSvg: { x: 50, y: 44 },
  },
  {
    id: 'pos-lab-terpadu',
    name: 'Pos Gedung Lab Terpadu',
    shortLabel: 'Lab Terpadu',
    building: 'Sains & Komputer',
    lat: -7.78482,
    lng: 110.39515,
    itemsCount: 4,
    is24h: false,
    coordsSvg: { x: 80, y: 48 },
  },
]

const FST_CENTER = { lat: -7.78455, lng: 110.39440 }

export const CampusMapTeaser: React.FC<CampusMapTeaserProps> = ({
  selectedPosId,
  onSelectPos,
}) => {
  const [mapMode, setMapMode] = useState<'gis' | 'vector'>('gis')
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  const selectedPos = CHECKPOINTS.find((c) => c.id === selectedPosId)

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (mapMode !== 'gis' || !mapContainerRef.current) return

    // Clean up existing instance before recreating
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
      markersRef.current = {}
    }

    const map = L.map(mapContainerRef.current, {
      center: [FST_CENTER.lat, FST_CENTER.lng],
      zoom: 18,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 19,
      minZoom: 16,
    })

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstanceRef.current = map

    // Render interactive pin markers for each pos
    CHECKPOINTS.forEach((cp) => {
      const isSelected = selectedPosId === cp.id

      const icon = L.divIcon({
        className: 'custom-checkpoint-pin',
        iconSize: [90, 52],
        iconAnchor: [45, 48],
        popupAnchor: [0, -44],
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="
              background: ${isSelected ? '#155E38' : '#ffffff'};
              color: ${isSelected ? '#ffffff' : '#14261B'};
              border: 1px solid ${isSelected ? '#C59B27' : '#CBD5E1'};
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 700;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>${cp.shortLabel}</span>
              <span style="
                background: ${isSelected ? '#ffffff' : '#F1F5F9'};
                color: ${isSelected ? '#155E38' : '#475569'};
                padding: 1px 5px;
                border-radius: 9999px;
                font-size: 9px;
                font-weight: 800;
              ">${cp.itemsCount}</span>
            </div>
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${isSelected ? '#155E38' : '#ffffff'};
              border: 2px solid ${isSelected ? '#C59B27' : '#155E38'};
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 2px;
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="${isSelected ? '#ffffff' : '#155E38'}" stroke="${isSelected ? '#ffffff' : '#155E38'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
        `,
      })

      const marker = L.marker([cp.lat, cp.lng], { icon }).addTo(map)

      const popupContent = document.createElement('div')
      popupContent.style.fontFamily = "'Plus Jakarta Sans', sans-serif"
      popupContent.style.padding = '4px 0'
      popupContent.innerHTML = `
        <p style="font-size: 12px; font-weight: 800; color: #14261B; margin: 0 0 2px 0;">${cp.name}</p>
        <p style="font-size: 11px; color: #44574B; margin: 0 0 8px 0;">${cp.building} &bull; ${cp.itemsCount} barang tersimpan</p>
        <button id="popup-btn-${cp.id}" style="
          width: 100%;
          background: #155E38;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        ">Lihat Daftar Barang &darr;</button>
      `

      marker.bindPopup(popupContent)

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${cp.id}`)
        if (btn) {
          btn.onclick = () => {
            onSelectPos(cp.id)
            const el = document.getElementById(`pos-card-${cp.id}`)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      })

      marker.on('click', () => {
        onSelectPos(cp.id)
      })

      markersRef.current[cp.id] = marker
    })

    // Auto-focus if already selected
    if (selectedPosId && markersRef.current[selectedPosId]) {
      const activeMarker = markersRef.current[selectedPosId]
      const targetPos = CHECKPOINTS.find((c) => c.id === selectedPosId)
      if (targetPos) {
        map.setView([targetPos.lat, targetPos.lng], 18)
        activeMarker.openPopup()
      }
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersRef.current = {}
    }
  }, [mapMode, onSelectPos])

  // Fly to selected pos when changed externally
  useEffect(() => {
    if (mapMode === 'gis' && mapInstanceRef.current && selectedPosId) {
      const targetPos = CHECKPOINTS.find((c) => c.id === selectedPosId)
      if (targetPos) {
        mapInstanceRef.current.flyTo([targetPos.lat, targetPos.lng], 18, {
          duration: 0.8,
        })
        const marker = markersRef.current[selectedPosId]
        if (marker) marker.openPopup()
      }
    }
  }, [selectedPosId, mapMode])

  const handleResetCenter = () => {
    if (mapMode === 'gis' && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([FST_CENTER.lat, FST_CENTER.lng], 18, {
        duration: 0.6,
      })
    }
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-xs p-4 flex flex-col gap-3 text-left">
      {/* Header Info & Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E4F1E8] text-[#155E38] flex items-center justify-center flex-shrink-0 font-bold">
            <MapPin className="w-4 h-4 text-[#155E38]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#14261B]">
              Peta Lokasi Pos Satpam FST
            </h3>
            <p className="text-[11px] text-[#44574B]">
              {mapMode === 'gis'
                ? 'Peta Real GIS (OpenStreetMap & Koordinat FST)'
                : 'Denah Vektor Arsitektural Kawasan FST'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setMapMode('gis')}
            className={`px-2 py-1 rounded-md transition-all ${
              mapMode === 'gis'
                ? 'bg-white text-[#155E38] font-bold shadow-2xs'
                : 'text-slate-600 hover:text-[#155E38]'
            }`}
          >
            GIS Map
          </button>
          <button
            type="button"
            onClick={() => setMapMode('vector')}
            className={`px-2 py-1 rounded-md transition-all ${
              mapMode === 'vector'
                ? 'bg-white text-[#155E38] font-bold shadow-2xs'
                : 'text-slate-600 hover:text-[#155E38]'
            }`}
          >
            Vektor
          </button>
        </div>
      </div>

      {/* Map Viewport */}
      {mapMode === 'gis' ? (
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-slate-200">
          {/* Leaflet DOM Node */}
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Recenter Button Overlay */}
          <button
            type="button"
            onClick={handleResetCenter}
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-[#155E38] flex items-center justify-center shadow-xs active:scale-95 transition-all"
            title="Pusatkan ke Kampus FST"
            aria-label="Pusatkan ke Kampus FST"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Vector Schematic Fallback / Toggle View */
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#F4F7F4] border border-slate-200 select-none">
          <svg
            viewBox="0 0 500 300"
            className="w-full h-full object-cover pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Roads */}
            <path
              d="M 0 230 Q 150 215, 260 215 T 500 205"
              stroke="#CBD5E1"
              strokeWidth="38"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 0 230 Q 150 215, 260 215 T 500 205"
              stroke="#E2E8F0"
              strokeWidth="28"
              fill="none"
              strokeLinecap="round"
            />
            {/* Pathways */}
            <path
              d="M 120 220 L 245 130 L 255 130"
              stroke="#E2E8F0"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 260 215 L 390 140"
              stroke="#E2E8F0"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
            />

            {/* Building 1: Akses Gerbang Barat */}
            <g transform="translate(45, 175)">
              <rect width="85" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="5" y="5" width="75" height="20" rx="4" fill="#E4F1E8" opacity="0.8" />
              <text x="42" y="40" fontSize="9" fontWeight="bold" fill="#14261B" textAnchor="middle" fontFamily="sans-serif">Gerbang Barat</text>
              <text x="42" y="52" fontSize="7.5" fill="#64748B" textAnchor="middle" fontFamily="sans-serif">Akses Masuk</text>
            </g>

            {/* Building 2: Gedung Utama FST */}
            <g transform="translate(170, 50)">
              <rect width="155" height="95" rx="10" fill="#FFFFFF" stroke="#155E38" strokeWidth="2" />
              <rect x="6" y="6" width="143" height="26" rx="6" fill="#E4F1E8" />
              <text x="77" y="22" fontSize="10" fontWeight="bold" fill="#0F4A2C" textAnchor="middle" fontFamily="sans-serif">Gedung Utama FST</text>
              <text x="77" y="58" fontSize="9" fontWeight="600" fill="#14261B" textAnchor="middle" fontFamily="sans-serif">Prof. Dr. KH Amin Abdullah</text>
              <text x="77" y="74" fontSize="8" fill="#475569" textAnchor="middle" fontFamily="sans-serif">Lantai 1–4 &bull; Dekanat &amp; Kuliah</text>
            </g>

            {/* Building 3: Lab Terpadu */}
            <g transform="translate(350, 60)">
              <rect width="120" height="90" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="6" y="6" width="108" height="24" rx="6" fill="#E2E8F0" />
              <text x="60" y="21" fontSize="9.5" fontWeight="bold" fill="#334155" textAnchor="middle" fontFamily="sans-serif">Lab Terpadu</text>
              <text x="60" y="56" fontSize="8.5" fontWeight="600" fill="#14261B" textAnchor="middle" fontFamily="sans-serif">Laboratorium Sains</text>
              <text x="60" y="72" fontSize="7.5" fill="#64748B" textAnchor="middle" fontFamily="sans-serif">Lt. 1 Meja Satpam Timur</text>
            </g>
          </svg>

          {/* Interactive Pins on SVG */}
          {CHECKPOINTS.map((cp) => {
            const isSelected = selectedPosId === cp.id
            return (
              <button
                key={cp.id}
                type="button"
                onClick={() => onSelectPos(cp.id)}
                style={{
                  left: `${cp.coordsSvg.x}%`,
                  top: `${cp.coordsSvg.y}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-150 ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'
                }`}
              >
                <div
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap mb-1 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#155E38] text-white ring-2 ring-[#C59B27]'
                      : 'bg-white text-[#14261B] border border-slate-200'
                  }`}
                >
                  <span>{cp.shortLabel}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${isSelected ? 'bg-white text-[#155E38]' : 'bg-slate-100'}`}>
                    {cp.itemsCount}
                  </span>
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md ${isSelected ? 'bg-[#155E38] text-white ring-4 ring-[#155E38]/20' : 'bg-white text-[#155E38] border-2 border-[#155E38]'}`}>
                  <Shield className="w-3.5 h-3.5 fill-current" />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Selected Pos Status Card */}
      {selectedPos ? (
        <div className="p-3 rounded-xl bg-[#E4F1E8]/60 border border-[#155E38]/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#155E38] text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#14261B]">
                {selectedPos.name} ({selectedPos.building})
              </span>
              <span className="text-[10px] text-[#44574B]">
                Koordinat: {selectedPos.lat.toFixed(5)}, {selectedPos.lng.toFixed(5)} &bull; {selectedPos.itemsCount} barang tersimpan
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById(`pos-card-${selectedPos.id}`)
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
            className="px-2.5 py-1 rounded-lg bg-[#155E38] text-white text-[11px] font-bold hover:bg-[#0F4A2C] transition-colors whitespace-nowrap"
          >
            Lihat Pos
          </button>
        </div>
      ) : (
        <div className="text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl flex items-center justify-between border border-slate-100">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#155E38]" />
            Klik pin pos pada peta GIS untuk melihat lokasi &amp; daftar barang
          </span>
        </div>
      )}
    </div>
  )
}
export default CampusMapTeaser
