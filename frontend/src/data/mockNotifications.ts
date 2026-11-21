import type { AppNotification } from '../components/modals/NotificationDrawer'

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'aimatch',
    title: 'Radar AI: Kecocokan 94% Ditemukan',
    message: 'TWS Soundcore hitam yang Anda laporkan terdeteksi sangat mirip dengan temuan di Musholla Lt. 2 FST.',
    timeAgo: '10m lalu',
    isRead: false,
    actionLabel: 'Buka Radar AI',
    actionTarget: 'aimatch',
  },
  {
    id: 'notif-2',
    type: 'claim',
    title: 'Klaim Siap Diambil di Pos Satpam',
    message: 'Tiket #CLM-FST-8821 telah disetujui. Silakan tunjukkan kode OTP di Pos Utama Lobby FST.',
    timeAgo: '2j lalu',
    isRead: false,
    actionLabel: 'Buka Tiket Pengambilan',
    actionTarget: 'claim',
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'Layanan Pengamanan FST Aktif',
    message: 'Semua checkpoint Pos Satpam FST siap melayani serah terima barang temuan mahasiswa.',
    timeAgo: '1h lalu',
    isRead: true,
  },
]
