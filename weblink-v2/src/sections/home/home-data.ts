import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const asset = (name: string) => `${CONFIG.assetsDir}/assets/venturo/${name}`;

export const CONTACT = {
  wa: 'https://wa.me/6285128043814',
  email: 'hello@venturo.id',
};

// ----------------------------------------------------------------------

export const HERO = {
  badge: 'Gratis Selamanya',
  title: 'Satu Link untuk Semua Kebutuhan Bio Anda',
  description:
    'Weblink adalah platform pembuat bio link terbaik yang memungkinkan Anda menggabungkan semua tautan, portofolio, dan sosial media dalam satu halaman elegan.',
  cta: 'Buat Weblink Sekarang',
  stats: [
    { value: 10, suffix: 'K+', label: 'Pengguna Aktif' },
    { value: 100, suffix: '+', label: 'Desain Kustom' },
  ],
  trustedLabel: 'Dipercaya Oleh Kreator & Bisnis:',
};

/**
 * Logo klien/brand untuk row "Dipercaya Oleh" (trusted-by).
 * File logo ada di `public/assets/venturo/clients/`.
 * Untuk menambah klien: taruh file di folder itu lalu daftarkan di sini.
 */
export const CLIENTS: { name: string; logo: string }[] = [
  { name: 'Qoin', logo: asset('clients/qoin.webp') },
  { name: 'Shipper', logo: asset('clients/shipper.webp') },
  { name: 'Hayyu Skin Clinic', logo: asset('clients/hayyu.webp') },
  { name: 'Bobobox', logo: asset('clients/bobobox.webp') },
  { name: 'Liputan 6', logo: asset('clients/liputan6.webp') },
  { name: 'Powmeals', logo: asset('clients/powmeals.webp') },
  { name: 'Bolong', logo: asset('clients/bolong.webp') },
  { name: 'Majoo', logo: asset('clients/majoo.webp') },
  { name: 'Pudu', logo: asset('clients/pudu.webp') },
  { name: 'Humanis', logo: asset('clients/humanis.webp') },
  { name: 'Wisdom Crowd', logo: asset('clients/wisdom-crowd.webp') },
  { name: 'Bio Farma', logo: asset('clients/biofarma.webp') },
  { name: 'Kemenkes', logo: asset('clients/kemenkes.webp') },
  { name: 'Olahkarsa', logo: asset('clients/olahkarsa.webp') },
];

// ----------------------------------------------------------------------

export const PROBLEM = {
  caption: 'Kenapa Butuh Weblink?',
  title: 'Kesulitan Membagikan Banyak Tautan Sekaligus?',
  image: asset('weblink/problem.webp'),
  items: [
    {
      title: 'Bio Sosial Media Hanya Memuat Satu Tautan',
      description:
        'Instagram dan TikTok hanya mengizinkan satu tautan di bio. Bagaimana jika Anda ingin mempromosikan beberapa produk, video, atau artikel sekaligus?',
      icon: 'solar:link-broken-outline',
    },
    {
      title: 'Portofolio dan Kontak Tersebar',
      description:
        'Klien kesulitan menemukan portofolio, WhatsApp, dan sosial media Anda karena tersebar di berbagai tempat yang berbeda.',
      icon: 'solar:folder-error-outline',
    },
    {
      title: 'Sulit Melacak Kunjungan',
      description:
        'Membagikan tautan langsung tidak memberikan Anda wawasan analitik siapa saja dan berapa banyak orang yang mengklik tautan Anda.',
      icon: 'solar:graph-down-outline',
    },
  ],
  closing: 'Dan akhirnya… Anda kehilangan potensi audiens, pelanggan, bahkan peluang kerja sama.',
};

// ----------------------------------------------------------------------

export const SOLUTION = {
  caption: 'Solusi dari Weblink',
  title: 'Satu Halaman untuk Berbagai Kebutuhan Digital Anda',
  image: asset('weblink/solution.png'),
  items: [
    {
      title: 'Satu Tautan untuk Semua',
      icon: asset('ikon-tim-programmer-berdedikasi.webp'),
      description:
        'Gabungkan tautan WhatsApp, Instagram, portofolio, toko online, hingga artikel terbaru Anda dalam satu link yang rapi dan mudah diakses.',
    },
    {
      title: 'Kustomisasi Tema Bebas',
      icon: asset('ikon-quality-assurance-supervisi.webp'),
      description:
        'Sesuaikan warna, background, font, hingga bentuk tombol agar cocok dengan identitas personal atau merek bisnis Anda (Brand Identity).',
    },
    {
      title: 'Desain Super Cepat',
      icon: asset('ikon-respon-cepat.webp'),
      description:
        'Dengan fitur Live Editor drag-and-drop, Anda bisa membuat dan memperbarui tampilan halaman Anda hanya dalam hitungan detik.',
    },
    {
      title: 'Analitik Terintegrasi',
      icon: asset('ikon-otomatisasi-pengembangan-software.webp'),
      description:
        'Pantau langsung statistik pengunjung, jumlah klik tombol, dan sumber traffic untuk membantu Anda mengukur efektivitas kampanye.',
    },
    {
      title: 'SEO Friendly',
      icon: asset('ikon-laporan-progres-proyek.webp'),
      description:
        'Halaman Weblink Anda dioptimalkan untuk mesin pencari, membuat profil Anda lebih mudah ditemukan di Google pencarian.',
    },
  ],
};

