import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CRow,
} from '@coreui/react'
import logo from './../../../assets/images/logo-sm.png'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading, api, handleError } from 'src/components/SystemConfiguration'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('equipmentToken') // Assuming the token is stored in local storage
    if (token) {
      // If the token is set, navigate to the equipment
      navigate('/equipment', { replace: true })
    }
  }, [navigate])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoading(true)
        await api
          .post('login', values)
          .then((response) => {
            if (response.data.status) {
              toast.success(response.data.message)
              localStorage.setItem('equipmentToken', response.data.token)

              navigate('/equipment', { replace: true })
            } else {
              toast.error(response.data.message)
            }
          })
          .catch((error) => {
            toast.error(handleError(error))
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={12} lg={6} xl={6}>
            <CCardGroup>
              <CCard className="p-4" style={{ position: 'relative' }}>
                <CCardBody>
                  <div className="text-center">
                    <CImage
                      rounded
                      src={logo}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '150px',
                        maxHeight: '150px',
                      }}
                    />
                  </div>

                  <CForm
                    className="row g-3 needs-validation mt-2"
                    onSubmit={formik.handleSubmit}
                    // noValidate
                    validated={validated}
                  >
                    <h3 className="text-center ">
                      Equipment Spare <br /> Parts Monitoring System
                    </h3>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>

                    <CFormInput
                      className="text-center py-2"
                      type="text"
                      placeholder="Username"
                      // feedbackInvalid="Username is required."
                      name="username"
                      onChange={handleInputChange}
                      value={formik.values.username}
                      required
                    />
                    <CFormInput
                      className="text-center py-2"
                      type="password"
                      placeholder="Password"
                      // feedbackInvalid="Password is required."
                      name="password"
                      onChange={handleInputChange}
                      value={formik.values.password}
                      required
                    />
                    <CButton type="submit" color="primary">
                      Login
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
              {loading && <DefaultLoading />}
              <div
                style={{
                  position: 'fixed',
                  bottom: -5,
                  right: 10,
                  // width: '100%',
                  // height: '100%',
                  // backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
                  // zIndex: -1, // Ensure the backdrop is above other content
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <p style={{ fontSize: '10px' }}>
                  Date Last Update: {process.env.REACT_APP_DATE_UPDATED}
                </p>
              </div>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
