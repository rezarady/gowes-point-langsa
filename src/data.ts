import { Leaf, Heart, Mountain } from 'lucide-react'

// ========== DATA (mudah diganti API) ==========
export type BikeType = 'Gunung' | 'Lipat' | 'Keranjang' | 'Upin-Ipin'
export type BikeItem = {
  id: string; nama: string; jenis: BikeType; hargaJam: number; hargaHari: number;
  status: 'Tersedia' | 'Sedang Disewa'; kapasitas: string; stok?: number;
  gambar: string; deskripsi: string; spesifikasi: string[]
}

export const bikes: BikeItem[] = [
  { id: 'G-01', nama: 'Sepeda Gunung', jenis: 'Gunung', hargaJam: 15000, hargaHari: 65000, status: 'Tersedia', kapasitas: 'Dewasa • 26-29 inch', gambar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80', deskripsi: 'MTB tangguh untuk rute kota hingga semi-offroad pesisir Langsa. Suspensi depan empuk, 21 speed.', spesifikasi: ['Frame MTB Alloy', 'Suspensi Fork', '21 Speed Shimano', 'Rem Cakram'] },
  { id: 'L-01', nama: 'Sepeda Lipat', jenis: 'Lipat', hargaJam: 15000, hargaHari: 65000, status: 'Tersedia', kapasitas: 'Dewasa • 20 inch', gambar: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80', deskripsi: 'Praktis dilipat, mudah dibawa dan disimpan. Lincah untuk keliling kota.', spesifikasi: ['Frame Lipat Alloy', 'Lipat 3 Detik', '7 Speed', 'Berat Ringan'] },
  { id: 'K-01', nama: 'Sepeda Keranjang', jenis: 'Keranjang', hargaJam: 15000, hargaHari: 65000, status: 'Tersedia', kapasitas: 'Dewasa • 26 inch', gambar: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80', deskripsi: 'Sepeda santai dengan keranjang depan — cocok untuk belanja dan jalan sore.', spesifikasi: ['Frame City 26"', 'Keranjang Rotan', 'Jok Empuk', 'Bel & Reflektor'] },
  { id: 'U-01', nama: 'Sepeda Upin-Ipin', jenis: 'Upin-Ipin', hargaJam: 15000, hargaHari: 65000, status: 'Tersedia', kapasitas: '2 Dewasa • 26 inch', gambar: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&q=80', deskripsi: 'Sepeda tandem berboncengan — kayuh berdua lebih seru. Stok hanya 1 unit, siapa cepat dia dapat.', spesifikasi: ['Frame Tandem Steel', '2 Jok & 2 Pedal', 'Rem Cakram', 'Kapasitas 160 kg'] },
]

// Pricelist resmi (berlaku semua jenis sepeda)
export type Paket = { id: string; label: string; sub?: string; price: number }
export const PACKAGES: Paket[] = [
  { id: '1jam', label: '1 Jam', price: 15000 },
  { id: '2jam', label: '2 Jam', price: 20000 },
  { id: '3jam', label: '3 Jam', price: 25000 },
  { id: '5jam', label: '5 Jam', price: 35000 },
  { id: 'fullday', label: 'Full Day', sub: '06.00–19.00', price: 65000 },
  { id: 'sunrise', label: 'Sunrise', sub: '06.00–09.00', price: 25000 },
  { id: 'sunset', label: 'Sunset', sub: '16.00–19.00', price: 25000 },
]
export const packageById = (id: string): Paket => PACKAGES.find(p => p.id === id) ?? PACKAGES[1]

// Stok live per jenis (mudah diganti API): Gunung 13, Lipat 6, Keranjang 3, Upin-Ipin 1.
export const stokMap: Record<string, number> = { 'G-01': 13, 'L-01': 6, 'K-01': 3, 'U-01': 1 }
export const stokOf = (b: BikeItem) => b.status === 'Tersedia' ? (stokMap[b.id] ?? 0) : 0

// ========== JADWAL PER JAM (operasional 06.00–19.00, menit sejak tengah malam) ==========
export const OPEN_HOUR = 6
export const CLOSE_HOUR = 19
export const HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i)
const PAKET_HOURS: Record<string, number> = { '1jam': 1, '2jam': 2, '3jam': 3, '5jam': 5 }
const FIXED_WINDOW: Record<string, [number, number]> = { fullday: [360, 1140], sunrise: [360, 540], sunset: [960, 1140] }
export function slotOf(jam: string, paketId: string): { start: number; end: number } {
  if (FIXED_WINDOW[paketId]) { const [s, e] = FIXED_WINDOW[paketId]; return { start: s, end: e } }
  const [h, m] = jam.split(':').map(Number)
  const s = (h || 0) * 60 + (m || 0)
  return { start: s, end: Math.min(s + (PAKET_HOURS[paketId] ?? 2) * 60, CLOSE_HOUR * 60) }
}
export const overlap = (a: { start: number; end: number }, b: { start: number; end: number }) =>
  a.start < b.end && b.start < a.end
export const fmtJam = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}.${String(mins % 60).padStart(2, '0')}`

// ========== DATABASE STOK PER UNIT (23 sepeda, ID masing-masing) ==========
export type UnitStatus = 'tersedia' | 'disewa' | 'servis'
export type BikeUnit = { uid: string; typeId: string; label: string }
function buildUnits(prefix: string, typeId: string, nama: string, n: number): BikeUnit[] {
  return Array.from({ length: n }, (_, i) => ({
    uid: `${prefix}-${String(i + 1).padStart(2, '0')}`,
    typeId,
    label: `${nama} #${i + 1}`,
  }))
}
export const initialUnits: BikeUnit[] = [
  ...buildUnits('GUN', 'G-01', 'Gunung', 13),
  ...buildUnits('LIP', 'L-01', 'Lipat', 6),
  ...buildUnits('KRJ', 'K-01', 'Keranjang', 3),
  ...buildUnits('UPN', 'U-01', 'Upin-Ipin', 1),
]