// ----------------------------------------------------------------------

export const FOCUS = {
  caption: 'Fokus Kembangkan Diri Anda',
  title: 'Fokus pada Konten Anda, Biar Urusan Tampilan Kami yang Tangani',
  description:
    'Weblink dirancang khusus agar Kreator, Influencer, dan Pelaku Usaha bisa lebih fokus menciptakan karya atau berjualan tanpa perlu repot membangun website dari nol.',
  highlight: 'Siapa Saja Pengguna Weblink?',
  image: asset('weblink/hero.png'),
  roles: [
    'Content Creator & Influencer',
    'Pemilik Bisnis (UMKM / Toko Online)',
    'Freelancer & Desainer',
    'Gamer & Streamer',
    'Musisi & Seniman',
    'Penulis & Blogger',
    'Profesional & Konsultan',
  ],
};

// ----------------------------------------------------------------------

export const MANAGEMENT = {
  caption: 'Fitur Terbaik',
  title: 'Kemudahan yang Telah Teruji',
  description: 'Ribuan kreator telah menggunakan Weblink sebagai identitas digital utama mereka.',
  phone: asset('app-phone.webp'),
  items: [
    {
      title: 'Dashboard Pengelolaan Mudah',
      icon: asset('ikon-penjadwalan-proyek.webp'),
      description:
        'Kelola semua link, tombol, teks, dan gambar Anda melalui satu layar kontrol (dashboard) yang responsif dan sangat mudah digunakan.',
    },
    {
      title: 'Pratinjau Langsung (Live Preview)',
      icon: asset('ikon-monitoring-proyek.webp'),
      description:
        'Lihat perubahan halaman biolink Anda secara langsung di tampilan layar ponsel virtual tanpa perlu menyimpannya terlebih dahulu.',
    },
    {
      title: 'Banyak Pilihan Blok Konten',
      icon: asset('ikon-laporan-progres-proyek.webp'),
      description:
        'Tambahkan blok tautan dasar, tautan sosial media, video YouTube tertanam, gambar, hingga daftar panjang sekaligus dalam sekali klik.',
    },
    {
      title: 'Ramah Seluler (Mobile-First)',
      icon: asset('ikon-otomatisasi-pengembangan-software.webp'),
      description:
        'Tampilan otomatis menyesuaikan dengan sempurna (seamless) di berbagai ukuran layar, khususnya di smartphone pengikut Anda.',
    },
    {
      title: 'Akses 24/7 Tanpa Down Time',
      icon: asset('garansi-bug-project-selesai.webp'),
      description:
        'Server kami dikelola secara profesional untuk memastikan tautan Anda dapat diakses kapan pun pengikut Anda membutuhkannya.',
    },
    {
      title: 'Statistik Waktu Nyata (Real-time)',
      icon: asset('ikon-quality-assurance-supervisi.webp'),
      description:
        'Ketahui persis tombol mana yang memiliki konversi (CTR) tertinggi setiap harinya melalui fitur insight bawaan.',
    },
  ],
};

// ----------------------------------------------------------------------

export const RESOURCE = {
  titleLines: ['Platform', 'Digital Identity Terdepan', 'di Indonesia'],
  description:
    'Bingung cara membuat website pribadi? Weblink hadir memberikan kemudahan membuat portofolio dan agregator tautan (link-in-bio) hanya dalam waktu kurang dari 5 menit.',
  videoUrl: 'https://www.youtube.com/watch?v=1W35KcCQqww',
  videoThumb: asset('video-thumb-manajemen-proyek.webp'),
  videoLabel: 'Cara Membuat Weblink Anda',
};

// ----------------------------------------------------------------------

export const SPECIAL_OFFER = {
  heading: 'DAFTAR SEKARANG!!',
  promoStrong: '100% GRATIS Selamanya',
  promo: 'akses semua fitur inti Weblink tanpa batas dan bagikan ke audiens Anda tanpa syarat!',
  cta: 'Buat Akun Anda',
  note: 'Tanpa perlu kartu kredit',
  image: asset('weblink/cta.webp')
};

