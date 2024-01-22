import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { Login } from '@mui/icons-material'

const DefaultLayout = () => {
  const [user, setUser] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('equipmentToken') // Assuming the token is stored in local storage

    if (!token) {
      setUser(true)
      // If the token is set, navigate to the dashboard
      navigate('/login', { replace: true })
    }
  }, [user])

  // useEffect(() => {
  //   try {
  //     const token = localStorage.getItem('token')
  //     axios
  //       .get(ip + 'users/authinfo', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setUser(response.data)
  //       })
  //       .catch((error) => {
  //         // console.error('Error fetching user data:', error)

  //         navigate('/login', { replace: true })
  //         // return null
  //       })
  //   } catch (error) {
  //     // console.error('Error fetching user data:', error)
  //     navigate('/login', { replace: true })
  //     // return null
  //   }
  // }, [])

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </>
  )
}

export default DefaultLayout
