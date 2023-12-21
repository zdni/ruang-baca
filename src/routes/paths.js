function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/beranda'

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
}


export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  document: {
    root: '/koleksi-pustaka',
    form: path(ROOTS_DASHBOARD, '/dokumen/form'),
    detail: path(ROOTS_DASHBOARD, '/dokumen/detail'),
    
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/pengguna'),
    list: path(ROOTS_DASHBOARD, '/pengguna/daftar'),
  },
  order: {
    root: path(ROOTS_DASHBOARD, '/peminjaman'),
    list: path(ROOTS_DASHBOARD, '/peminjaman/daftar'),
    view: (id) => path(ROOTS_DASHBOARD, `/peminjaman/${id}`)
  },
  setting: {
    root: path(ROOTS_DASHBOARD, '/pengaturan'),
    category: path(ROOTS_DASHBOARD, '/pengaturan/kategori-dokumen'),
    location: path(ROOTS_DASHBOARD, '/pengaturan/lokasi-penyimpanan'),
    specialization: path(ROOTS_DASHBOARD, '/pengaturan/peminatan-jurusan'),
    type: path(ROOTS_DASHBOARD, '/pengaturan/tipe-dokumen'),
  }
}