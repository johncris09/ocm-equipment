import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CImage, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from './../assets/images/logo-sm.png'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { InvalidTokenError, jwtDecode } from 'jwt-decode'
// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [user, setUser] = useState([])

  useEffect(() => {
    try {
      setUser(jwtDecode(localStorage.getItem('equipmentToken')))
      // Continue with the rest of your code if the token is valid
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        // Handle the specific error related to an invalid token
        console.error('Invalid token:', error.message)
      } else {
        // Handle other types of errors
        console.error('Unexpected error:', error.message)
      }
    }
  }, [])
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-md-flex" to="/">
        <CImage src={logo} height={100} className="mt-3 mb-1" />
      </CSidebarBrand>
      <CSidebarBrand className="d-md-flex" to="/">
        <p className="text-center h6">Equipment Spare Parts Monitoring System</p>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation(user)} />
        </SimpleBar>
      </CSidebarNav>

      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
