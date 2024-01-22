import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilMonitor, cilUser } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = (userInfo) => {
  let items = [
    // {
    //   component: CNavItem,
    //   name: 'Dashboard',
    //   to: '/dashboard',
    //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // },
    {
      component: CNavItem,
      name: 'Equipment',
      to: '/equipment',
      icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'User',
      to: '/user',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
  ]
  return items
}

export default _nav
