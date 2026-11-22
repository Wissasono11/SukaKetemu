import type {
  LostFoundItem,
  ItemCategory,
  PosSatpamInfo,
  ClaimTicket,
  AiMatchItem,
  FilterCriteria,
} from '../types/lostFound'

export const INITIAL_ITEMS: LostFoundItem[] = [
  {
    id: '1',
    title: 'TWS Soundcore R50i',
    category: 'elektronik',
    categoryLabel: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Matte black wireless earbud case on academic desk',
    custody: 'pos_satpam',
    posId: 'pos-fst-lobby',
    locationDetail: 'Pos Utama FST • 12m lalu',
    reportedDate: '2026-11-21T19:25:00',
  },
  {
    id: '2',
    title: 'KTM Mahasiswa FST',
    category: 'dokumen',
    categoryLabel: 'Dokumen/KTM',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Kartu Tanda Mahasiswa di meja kampus',
    custody: 'dibawa_penemu',
    locationDetail: 'Dibawa Penemu • R. 304',
    reportedDate: '2026-11-21T18:50:00',
    isPrivacySensitive: true,
    privacyReason: 'Privasi UU PDP',
  },
  {
    id: '3',
    title: 'Tumbler Hitam Matte',
    category: 'botol',
    categoryLabel: 'Botol Minum',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Tumbler stainless steel matte di lab kampus',
    custody: 'pos_satpam',
    posId: 'pos-lab-terpadu',
    locationDetail: 'Pos Lab Terpadu • 1j lalu',
    reportedDate: '2026-11-21T18:30:00',
  },
  {
    id: '4',
    title: 'Dompet Kulit Cokelat',
    category: 'tas',
    categoryLabel: 'Tas/Dompet',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Dompet lipat kulit cokelat di lobi fakultas',
    custody: 'dibawa_penemu',
    locationDetail: 'Lobi Lt. 1 FST • 2j lalu',
    reportedDate: '2026-11-21T17:30:00',
  },
  {
    id: '5',
    title: 'Mukena Parasut Khaki',
    category: 'ibadah',
    categoryLabel: 'Perlengkapan Ibadah',
    imageUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Tas mukena parasut di musholla lantai 2',
    custody: 'pos_satpam',
    posId: 'pos-fst-lobby',
    locationDetail: 'Musholla Lt. 2 FST • Kemarin',
    reportedDate: '2026-11-20T14:30:00',
  },
  {
    id: '6',
    title: 'Kalkulator Casio FX-991EX',
    category: 'elektronik',
    categoryLabel: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Kalkulator ilmiah saintifik di meja praktikum',
    custody: 'pos_satpam',
    posId: 'pos-fst-lobby',
    locationDetail: 'Lab Fisika Dasar • 2h lalu',
    reportedDate: '2026-11-19T11:00:00',
  },
  {
    id: '7',
    title: 'Kunci Motor Honda Vario',
    category: 'lainnya',
    categoryLabel: 'Kunci & Aksesoris',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Kunci kontak motor dengan gantungan pita hitam',
    custody: 'pos_satpam',
    posId: 'pos-gerbang-barat',
    locationDetail: 'Pos Gerbang Barat • 3h lalu',
    reportedDate: '2026-11-18T09:00:00',
  },
  {
    id: '8',
    title: 'Flashdisk Kingston 64GB',
    category: 'elektronik',
    categoryLabel: 'Elektronik',
    imageUrl: 'https://images.unsplash.com/photo-1477949331575-2763034b5fb5?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Flashdisk USB metal perak di meja lab komputer',
    custody: 'pos_satpam',
    posId: 'pos-lab-terpadu',
    locationDetail: 'Lab Terpadu Lt. 3 • 5h lalu',
    reportedDate: '2026-11-16T14:30:00',
  },
  {
    id: '9',
    title: 'Jaket Hoodie Hitam FST',
    category: 'tas',
    categoryLabel: 'Pakaian & Tas',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
    imageAlt: 'Jaket hoodie hitam tertinggal di kursi kuliah',
    custody: 'dibawa_penemu',
    locationDetail: 'R. Kuliah 202 • 12h lalu',
    reportedDate: '2026-11-09T11:00:00',
  }
]

