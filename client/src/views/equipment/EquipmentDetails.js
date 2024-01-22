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
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, ListItemIcon, MenuItem } from '@mui/material'
import { DeleteOutline, EditSharp, ManageHistory, ViewSidebarOutlined } from '@mui/icons-material'
import { ExportToCsv } from 'export-to-csv'
import {
  DefaultLoading,
  Manager,
  RequiredFieldNote,
  api,
  decrypted,
  handleError,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import { useParams } from 'react-router-dom'

const Course = ({ cardTitle }) => {
  const { id } = useParams()
  const [data, setData] = useState([])
  const [details, setDetails] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchCourseLoading, setFetchDataLoading] = useState(true)
  const [fetchDataDetailsLoading, setFetchDataDetailsLoading] = useState(true)
  const [equipmentOperationLoading, setEquipmentOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
    fetchDetails()
  }, [])

  const fetchData = () => {
    api
      .get('equipment/find/' + id)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }
  const fetchDetails = () => {
    api
      .get('equipment/details/' + id)
      .then((response) => {
        setDetails(response.data)
        // setCourse(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataDetailsLoading(false)
      })
  }
  const formik = useFormik({
    initialValues: {
      date_purchased: '',
      spare_part: '',
      amount: '',
      pr_number: '',
      equipment: id,
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setEquipmentOperationLoading(true)

        !isEnableEdit
          ? // add new data
            await api
              .post('spare_part/insert', values)
              .then((response) => {
                toast.success(response.data.message)
                fetchDetails()
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
              .put('spare_part/update/' + editId, values)
              .then((response) => {
                toast.success(response.data.message)
                fetchDetails()
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

  const column = [
    {
      accessorKey: 'spare_part',
      header: 'Spare Part',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
    {
      accessorKey: 'pr_number',
      header: 'PR #',
    },
    {
      accessorKey: 'date_purchased',
      header: 'Date Purchased',
    },
  ]
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

  const handleDeleteRows = (table) => {
    const rows = table.getSelectedRowModel().rows

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
          setFetchDataLoading(true)
          const selectedRows = rows
            .map((row) => row.original)
            .map((item) => {
              return {
                ID: item.ID,
              }
            })
          api
            .delete('course/bulk_delete', { data: selectedRows })
            .then((response) => {
              fetchData()

              toast.success(response.data.message)
            })
            .catch((error) => {
              toast.error(handleError(error))
            })
            .finally(() => {
              setFetchDataLoading(false)

              table.resetRowSelection()
            })
        })
      }
    })
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
              <FontAwesomeIcon icon={faPlus} /> Add Spare Part
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow>
            <CTable>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell scope="row">Vehicle Type</CTableHeaderCell>
                  <CTableDataCell>{data.vehicle_type}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Plate #</CTableHeaderCell>
                  <CTableDataCell>{data.plate_number}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">Date Purchased</CTableHeaderCell>
                  <CTableDataCell>{data.date_purchased}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CRow>
          <CRow>
            <CCol style={{ position: 'relative' }}>
              <MaterialReactTable
                columns={column}
                data={details}
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
                // enableRowSelection
                // enableSelectAll={true}
                columnFilterDisplayMode="popover"
                paginationDisplayMode="pages"
                positionToolbarAlertBanner="bottom"
                enableStickyHeader
                enableStickyFooter
                enableRowActions
                // selectAllMode="all"
                initialState={{ density: 'compact' }}
                renderRowActionMenuItems={({ closeMenu, row }) => [
                  <MenuItem
                    key={0}
                    onClick={async () => {
                      closeMenu()
                      setEditId(row.original.id)
                      formik.setValues({
                        date_purchased: row.original.date_purchased,
                        spare_part: row.original.spare_part,
                        amount: row.original.amount,
                        pr_number: row.original.pr_number,
                        equipment: id,
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
                              .delete('spare_part/delete/' + id)
                              .then((response) => {
                                fetchDetails()
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
                ]}
              />
            </CCol>

            {fetchDataDetailsLoading && <DefaultLoading />}
          </CRow>
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit Spare Part` : `Add New Spare Part`}</CModalTitle>
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
                  feedbackInvalid="Spare Part is required."
                  label={requiredField('Spare Part')}
                  name="spare_part"
                  onChange={handleInputChange}
                  value={formik.values.spare_part}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="PR # is required."
                  label={requiredField('PR #')}
                  name="pr_number"
                  onChange={handleInputChange}
                  value={formik.values.pr_number}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="number"
                  feedbackInvalid="Amount is required."
                  label={requiredField('Amount')}
                  name="amount"
                  onChange={handleInputChange}
                  value={formik.values.amount}
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
              <CCol md={12}>
                <CFormInput
                  type="hidden"
                  name="equipment"
                  onChange={handleInputChange}
                  value={formik.values.equipment}
                />
              </CCol>
            </CRow>
          </CModalBody>

          {equipmentOperationLoading && <DefaultLoading />}

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
