import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Equipment = React.lazy(() => import('./views/equipment/Equipment'))
const EquipmentDetails = React.lazy(() => import('./views/equipment/EquipmentDetails'))

const User = React.lazy(() => import('./views/user/User'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/equipment', name: 'Equipment', element: Equipment },
  { path: '/equipment/details/:id', name: 'Equipment Details', element: EquipmentDetails },

  { path: '/user', name: 'User', element: User },
]

export default routes
