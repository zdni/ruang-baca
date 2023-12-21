import { Suspense, lazy } from 'react'
// components
import LoadingScreen from '../components/loading-screen'

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  )

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')))

// TEST RENDER PAGE BY ROLE
// export const PermissionDeniedPage = Loadable(
//   lazy(() => import('../pages/dashboard/PermissionDeniedPage'))
// )

// DASHBOARD
export const DocumentCategoryPage = Loadable(lazy(() => import('../pages/dashboard/DocumentCategoryPage')))
export const DocumentFormPage = Loadable(lazy(() => import('../pages/dashboard/DocumentFormPage')))
export const DocumentPage = Loadable(lazy(() => import('../pages/DocumentPage')))
export const DocumentTypePage = Loadable(lazy(() => import('../pages/dashboard/DocumentTypePage')))
export const OrderPage = Loadable(lazy(() => import('../pages/dashboard/OrderPage')))
export const OrdersPage = Loadable(lazy(() => import('../pages/dashboard/OrdersPage')))
export const SpecializationPage = Loadable(lazy(() => import('../pages/dashboard/SpecializationPage')))
export const StockLocationPage = Loadable(lazy(() => import('../pages/dashboard/StockLocationPage')))
export const UserPage = Loadable(lazy(() => import('../pages/dashboard/UserPage')))
export const UsersPage = Loadable(lazy(() => import('../pages/dashboard/UsersPage')))


// MAIN
export const CatalogPage = Loadable(lazy(() => import('../pages/CatalogPage')))
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')))
export const Page403 = Loadable(lazy(() => import('../pages/Page403')))
export const Page404 = Loadable(lazy(() => import('../pages/Page404')))
export const Page500 = Loadable(lazy(() => import('../pages/Page500')))