export const CATEGORIES: { id: ItemCategory; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'elektronik', label: 'Elektronik' },
  { id: 'dokumen', label: 'Dokumen/KTM' },
  { id: 'botol', label: 'Botol Minum' },
  { id: 'tas', label: 'Tas/Dompet' },
  { id: 'ibadah', label: 'Perlengkapan Ibadah' },
  { id: 'lainnya', label: 'Lainnya' },
]

export const POS_SATPAM_LIST: PosSatpamInfo[] = [
  {
    id: 'pos-fst-lobby',
    name: 'Pos Satpam Utama Lobby FST',
    code: 'QR-FST-01',
    location: 'Lantai 1, Lobby Fakultas Sains & Teknologi',
    officer: 'Bpk. Agus Santoso',
    shift: 'Shift Pagi (07.00 - 15.00 WIB)',
    storedItemsCount: 6,
    operatingHours: '07.00 - 21.00 WIB',
  },
  {
    id: 'pos-gerbang-barat',
    name: 'Pos Satpam Gerbang Barat',
    code: 'QR-FST-02',
    location: 'Gerbang Masuk Barat UIN Sunan Kalijaga',
    officer: 'Bpk. Bambang Triyono',
    shift: 'Shift Siang (14.00 - 22.00 WIB)',
    storedItemsCount: 2,
    operatingHours: '24 Jam Operasional',
  },
  {
    id: 'pos-lab-terpadu',
    name: 'Pos Satpam Gedung Lab Terpadu',
    code: 'QR-FST-03',
    location: 'Selasar Barat Lab Sains & Komputer',
    officer: 'Bpk. Hendra Saputra',
    shift: 'Shift Pagi (07.00 - 15.00 WIB)',
    storedItemsCount: 4,
    operatingHours: '07.30 - 18.00 WIB',
  },
]

export const INITIAL_CLAIM_TICKETS: ClaimTicket[] = [
  {
    id: 'ticket-1',
    ticketNumber: 'CLM-FST-8821',
    itemTitle: 'Kalkulator Casio FX-991EX Abu-abu',
    itemCategory: 'elektronik',
    categoryLabel: 'Elektronik',
    itemImageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?q=80&w=600&auto=format&fit=crop',
    posLocation: 'Pos Satpam Utama Lobby FST',
    status: 'ready_for_pickup',
    statusLabel: 'Siap Diambil di Pos',
    otpCode: '582194',
    createdAt: 'Hari ini, 10:15 WIB',
    pickupDeadline: 'Besok, 21:00 WIB',
    matchedSecretFeature: 'Stiker logo HIMATIF di dalam penutup baterai',
    timeline: [
      {
        step: 1,
        title: 'Klaim Diajukan',
        desc: 'Hari ini, 10:15 WIB oleh Bayu Wicaksono',
        isDone: true,
        isCurrent: false,
      },
      {
        step: 2,
        title: 'Verifikasi Ciri Rahasia',
        desc: 'Cocok 100% dengan data temuan satpam',
        isDone: true,
        isCurrent: false,
      },
      {
        step: 3,
        title: 'Pengambilan Fisik',
        desc: 'Menunggu kedatangan Anda di Pos Satpam Utama',
        isDone: false,
        isCurrent: true,
      },
    ],
  },
  {
    id: 'ticket-2',
    ticketNumber: 'CLM-FST-7104',
    itemTitle: 'Tumbler Stainless Hitam Matte',
    itemCategory: 'botol',
    categoryLabel: 'Botol Minum',
    itemImageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
    posLocation: 'Pos Satpam Gedung Lab Terpadu',
    status: 'completed',
    statusLabel: 'Selesai Diserahterimakan',
    otpCode: '319048',
    createdAt: '3 hari yang lalu',
    pickupDeadline: 'Sudah Diambil',
    matchedSecretFeature: 'Goresan kecil di dekat tutup botol',
    timeline: [
      {
        step: 1,
        title: 'Klaim Diajukan',
        desc: '18 Nov 2026, 09:20 WIB',
        isDone: true,
        isCurrent: false,
      },
      {
        step: 2,
        title: 'Verifikasi Ciri Rahasia',
        desc: 'Telah divalidasi oleh Pak Hendra',
        isDone: true,
        isCurrent: false,
      },
      {
        step: 3,
        title: 'Diserahterimakan',
        desc: 'Telah diserahkan fisik pada 18 Nov 2026, 14:10 WIB',
        isDone: true,
        isCurrent: false,
      },
    ],
  },
]

