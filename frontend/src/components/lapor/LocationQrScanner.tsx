
import React, { useEffect, useId, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, X, AlertCircle } from 'lucide-react'
import { parseLocationQr } from '../../data/locations'

// Mengantrekan proses kamera agar tidak berjalan bersamaan
let scannerQueue: Promise<void> = Promise.resolve()

interface LocationQrScannerProps {
  onScanSuccess: (location: {
    id: string
    gedung: string
    lantai: string
    ruangan: string
  }) => void
  onClose: () => void
}

export const LocationQrScanner: React.FC<LocationQrScannerProps> = ({
  onScanSuccess,
  onClose,
}) => {
  const scannerId = useId().replace(/:/g, '')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let handled = false
    let scanner: Html5Qrcode | null = null

    const startScanner = async () => {
      if (cancelled) return

      scanner = new Html5Qrcode(scannerId)

      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1,
          },
          (decodedText) => {
            if (cancelled || handled) return

            const location = parseLocationQr(decodedText)

            if (!location) {
              setError('QR tidak dikenali sebagai QR lokasi SukaKetemu.')
              return
            }

            handled = true
            setError('')
            onScanSuccess(location)
          },
          () => {
            // Abaikan kegagalan pembacaan per frame.
          }
        )

        if (cancelled && scanner.isScanning) {
          await scanner.stop()
          scanner.clear()
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Scanner error:', err)
          setError(
            'Kamera gagal dibuka. Periksa izin kamera browser.'
          )
        }
      }
    }

    const startTask = scannerQueue.then(startScanner)
    scannerQueue = startTask.catch(() => undefined)

    return () => {
      cancelled = true

      const cleanupTask = scannerQueue.then(async () => {
        if (!scanner) return

        try {
          if (scanner.isScanning) {
            await scanner.stop()
          }

          scanner.clear()
        } catch (err) {
          console.error('Scanner cleanup error:', err)
        }
      })

      scannerQueue = cleanupTask.catch(() => undefined)
    }
  }, [scannerId, onScanSuccess])

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#155E38]" />
            <div>
              <h2 className="font-bold text-[#14261B]">
                Scan QR Lokasi
              </h2>
              <p className="text-xs text-slate-500">
                Arahkan kamera ke QR lokasi kampus
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100"
            aria-label="Tutup scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div id={scannerId} />

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-sm flex gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-3 text-center">
          Contoh QR uji coba: SUKAKETEMU:LOC-001
        </p>
      </div>
    </div>
  )
}
