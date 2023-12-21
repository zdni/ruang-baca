// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// components
import SvgColor from '../../../components/svg-color'

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
  document: icon('ic_folder'),
  user: icon('ic_user'),
  order: icon('ic_menu_item'),
  master: icon('ic_dashboard'),
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Dokumen', path: PATH_DASHBOARD.document.root, icon: ICONS.document, roles: ['admin', 'staff', 'lecture', 'student'] },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      { title: 'Transaksi', path: PATH_DASHBOARD.order.list, icon: ICONS.order, roles: ['admin', 'staff', 'lecture', 'student'] },
      { title: 'Pengguna', path: PATH_DASHBOARD.user.list, icon: ICONS.user, roles: ['admin', 'staff'] },
      { title: 'Buat Dokumen', path: PATH_DASHBOARD.document.form, icon: ICONS.document, roles: ['admin', 'staff'] },
      {
        title: 'Data',
        path: PATH_DASHBOARD.setting.root,
        icon: ICONS.master,
        children: [
          { title: 'Tipe Dokumen', path: PATH_DASHBOARD.setting.type },
          { title: 'Kategori Dokumen', path: PATH_DASHBOARD.setting.category },
          { title: 'Lokasi Penyimpanan', path: PATH_DASHBOARD.setting.location },
          { title: 'Peminatan Jurusan', path: PATH_DASHBOARD.setting.specialization },
        ],
        roles: ['admin', 'staff']
      },
    ],
  },


]

export default navConfig