// ----------------------------------------------------------------------

export const TECH_STACK = {
  caption: 'Technology Stack',
  title: 'Teknologi yang Kami Kuasai',
  groups: [
    {
      label: 'Web Programmer',
      logos: [
        { name: 'Laravel', logo: 'logo-laravel.webp' },
        { name: 'Go', logo: 'logo-golang.webp' },
        { name: 'Node.js', logo: 'logo-nodejs.webp' },
        { name: 'React', logo: 'logo-react.webp' },
        { name: 'Vue.js', logo: 'logo-vuejs.webp' },
        { name: 'Angular', logo: 'logo-angularjs.webp' },
        { name: 'Bootstrap', logo: 'logo-bootstrap.webp' },
        { name: 'Tailwind CSS', logo: 'logo-tailwind-css.webp' },
        { name: 'MySQL', logo: 'logo-mysql.webp' },
        { name: 'MongoDB', logo: 'logo-mongodb.webp' },
        { name: 'Redis', logo: 'logo-redis.webp' },
        { name: 'RabbitMQ', logo: 'logo-rabbitmq.webp' },
        { name: 'Sentry', logo: 'logo-sentry.webp' },
      ],
    },
    {
      label: 'Mobile Programmer',
      logos: [
        { name: 'Flutter', logo: 'logo-flutter.webp' },
        { name: 'Kotlin', logo: 'logo-kotlin.webp' },
        { name: 'Swift', logo: 'logo-swift.webp' },
        { name: 'Firebase', logo: 'logo-firebase.webp' },
      ],
    },
    {
      label: 'UI / UX',
      logos: [{ name: 'Figma', logo: 'logo-figma.webp' }],
    },
  ],
};

// ----------------------------------------------------------------------

export const FAQS = {
  caption: 'Tanya Jawab',
  title: 'Pertanyaan yang Sering Diajukan',
  items: [
    {
      question:
        'Apakah Weblink benar-benar gratis untuk digunakan?',
      answer:
        'Ya! Fitur-fitur utama pembuat tautan, kustomisasi dasar, dan analitik dapat Anda gunakan 100% gratis selamanya. Kami juga merencanakan fitur premium di masa depan, tetapi Anda tidak dipaksa untuk berlangganan.',
    },
    {
      question: 'Berapa banyak jumlah tautan yang bisa saya masukkan?',
      answer:
        'Tidak ada batasan! Anda dapat menambahkan sebanyak mungkin tautan (URL), menyematkan video, maupun membuat ikon media sosial sesuka hati Anda.',
    },
    {
      question: 'Bagaimana cara menambahkan Weblink ke bio Instagram/TikTok saya?',
      answer:
        'Setelah halaman Anda dipublikasikan (Published), salin tautan unik (weblink.id/namakamu) lalu letakkan (paste) di kolom "Website" pada profil akun Instagram atau TikTok Anda.',
    },
    {
      question: 'Apakah saya bisa mengubah tema atau desain latar belakang?',
      answer:
        'Tentu. Anda dapat memilih latar belakang warna padat (solid color), efek gradasi (gradient), maupun mengunggah gambar latar belakang kustom Anda sendiri pada menu Settings proyek.',
    },
    {
      question: 'Apakah pengunjung perlu mengunduh aplikasi untuk melihat Weblink saya?',
      answer: 'Tidak. Weblink adalah aplikasi berbasis web. Halaman Anda dapat diakses langsung melalui browser apa pun di ponsel atau komputer pengunjung Anda.',
    },
    {
      question: 'Apakah saya dapat mengelola beberapa proyek sekaligus?',
      answer:
        'Ya. Anda bisa membuat banyak halaman Weblink (Multiple Projects) dengan satu akun saja, misalnya untuk profil pribadi dan untuk bisnis online yang Anda kelola.',
    },
    {
      question: 'Bagaimana keamanan data saya?',
      answer:
        'Kami sangat menjaga privasi dan keamanan basis data kami dengan infrastruktur cloud modern bersertifikasi keamanan. Kata sandi Anda juga terenkripsi sehingga tidak dapat diintip oleh siapapun.',
    },
  ],
};

// ----------------------------------------------------------------------

export const CLOSING_CTA = {
  title: 'Jadilah Bagian dari Ribuan Kreator',
  descriptionStrong: 'Klaim Tautan Unik Anda',
  description:
    'Buat, bagikan, dan kembangkan bisnis serta audiens Anda hari ini juga. Gratis, mudah, dan',
  descriptionEnd: 'jika tidak puas, Anda bisa menghapus akun kapan saja.',
  cta: 'Mulai Membuat Weblink',
  image: asset('weblink/dashboard.png'),
};
