import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import CompactLayout from '../layouts/compact'
import DashboardLayout from '../layouts/dashboard'
import MainLayout from '../layouts/main'
//
import {
  // Auth
  LoginPage,
  // Dashboard
  DocumentPage,
  DocumentFormPage,
  OrderPage,
  OrdersPage,
  UserPage,
  UsersPage,
  // Data
  DocumentTypePage,
  DocumentCategoryPage,
  SpecializationPage,
  StockLocationPage,
  // Main
  CatalogPage,
  HomePage,
  // Compact
  Page403,
  Page404,
  Page500,
} from './elements'

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        { path: 'login', element: <LoginPage /> },
      ],
    },

    // User Routes
    {
      path: 'beranda',
      element: <DashboardLayout />,
      children: [
        { element: <OrdersPage />, index: true },
        { 
          path: 'dokumen', 
          children: [
            { path: 'form', element: <DocumentFormPage /> },
            { path: 'form/:id', element: <DocumentFormPage /> },
            { path: ':id', element: <DocumentPage /> },
          ]
        },
        {
          path: 'pengguna',
          children: [
            { element: <UserPage />, index: true },
            { path: 'daftar', element: <UsersPage /> },
            { path: ':id', element: <UserPage /> },
          ]
        },
        {
          path: 'peminjaman',
          children: [
            { path: ':id', element: <OrderPage /> },
            { path: 'daftar', element: <OrdersPage /> },
          ]
        },
        {
          path: 'pengaturan',
          children: [
            { path: 'tipe-dokumen', element: <DocumentTypePage />},
            { path: 'kategori-dokumen', element: <DocumentCategoryPage />},
            { path: 'lokasi-penyimpanan', element: <StockLocationPage />},
            { path: 'peminatan-jurusan', element: <SpecializationPage /> },
          ]
        },
      ]
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { 
          path: 'koleksi-pustaka',
          children: [
            { element: <CatalogPage />, index: true },
            { path: ':id', element: <DocumentPage /> }
          ] 
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}