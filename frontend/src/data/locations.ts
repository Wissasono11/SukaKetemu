// Master data titik lokasi kampus (hierarki: Gedung -> Lantai -> Ruangan).
// Satu baris = satu titik QR checkpoint. `id` itulah yang ditulis di stiker QR.
//
// FORMAT QR RESMI : SUKAKETEMU:LOC-xxx   (contoh: SUKAKETEMU:LOC-003)
// ATURAN ID       : ID tidak boleh dipakai ulang. Kalau sebuah lokasi dihapus,
//                   nomornya dibiarkan kosong (jangan diberikan ke lokasi lain).
//                   Lokasi baru selalu memakai nomor berikutnya yang belum pernah ada.

export interface CampusLocation {
  id: string
  gedung: string
  lantai: string
  ruangan: string
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 'LOC-001', gedung: 'FST (Saintek)', lantai: 'Lantai 1', ruangan: 'Lobby' },
  { id: 'LOC-002', gedung: 'FST (Saintek)', lantai: 'Lantai 1', ruangan: 'Pos Satpam' },
  { id: 'LOC-003', gedung: 'FST (Saintek)', lantai: 'Lantai 1', ruangan: 'Ruang 101' },
  { id: 'LOC-004', gedung: 'FST (Saintek)', lantai: 'Lantai 1', ruangan: 'Ruang 102' },
  { id: 'LOC-005', gedung: 'FST (Saintek)', lantai: 'Lantai 1', ruangan: 'Ruang 103' },
  { id: 'LOC-006', gedung: 'FST (Saintek)', lantai: 'Lantai 1', ruangan: 'Ruang 104' },
]

export function findLocationById(id: string): CampusLocation | undefined {
  return CAMPUS_LOCATIONS.find((loc) => loc.id === id)
}

// --- Fungsi bantu untuk dropdown bertingkat (Gedung -> Lantai -> Ruangan) ---

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

export function getGedungList(): string[] {
  return unique(CAMPUS_LOCATIONS.map((loc) => loc.gedung))
}

export function getLantaiList(gedung: string): string[] {
  return unique(
    CAMPUS_LOCATIONS.filter((loc) => loc.gedung === gedung).map((loc) => loc.lantai)
  )
}

export function getRuanganList(gedung: string, lantai: string): string[] {
  return CAMPUS_LOCATIONS.filter(
    (loc) => loc.gedung === gedung && loc.lantai === lantai
  ).map((loc) => loc.ruangan)
}

// --- Format payload QR resmi ---

export const QR_PREFIX = 'SUKAKETEMU:'

// Teks yang dicetak ke dalam stiker QR untuk sebuah lokasi.
export function buildLocationQrPayload(id: string): string {
  return `${QR_PREFIX}${id}`
}

// Membaca hasil scan. Mengembalikan lokasinya, atau undefined jika
// bukan QR SukaKetemu / ID-nya tidak ada di master data.
export function parseLocationQr(text: string): CampusLocation | undefined {
  const raw = text.trim()
  if (!raw.startsWith(QR_PREFIX)) return undefined
  return findLocationById(raw.slice(QR_PREFIX.length))
}