export const ruteList = [
  { nama: 'Rute Santai Kota', jarak: '8 km', kesulitan: 'Mudah', waktu: '45-60 menit', deskripsi: 'Keliling pusat kota, alun-alun, dan taman — cocok untuk pemula dan sore santai.', ikon: Leaf },
  { nama: 'Rute Keluarga Ceria', jarak: '5 km', kesulitan: 'Mudah', waktu: '30-45 menit', deskripsi: 'Jalur datar ramah anak, cocok untuk tandem dan sepeda anak. Banyak spot foto.', ikon: Heart },
  { nama: 'Rute Petualangan Pesisir', jarak: '18 km', kesulitan: 'Menengah', waktu: '90-120 menit', deskripsi: 'Menuju area pesisir dan hutan kota. Disarankan MTB atau sepeda listrik.', ikon: Mountain },
]

export const testi = [
  { nama: 'Rina & Keluarga', avatar: 'https://i.pravatar.cc/150?img=5', rating: 5, isi: 'Pelayanan ramah banget! Sepedanya bersih dan terawat. Anak-anak happy gowes keliling kota.' },
  { nama: 'Fajar Pratama', avatar: 'https://i.pravatar.cc/150?img=12', rating: 5, isi: 'Booking lewat WA cepat direspon. Harga terjangkau, sepeda gunungnya enak dipakai jauh.' },
  { nama: 'Cut Aulia', avatar: 'https://i.pravatar.cc/150?img=9', rating: 4, isi: 'Rute yang direkomendasikan keren! Upin-ipinnya seru buat pasangan. Pasti sewa lagi.' },
  { nama: 'Teuku Rizal', avatar: 'https://i.pravatar.cc/150?img=15', rating: 5, isi: 'Sepeda MTB-nya mantap untuk rute pesisir. Helm dan kunci sudah termasuk, praktis!' },
]

export const faqs = [
  { q: 'Apa syarat menyewa sepeda?', a: 'Cukup membawa KTP/SIM/Kartu Pelajar yang masih berlaku dan mengisi formulir pemesanan. Untuk penyewa di bawah 17 tahun wajib didampingi orang tua/wali.' },
  { q: 'Apakah harus meninggalkan identitas?', a: 'Ya, kami menahan satu kartu identitas asli sebagai jaminan selama masa sewa. Identitas akan dikembalikan saat sepeda dikembalikan dalam kondisi baik.' },
  { q: 'Bagaimana jika terlambat mengembalikan sepeda?', a: 'Keterlambatan dihitung per jam sesuai tarif sepeda. Jika lebih dari 2 jam tanpa konfirmasi, akan dikenakan biaya tambahan harian. Hubungi kami via WhatsApp jika ada kendala.' },
  { q: 'Apakah bisa melakukan pemesanan untuk rombongan?', a: 'Bisa! Untuk rombongan 10 sepeda atau lebih, silakan hubungi kami minimal H-1 agar kami bisa menyiapkan armada dan memberikan penawaran khusus.' },
  { q: 'Bagaimana jika cuaca buruk?', a: 'Jika hujan lebat saat jadwal sewa, Anda dapat reschedule tanpa biaya tambahan (maksimal H+2) atau refund 100% jika pembatalan dilakukan 3 jam sebelum jadwal.' },
]

export const WA_NUMBER = '6282369649970'
export const WA_DISPLAY = '+62 823-6964-9970'
export const waLink = (pesan: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`

export function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}
