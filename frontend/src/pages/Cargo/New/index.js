/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  setSeconds,
  setMinutes,
  setHours,
  startOfHour,
  addMinutes,
  addHours,
  getMinutes,
  getDayOfYear,
} from 'date-fns';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Container,
  CustomInput,
  Label,
} from 'reactstrap';
import history from '~/services/history';
import Error from '~/components/Error';
import dateFormat from '~/utils/dateFormat';
// import { SelectColumnFilter } from '~/components/Filter';
import api from '~/services/api';
import Wrapper from '~/pages/_layouts/wrapper';
import DatePicker from '~/components/DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputStyled, LabelStyled } from '~/components/ReactstrapModified';
import TableContainer from '~/components/Table';

function CargoNew() {
  const columns = useMemo(
    () => [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            {/* <LabelStyled>All</LabelStyled> */}
            <CustomInput
              id="all"
              type="checkbox"
              {...getToggleAllRowsSelectedProps()}
              indeterminate="false"
            />
          </div>
        ),
        Cell: ({ row }) => (
          <div>
            <CustomInput
              id={row.id}
              type="checkbox"
              {...row.getToggleRowSelectedProps()}
              indeterminate="false"
            />
          </div>
        ),
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Pedido',
        accessor: 'order_number',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Observação',
        accessor: 'observation',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Cliente',
        accessor: 'user.name',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Produto',
        accessor: 'product.name',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Quantid.',
        accessor: 'quantity',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'CEP',
        accessor: 'delivery_adress.cep',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Rua',
        accessor: 'delivery_adress.address',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Número',
        accessor: 'delivery_adress.number',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Complemento',
        accessor: 'delivery_adress.complement',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Bairro',
        accessor: 'delivery_adress.district',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Cidade',
        accessor: 'delivery_adress.city',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Estado',
        accessor: 'delivery_adress.state',
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Data pedido',
        accessor: ({ created_at }) => dateFormat(created_at),
        disableFilters: true,
        disableSortBy: true,
      },
    ],
    []
  );

  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // const selectedRowKeys = Object.keys(selectedRows);

  // useEffect(() => {
  //   async function loadOrders() {
  //     try {
  //       const response = await api.get('/orders', {
  //         params: {
  //           status: ['PENDING', 'RETURNED'],
  //         },
  //       });
  //       setOrders([...response.data]);
  //     } catch (err) {
  //       const errorMessage = err.response.data.error;

  //       toast.error(errorMessage, {
  //         autoClose: 5000,
  //       });
  //     }
  //   }

  //   loadOrders();
  // }, []);

  useEffect(() => {
    async function loadDriversAndVehicles() {
      try {
        const [driversFromDb, vehiclesFromDb, ordersFromDb] = await Promise.all(
          [
            api.get('/drivers'),
            api.get('/vehicles', {
              params: {
                device_id: true,
              },
            }),
            api.get('/orders', {
              params: {
                status: ['PENDING', 'RETURNED'],
              },
            }),
          ]
        );

        setDrivers([...driversFromDb.data]);
        setVehicles([...vehiclesFromDb.data]);
        setOrders([...ordersFromDb.data]);
      } catch (err) {
        const errorMessage = err.response.data.error;

        toast.error(errorMessage, {
          autoClose: 5000,
        });
      }
    }

    loadDriversAndVehicles();
  }, []);

  function renderDriversToSelect() {
    let options = [
      <option key={1} value={null}>
        Selecione um motorista
      </option>,
    ];
    if (drivers !== undefined) {
      options = options.concat(
        drivers.map((driver) => (
          <option
            key={driver.id}
            value={driver.id}
          >{`${driver.name} ${driver.last_name}`}</option>
        ))
      );
    }
    return options;
  }

  function renderVehiclesToSelect() {
    let options = [
      <option key={1} value={null}>
        Selecione um veículo
      </option>,
    ];
    if (vehicles !== undefined) {
      options = options.concat(
        vehicles.map((vehicle) => (
          <option
            key={vehicle.id}
            value={vehicle.id}
          >{`${vehicle.license_plate} - ${vehicle.reference}  |  ${vehicle.device.name}`}</option>
        ))
      );
    }
    return options;
  }

  function minDateTimeToReturn(date_leave, date_return) {
    const dateLeaveWithMinutes = addMinutes(date_leave, 30);
    if (date_return === '') {
      return dateLeaveWithMinutes;
    }
    return getDayOfYear(date_leave) === getDayOfYear(date_return)
      ? dateLeaveWithMinutes
      : setHours(setMinutes(new Date(), 0), 0);
  }

  function minDateTimeToLeave(date_leave) {
    if (date_leave === '') {
      return new Date();
    }
    return getDayOfYear(date_leave) === getDayOfYear(new Date())
      ? new Date()
      : setHours(setMinutes(new Date(), 0), 0);
  }

  return (
    <Wrapper fluid>
      <Formik
        initialValues={{
          driver: '',
          vehicle: '',
          plan_delivery_leave:
            getMinutes(new Date()) < 30
              ? addMinutes(setSeconds(startOfHour(new Date()), 0), 30)
              : addHours(setMinutes(setSeconds(new Date(), 0), 0), 1),
          plan_delivery_return: '',
        }}
        validationSchema={Yup.object({
          plan_delivery_leave: Yup.date().required('Required'),
          plan_delivery_return: Yup.date()
            .when(
              'plan_delivery_leave',
              (plan_delivery_leave, schema) =>
                plan_delivery_leave &&
                schema.min(
                  plan_delivery_leave,
                  'Data de retorno precise ser após a data de saída'
                )
            )
            .required('Required'),
          driver: Yup.string()
            .test(
              'driver',
              'Required',
              (val) => val !== 'Selecione um motorista'
            )
            .required('Required'),
          vehicle: Yup.string()
            .test(
              'vehicle',
              'Required',
              (val) => val !== 'Selecione um veículo'
            )
            .required('Required'),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const {
              driver,
              vehicle,
              plan_delivery_leave,
              plan_delivery_return,
            } = values;
            const ordersSelected = selectedRows;

            const response = await api.post('/cargos', {
              plan_delivery_date_leave: plan_delivery_leave,
              plan_delivery_date_return: plan_delivery_return,
              driver_id: driver,
              vehicle_id: vehicle,
              orders: ordersSelected,
            });

            const { cargo_number } = response.data;

            toast.success(`Carga ${cargo_number} foi criada!`, {
              autoClose: 5000,
            });
            resetForm({});
            setSubmitting(false);
            history.push('/cargos');
          } catch (err) {
            const errorMessage = err.response.data.error;

            toast.error(errorMessage, {
              autoClose: 5000,
            });
            resetForm({});
            setSubmitting(false);
          }
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <Container fluid={false}>
              <FormGroup row>
                <Col sm={6}>
                  <LabelStyled>Saída de entrega planejada:</LabelStyled>
                  <DatePicker
                    name="plan_delivery_leave"
                    selectsStart
                    minDate={new Date()}
                    // initialValues={new Date()}
                    startDate={formik.values.plan_delivery_leave}
                    endDate={formik.values.plan_delivery_return}
                    minTime={minDateTimeToLeave(
                      formik.values.plan_delivery_leave
                    )}
                    maxTime={setHours(setMinutes(new Date(), 30), 23)}
                    {...formik.getFieldProps('plan_delivery_leave')}
                  />

                  <Error name="plan_delivery_leave" />
                </Col>
                <Col sm={6}>
                  <LabelStyled>Retorno de entrega planejada:</LabelStyled>
                  <DatePicker
                    name="plan_delivery_return"
                    selectsEnd
                    startDate={formik.values.plan_delivery_leave}
                    endDate={formik.values.plan_delivery_return}
                    minDate={formik.values.plan_delivery_leave || new Date()}
                    minTime={minDateTimeToReturn(
                      formik.values.plan_delivery_leave,
                      formik.values.plan_delivery_return
                    )}
                    maxTime={setHours(setMinutes(new Date(), 30), 23)}
                    {...formik.getFieldProps('plan_delivery_return')}
                  />

                  <Error name="plan_delivery_return" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={6}>
                  <LabelStyled>Motorista:</LabelStyled>
                  <InputStyled
                    name="driver"
                    type="select"
                    {...formik.getFieldProps('driver')}
                  >
                    {renderDriversToSelect()}
                  </InputStyled>
                  <Error name="driver" />
                </Col>
                <Col sm={6}>
                  <LabelStyled>Veículo:</LabelStyled>
                  <InputStyled
                    name="vehicle"
                    type="select"
                    {...formik.getFieldProps('vehicle')}
                  >
                    {renderVehiclesToSelect()}
                  </InputStyled>
                  <Error name="vehicle" />
                </Col>
              </FormGroup>
            </Container>
            <FormGroup>
              <div
                style={{
                  padding: '15px 0',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '18px',
                  borderBottom: '2px solid',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                <Label>Selecione os pedidos abaixo para serem entregues</Label>
              </div>
              <TableContainer
                columns={columns}
                data={orders}
                setSelectedRows={setSelectedRows}
                size="sm"
              />
            </FormGroup>
            {/* <FormGroup inline> */}
            <Button
              color="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Salvar
            </Button>{' '}
            <Button onClick={() => history.push('/cargos')}>Cancelar</Button>
            {/* </FormGroup> */}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default CargoNew;
