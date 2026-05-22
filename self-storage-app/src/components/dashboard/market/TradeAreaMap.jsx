import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

// Lazy-load Leaflet to avoid SSR issues
let L = null
let mapInitialized = false

const MILES_TO_METERS = 1609.34

const RING_COLORS = {
  1: { color: '#3d7d52', fillColor: '#3d7d52', fillOpacity: 0.04 },
  3: { color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.03 },
  5: { color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.02 },
}

export default function TradeAreaMap({ lat, lng, tradeAreaRadius, competitors }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layersRef = useRef([])

  const hasCoords = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))

  useEffect(() => {
    if (!hasCoords) return

    const initMap = async () => {
      if (!L) {
        const leaflet = await import('leaflet')
        await import('leaflet/dist/leaflet.css')
        L = leaflet.default

        // Fix default icon
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })
      }

      const latF = parseFloat(lat)
      const lngF = parseFloat(lng)

      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView([latF, lngF], 12)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(mapInstanceRef.current)
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([latF, lngF], 12)
      }

      // Clear existing layers
      layersRef.current.forEach(l => l.remove())
      layersRef.current = []

      const map = mapInstanceRef.current

      // Draw trade area rings
      const radii = [1, 3, 5].filter(r => r <= tradeAreaRadius + 0.5)
      radii.forEach(r => {
        const circle = L.circle([latF, lngF], {
          radius: r * MILES_TO_METERS,
          ...RING_COLORS[r],
          weight: 1.5,
          dashArray: r === tradeAreaRadius ? null : '6 3',
        }).addTo(map)
        circle.bindTooltip(`${r}-mile ring`, { permanent: false })
        layersRef.current.push(circle)
      })

      // Subject property marker
      const subjectIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#3d7d52;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: '',
      })
      const subjectMarker = L.marker([latF, lngF], { icon: subjectIcon })
        .addTo(map)
        .bindPopup('<strong>Subject Property</strong>')
      layersRef.current.push(subjectMarker)

      // Competitor markers
      competitors.forEach(comp => {
        if (!comp.distance || !comp.name) return
        // Approximate position along a random bearing (placeholder)
        // In a real app, you'd geocode each competitor address
        const bearing = Math.random() * 360
        const dist = parseFloat(comp.distance) * MILES_TO_METERS
        const dLat = (dist * Math.cos((bearing * Math.PI) / 180)) / 111320
        const dLng = (dist * Math.sin((bearing * Math.PI) / 180)) / (111320 * Math.cos((latF * Math.PI) / 180))
        const compIcon = L.divIcon({
          html: `<div style="width:10px;height:10px;background:${comp.isReit ? '#eab308' : '#ef4444'};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
          className: '',
        })
        const marker = L.marker([latF + dLat, lngF + dLng], { icon: compIcon })
          .addTo(map)
          .bindPopup(`<strong>${comp.name}</strong><br/>${comp.distance} mi · ${comp.totalSqFt ? parseInt(comp.totalSqFt).toLocaleString() + ' sqft' : 'sqft unknown'}${comp.isReit ? '<br/><span style="color:#eab308">REIT Operator</span>' : ''}`)
        layersRef.current.push(marker)
      })
    }

    initMap()

    return () => {
      if (mapInstanceRef.current && !hasCoords) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [hasCoords, lat, lng, tradeAreaRadius, competitors])

  if (!hasCoords) {
    return (
      <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-navy-700 flex items-center gap-2">
          <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-sage-400" />
          </div>
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide">Trade Area Map</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center px-8">
          <MapPin className="w-10 h-10 text-navy-700 mb-3" />
          <div className="text-sm font-medium text-gray-500 dark:text-navy-400">Enter address and click Geocode</div>
          <div className="text-xs text-gray-400 dark:text-navy-500 mt-1">
            Or enter latitude & longitude manually to display the trade area map with competitor rings.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-navy-700 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-navy-900 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-sage-400" />
          </div>
          <h3 className="font-semibold text-navy-900 dark:text-white text-sm uppercase tracking-wide">Trade Area Map</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {[
            { color: '#3d7d52', label: 'Subject Property' },
            { color: '#ef4444', label: 'Competitor' },
            { color: '#eab308', label: 'REIT Operator' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-1.5 text-gray-500 dark:text-navy-400">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
      <div ref={mapRef} className="h-80 w-full z-10" style={{ minHeight: 320 }} />
      <div className="px-4 py-2 bg-gray-50 dark:bg-navy-900/50 border-t border-gray-100 dark:border-navy-700 text-xs text-gray-400 dark:text-navy-500">
        Map data © OpenStreetMap · Competitor positions are approximate (based on distance only — no geocoded addresses)
      </div>
    </div>
  )
}
