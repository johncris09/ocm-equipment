import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import { DeleteOutline, EditSharp, ManageHistory, ViewSidebarOutlined } from '@mui/icons-material'
import { ExportToCsv } from 'export-to-csv'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  handleError,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import { useNavigate } from 'react-router-dom'

const Course = ({ cardTitle }) => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchCourseLoading, setFetchDataLoading] = useState(true)
  const [courseOperationLoading, setEquipmentOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const column = [
    {
      accessorKey: 'plate_number',
      header: 'Plate #',
    },
    {
      accessorKey: 'vehicle_type',
      header: 'Vehicle Type',
    },
    {
      accessorKey: 'date_purchased',
      header: 'Date Purchased',
    },
  ]

  const fetchData = () => {
    api
      .get('equipment')
      .then((response) => {
        // console.info(response.data)
        setData(response.data)
        // setCourse(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const formik = useFormik({
    initialValues: {
      vehicle_type: '',
      plate_number: '',
      date_purchased: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setEquipmentOperationLoading(true)

        !isEnableEdit
          ? // add new data
            await api
              .post('equipment/insert', values)
              .then((response) => {
                toast.success(response.data.message)
                fetchData()
                formik.resetForm()
                setValidated(false)
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setEquipmentOperationLoading(false)
              })
          : // update data
            await api
              .put('equipment/update/' + editId, values)
              .then((response) => {
                toast.success(response.data.message)
                fetchData()
                setValidated(false)
                setModalVisible(false)
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setEquipmentOperationLoading(false)
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

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)
  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          'Plate #': item.plate_number,
          'Vehicle Type': item.vehicle_type,
          'Date Purchased': item.date_purchased,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        'Plate #': item.plate_number,
        'Vehicle Type': item.vehicle_type,
        'Date Purchased': item.date_purchased,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                formik.resetForm()
                setIsEnableEdit(false)
                setValidated(false)
                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            state={{
              isLoading: fetchCourseLoading,
              isSaving: fetchCourseLoading,
              showLoadingOverlay: fetchCourseLoading,
              showProgressBars: fetchCourseLoading,
              showSkeletons: fetchCourseLoading,
            }}
            muiCircularProgressProps={{
              color: 'secondary',
              thickness: 5,
              size: 55,
            }}
            muiSkeletonProps={{
              animation: 'pulse',
              height: 28,
            }}
            enableColumnResizing
            data={data}
            enableRowSelection
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            selectAllMode="all"
            initialState={{ density: 'compact' }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem
                key={0}
                onClick={async () => {
                  closeMenu()

                  let id = row.original.id
                  setEditId(id)
                  formik.setValues({
                    plate_number: row.original.plate_number,
                    vehicle_type: row.original.vehicle_type,
                    date_purchased: row.original.date_purchased,
                  })

                  setIsEnableEdit(true)

                  setModalVisible(true)
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <EditSharp />
                </ListItemIcon>
                Edit
              </MenuItem>,
              <MenuItem
                key={1}
                onClick={() => {
                  closeMenu()
                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      validationPrompt(() => {
                        let id = row.original.id

                        setFetchDataLoading(true)

                        api
                          .delete('equipment/delete/' + id)
                          .then((response) => {
                            fetchData()
                            toast.success(response.data.message)
                          })
                          .catch((error) => {
                            toast.error(handleError(error))
                          })
                          .finally(() => {
                            setFetchDataLoading(false)
                          })
                      })
                    }
                  })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <DeleteOutline />
                </ListItemIcon>
                Delete
              </MenuItem>,
              <MenuItem
                key={2}
                onClick={async () => {
                  closeMenu()
                  let id = row.original.id
                  navigate('/equipment/details/' + id, { replace: false })
                }}
                sx={{ m: 0 }}
              >
                <ListItemIcon>
                  <ManageHistory />
                </ListItemIcon>
                View Details
              </MenuItem>,
            ]}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                className="d-none d-lg-flex"
                sx={{
                  display: 'flex',
                  gap: '.2rem',
                  p: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                  <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                </CButton>
                <CButton
                  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                  size="sm"
                  onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                  variant="outline"
                >
                  <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                </CButton>
                {/* <CButton
                  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                  size="sm"
                  className="  text-white"
                  color="danger"
                  onClick={() =>
                    // handleDeleteRows(table.getSelectedRowModel().rows)
                    handleDeleteRows(table)
                  }
                >
                  <FontAwesomeIcon icon={faTrashAlt} /> Delete Selected Rows
                </CButton> */}
              </Box>
            )}
          />

          {fetchCourseLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={formik.handleSubmit}
        >
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Plate # is required."
                  label={requiredField('Plate #')}
                  name="plate_number"
                  onChange={handleInputChange}
                  value={formik.values.plate_number}
                  required
                />
              </CCol>{' '}
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Vehicle Type is required."
                  label={requiredField('Vehicle Type')}
                  name="vehicle_type"
                  onChange={handleInputChange}
                  value={formik.values.vehicle_type}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Date Purchased is required."
                  label={requiredField('Date Purchased')}
                  name="date_purchased"
                  onChange={handleInputChange}
                  value={formik.values.date_purchased}
                  required
                />
              </CCol>
            </CRow>
          </CModalBody>

          {courseOperationLoading && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Course
