import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import { CButton, CCol, CForm, CFormInput } from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  toSentenceCase,
} from 'src/components/SystemConfiguration'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    const userInfo = jwtDecode(localStorage.getItem('equipmentToken'))
    setEditId(userInfo.id)
    setValidated(false)
  }, [])

  const form = useFormik({
    initialValues: {
      password: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setOperationLoading(true)
        await api
          .put('user/change_password/' + editId, values)
          .then((response) => {
            toast.success(response.data.message)
            setValidated(false)
            localStorage.removeItem('equipmentToken')
            navigate('/login', { replace: true })
          })
          .catch((error) => {
            console.info(error)
            // toast.error(handleError(error))
          })
          .finally(() => {
            setOperationLoading(false)
          })
      } else {
        toast.warning('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type } = e.target
    if (type === 'text' && name !== 'password') {
      form.setFieldValue(name, toSentenceCase(value))
    } else {
      form.setFieldValue(name, value)
    }
  }

  return (
    <>
      <ToastContainer />
      <RequiredFieldNote />
      <CForm
        className="row g-3 needs-validation mt-4"
        noValidate
        validated={validated}
        onSubmit={form.handleSubmit}
        style={{ position: 'relative' }}
      >
        <CCol md={12}>
          <CFormInput
            type="password"
            feedbackInvalid="Password is required."
            label={requiredField('Password')}
            name="password"
            onChange={handleInputChange}
            value={form.values.password}
            required
            placeholder="Password"
          />
        </CCol>

        <hr />
        <CCol xs={12}>
          <CButton color="primary" type="submit" className="float-end">
            Update Password
          </CButton>
        </CCol>
      </CForm>
      {operationLoading && <DefaultLoading />}
    </>
  )
}

export default ChangePassword