export const INITIAL_AI_MATCHES: AiMatchItem[] = [
  {
    id: 'aimatch-1',
    lostItemTitle: 'TWS Soundcore R50i Hitam (Milik Anda)',
    lostItemImageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    foundItemTitle: 'TWS Soundcore Hitam Ditemukan di Musholla',
    foundItemImageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    foundLocation: 'Musholla Lantai 2 FST',
    custodyPos: 'Pos Satpam Utama Lobby FST',
    matchScore: 94,
    timeAgo: 'Ditemukan 2 jam lalu',
    status: 'unresolved',
    evidenceList: [
      {
        factor: 'Kemiripan Visual (Vision Model)',
        description: 'Bentuk case oval matte & warna hitam 98% identik',
        scorePercent: 98,
      },
      {
        factor: 'Kuis Rahasia (Zero-Knowledge)',
        description: 'Stiker logo di dalam case earbud sesuai dengan laporan Anda',
        scorePercent: 95,
      },
      {
        factor: 'Kedekatan Rute & Waktu',
        description: 'Ditemukan di Musholla Lt. 2, sejalur dengan rute kuliah terakhir',
        scorePercent: 90,
      },
    ],
  },
  {
    id: 'aimatch-2',
    lostItemTitle: 'TWS Soundcore R50i Hitam (Milik Anda)',
    lostItemImageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    foundItemTitle: 'Earphone Wireless Hitam Tanpa Case',
    foundItemImageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=600&auto=format&fit=crop',
    foundLocation: 'Selasar Depan Lab Komputer 3',
    custodyPos: 'Pos Satpam Gedung Lab Terpadu',
    matchScore: 76,
    timeAgo: 'Ditemukan kemarin sore',
    status: 'unresolved',
    evidenceList: [
      {
        factor: 'Kemiripan Visual',
        description: 'Warna hitam serupa namun tipe earbud berbeda model',
        scorePercent: 75,
      },
      {
        factor: 'Lokasi',
        description: 'Ditemukan di selasar lab praktikum FST',
        scorePercent: 80,
      },
    ],
  },
  {
    id: 'aimatch-3',
    lostItemTitle: 'TWS Soundcore R50i Hitam (Milik Anda)',
    lostItemImageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    foundItemTitle: 'Casing Earphone Hitam Kosong',
    foundItemImageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop',
    foundLocation: 'Meja Diskusi Kantin Saintek',
    custodyPos: 'Pos Satpam Gerbang Barat',
    matchScore: 58,
    timeAgo: 'Ditemukan 3 hari lalu',
    status: 'unresolved',
    evidenceList: [
      {
        factor: 'Merek Berbeda',
        description: 'Bentuk dimensi case lebih pipih dari Soundcore R50i',
        scorePercent: 55,
      },
    ],
  },
]

export function filterLostFoundItems(
  items: LostFoundItem[],
  criteria: FilterCriteria,
  searchQuery: string = ''
): LostFoundItem[] {
  const q = searchQuery.trim().toLowerCase()
  const now = new Date('2026-11-21T19:39:00').getTime()

  return items.filter((item) => {
    if (q) {
      const match =
        item.title.toLowerCase().includes(q) ||
        item.locationDetail.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      if (!match) return false
    }

    if (criteria.category !== 'all' && item.category !== criteria.category) {
      return false
    }

    if (criteria.custody !== 'all' && item.custody !== criteria.custody) {
      return false
    }

    if (criteria.posId !== 'all') {
      if (criteria.posId === 'dibawa_penemu') {
        if (item.custody !== 'dibawa_penemu') return false
      } else if (item.posId !== criteria.posId) {
        return false
      }
    }

    if (criteria.dateRange !== 'all' && item.reportedDate) {
      const itemTime = new Date(item.reportedDate).getTime()
      const diffHours = (now - itemTime) / (1000 * 60 * 60)

      if (criteria.dateRange === 'today' && diffHours > 24) return false
      if (criteria.dateRange === '3days' && diffHours > 72) return false
      if (criteria.dateRange === '7days' && diffHours > 168) return false
      if (criteria.dateRange === '30days' && diffHours > 720) return false
    }

    return true
  })
}
