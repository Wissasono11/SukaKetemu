import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, RotateCcw } from 'lucide-react'

interface CampusMapTeaserProps {
  selectedPosId: string | null
  onSelectPos: (posId: string) => void
}

interface CheckpointLocation {
  id: string
  name: string
  shortLabel: string
  floor: string
  officer: string
  lat: number
  lng: number
  itemsCount: number
}

const CHECKPOINTS: CheckpointLocation[] = [
  {
    id: 'pos-fst-lobby',
    name: 'Pos Utama Lobby FST',
    shortLabel: 'Lobby FST',
    floor: 'Lantai 1 Gedung Dekanat',
    officer: 'Bpk. Agus Santoso',
    lat: -7.78458,
    lng: 110.39445,
    itemsCount: 6,
  },
  {
    id: 'pos-lab-terpadu',
    name: 'Pos Lab Terpadu',
    shortLabel: 'Lab Terpadu',
    floor: 'Selasar Barat Lantai 1',
    officer: 'Bpk. Hendra Saputra',
    lat: -7.78482,
    lng: 110.39515,
    itemsCount: 4,
  },
  {
    id: 'pos-gerbang-barat',
    name: 'Pos Gerbang Barat',
    shortLabel: 'Gerbang Barat',
    floor: 'Akses Masuk Utama',
    officer: 'Bpk. Bambang Triyono',
    lat: -7.78415,
    lng: 110.39340,
    itemsCount: 2,
  },
]

const FST_CENTER = { lat: -7.78455, lng: 110.39440 }

export const CampusMapTeaser: React.FC<CampusMapTeaserProps> = ({
  selectedPosId,
  onSelectPos,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  const selectedPos = CHECKPOINTS.find((c) => c.id === selectedPosId)

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [FST_CENTER.lat, FST_CENTER.lng],
      zoom: 18,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 19,
      minZoom: 16,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapInstanceRef.current = map

    CHECKPOINTS.forEach((cp) => {
      const isSelected = selectedPosId === cp.id
      const icon = L.divIcon({
        className: 'custom-checkpoint-pin',
        iconSize: [84, 46],
        iconAnchor: [42, 42],
        popupAnchor: [0, -38],
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="
              background: ${isSelected ? '#155E38' : '#ffffff'};
              color: ${isSelected ? '#ffffff' : '#14261B'};
              border: 1px solid ${isSelected ? '#C59B27' : '#E2E8F0'};
              padding: 2px 7px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 700;
              box-shadow: 0 2px 5px rgba(0,0,0,0.12);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>${cp.shortLabel}</span>
              <span style="
                background: ${isSelected ? '#ffffff' : '#E2E8F0'};
                color: ${isSelected ? '#155E38' : '#334155'};
                padding: 1px 4px;
                border-radius: 9999px;
                font-size: 9px;
                font-weight: 800;
              ">${cp.itemsCount}</span>
            </div>
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${isSelected ? '#155E38' : '#ffffff'};
              border: 2px solid ${isSelected ? '#C59B27' : '#155E38'};
              box-shadow: 0 2px 4px rgba(0,0,0,0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 2px;
            ">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="${isSelected ? '#ffffff' : '#155E38'}" stroke="${isSelected ? '#ffffff' : '#155E38'}" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
        `,
      })

      const marker = L.marker([cp.lat, cp.lng], { icon }).addTo(map)

      const popupNode = document.createElement('div')
      popupNode.style.fontFamily = "'Plus Jakarta Sans', sans-serif"
      popupNode.innerHTML = `
        <p style="font-size: 12px; font-weight: 800; color: #14261B; margin: 0 0 2px 0;">${cp.name}</p>
        <p style="font-size: 11px; color: #44574B; margin: 0 0 6px 0;">${cp.floor}</p>
        <button id="pop-btn-${cp.id}" style="
          width: 100%;
          background: #155E38;
          color: #fff;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        ">Lihat ${cp.itemsCount} Barang di Sini</button>
      `
      marker.bindPopup(popupNode)

      marker.on('popupopen', () => {
        const btn = document.getElementById(`pop-btn-${cp.id}`)
        if (btn) {
          btn.onclick = () => {
            onSelectPos(cp.id)
            document.getElementById(`pos-card-${cp.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      })

      marker.on('click', () => onSelectPos(cp.id))
      markersRef.current[cp.id] = marker
    })

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersRef.current = {}
    }
  }, [onSelectPos])

  // Fly to selected pos on change
  useEffect(() => {
    if (mapInstanceRef.current && selectedPosId) {
      const target = CHECKPOINTS.find((c) => c.id === selectedPosId)
      if (target) {
        mapInstanceRef.current.flyTo([target.lat, target.lng], 18, { duration: 0.6 })
        markersRef.current[selectedPosId]?.openPopup()
      }
    }
  }, [selectedPosId])

  const handleSelectCheckpoint = (id: string) => {
    onSelectPos(id)
    const target = CHECKPOINTS.find((c) => c.id === id)
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.lat, target.lng], 18, { duration: 0.6 })
      markersRef.current[id]?.openPopup()
    }
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 shadow-xs p-4 flex flex-col gap-3 text-left">
      {/* Title & Quick Pill Selector */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#155E38]" />
            <h3 className="text-xs font-bold text-[#14261B]">
              Sebaran Pos Pengamanan FST
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            UIN Sunan Kalijaga
          </span>
        </div>

        {/* Checkpoint Quick Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CHECKPOINTS.map((cp) => {
            const isSelected = selectedPosId === cp.id
            return (
              <button
                key={cp.id}
                type="button"
                onClick={() => handleSelectCheckpoint(cp.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#155E38] text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-[#44574B] border border-slate-200'
                }`}
              >
                <span>{cp.shortLabel}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {cp.itemsCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Real GIS Leaflet Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        <button
          type="button"
          onClick={() => mapInstanceRef.current?.flyTo([FST_CENTER.lat, FST_CENTER.lng], 18, { duration: 0.6 })}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-[#155E38] flex items-center justify-center shadow-xs active:scale-95 transition-all"
          title="Pusatkan Peta ke FST"
          aria-label="Pusatkan Peta ke FST"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Pos Summary Callout */}
      {selectedPos && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex flex-col">
            <span className="font-bold text-[#14261B]">{selectedPos.name}</span>
            <span className="text-[11px] text-[#44574B] mt-0.5">
              {selectedPos.floor} &bull; Petugas: {selectedPos.officer}
            </span>
          </div>

          <button
            type="button"
            onClick={() => document.getElementById(`pos-card-${selectedPos.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="px-3 py-1.5 rounded-lg bg-[#155E38] text-white text-xs font-bold hover:bg-[#0F4A2C] transition-colors whitespace-nowrap shadow-2xs"
          >
            Lihat Barang ({selectedPos.itemsCount})
          </button>
        </div>
      )}
    </div>
  )
}
export default CampusMapTeaser
