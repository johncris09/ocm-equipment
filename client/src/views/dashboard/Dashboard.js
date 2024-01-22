import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const Dashboard = ({ cardTitle }) => {
  const [user, setUser] = useState([])

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('equipmentToken')))
  }, [])
  return (
    <>
      <h5>Welcome {user.firstname},</h5>
    </>
  )
}

export default Dashboard
