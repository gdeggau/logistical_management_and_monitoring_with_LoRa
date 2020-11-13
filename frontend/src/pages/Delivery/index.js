import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { FaCheckCircle, FaTimesCircle, FaBarcode } from 'react-icons/fa';
import { VscFilePdf } from 'react-icons/vsc';
import {
  Row,
  Col,
  Label,
  Container,
  Input,
  Form,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { format } from 'date-fns';
import generatePDFDocument from '~/services/pdf/generatePdfDocument';
import Wrapper from '~/pages/_layouts/wrapper';
import history from '~/services/history';
import dateFormat from '~/utils/dateFormat';
import api from '~/services/api';
import TableContainer from '~/components/Table';
import Loading from '~/components/Loading';
import { LabelStyled, InputStyled } from '~/components/ReactstrapModified';

function Delivery({ match }) {
  const [cargo, setCargo] = useState();
  const [scanVehicle, setScanVehicle] = useState(false);
  const [modal, setModal] = useState(false);
  const [statusCargo, setStatusCargo] = useState();
  const [statusOrder, setStatusOrder] = useState();
  // const [isReady, setIsReady] = useState(false);
  // const [initialValuesModal, setInitialValuesModal] = useState({});

  let initialValuesModal = {};

  const toggle = () => setModal(!modal);

  function generateIconScanned(state) {
    return state ? (
      <FaCheckCircle size="20px" color="#4BB543" />
    ) : (
      <FaTimesCircle size="20px" color="#ff3333" />
    );
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Escaneado',
        accessor: ({ other_infos }) => {
          return generateIconScanned(other_infos.scanned);
        },
        disableFilters: true,
      },
      {
        Header: 'Pedido',
        accessor: 'order_number',
        disableFilters: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
      },
      {
        Header: 'Cliente',
        accessor: 'user.name',
        disableFilters: true,
      },
      {
        Header: 'Produto',
        accessor: 'product.name',
        disableFilters: true,
      },
      {
        Header: 'Quantidade',
        accessor: 'quantity',
        disableFilters: true,
      },
      {
        Header: 'CEP',
        accessor: 'delivery_adress.cep',
        disableFilters: true,
      },
      {
        Header: 'Rua',
        accessor: 'delivery_adress.address',
        disableFilters: true,
      },
      {
        Header: 'Número',
        accessor: 'delivery_adress.number',
        disableFilters: true,
      },
      {
        Header: 'Complemento',
        accessor: 'delivery_adress.complement',
        disableFilters: true,
      },
      {
        Header: 'Bairro',
        accessor: 'delivery_adress.district',
        disableFilters: true,
      },
      {
        Header: 'Cidade',
        accessor: 'delivery_adress.city',
        disableFilters: true,
      },
      {
        Header: 'Estado',
        accessor: 'delivery_adress.state',
        disableFilters: true,
      },
      {
        Header: 'Última att.',
        accessor: ({ updated_at }) => dateFormat(updated_at || ''),
        disableFilters: true,
      },
    ],
    []
  );

  const isDisabledStart = () => cargo.status !== 'CLOSED';
  const isDisabledFinish = () => cargo.status !== 'ONDELIVERY';

  function handleChangeScan(event) {
    const value = event.target.value.toUpperCase();
    if (value.length === 10) {
      const checkIfIsVehicleOrOrder = value.substring(0, 2);
      if (checkIfIsVehicleOrOrder === 'RR') {
        let orderScanned = '';
        const result = cargo.orders.map((order) => {
          if (value === order.barcode_scan) {
            orderScanned = order.order_number;
            const other_infos = { ...order.other_infos, scanned: true };
            return { ...order, other_infos };
          }
          return order;
        });
        orderScanned === ''
          ? toast.error(
              `Não foi possível identificar um pedido com o código de barras ${value}`
            )
          : toast.success(`Pedido ${orderScanned} validado!`);
        setCargo({ ...cargo, orders: result });
      } else if (checkIfIsVehicleOrOrder === 'VV') {
        if (value === cargo.vehicle.barcode_scan) {
          toast.success(`Veículo ${cargo.vehicle.license_plate} validado!`);
          setScanVehicle(true);
        } else {
          toast.error(
            `Não foi possível identificar o veículo com o código de barras ${value}`
          );
          setScanVehicle(false);
        }
      } else {
        toast.error('O código de barras não pertence a um veículo ou pedido!');
      }
      event.target.value = '';
    }
  }

  async function handleStartDelivery(e) {
    e.preventDefault();
    try {
      const orderNotScanned = cargo.orders.find(
        (order) => order.other_infos.scanned === false
      );
      if (scanVehicle === false || orderNotScanned) {
        return toast.error('O veículo ou algum pedido falta ser escaneado!');
      }

      const response = await api.post('cargos/delivery', {
        id: cargo.id,
        cargo_number: cargo.cargo_number,
        orders: cargo.orders,
      });

      toast.success(`${response.data.cargo_number} está em entrega!`, {
        autoClose: 5000,
      });
      setCargo(response.data);
      return history.push('/cargos');
    } catch (err) {
      console.log(err);
      const errorMessage = err.response.data.error;

      return toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  }

  // function renderStatusToSelect(objectStatus) {
  //   if(objectStatus !== undefined) {
  //     return objectStatus.
  //   }
  //   return null;
  // }

  useEffect(() => {
    async function loadCargo() {
      const [
        cargosFromDB,
        statusCargoFromDB,
        statusOrderFromDB,
      ] = await Promise.all([
        api.get('/cargos', {
          params: {
            cargo_number: match.params.cargo_number,
          },
        }),
        api.get('/cargos/status'),
        api.get('/orders/status'),
      ]);

      if (cargosFromDB.data.length === 0) {
        history.push('/cargos');
      }

      const allowed = ['DELIVERED', 'RETURNED'];
      const filteredStatus = Object.keys(statusOrderFromDB.data)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = statusOrderFromDB.data[key];
          return obj;
        }, {});

      setCargo(cargosFromDB.data[0]);
      setStatusCargo(statusCargoFromDB.data.FINISHED);
      setStatusOrder(filteredStatus);
      // setIsReady(true);
    }

    loadCargo();
  }, [match.params.cargo_number]);

  function renderStatusOrderSelect(formik) {
    return cargo.orders.map((order) => {
      const keyStatus = `status_${order.order_number}`;
      const keyObservation = `observation_${order.order_number}`;
      initialValuesModal[keyStatus] = statusOrder.DELIVERED.value;
      initialValuesModal[keyObservation] = '';
      return (
        <div key={order.id}>
          <Row>
            <Col sm={4}>
              <span className="font-weight-bold">{`${order.order_number}:`}</span>
              <Input
                bsSize="sm"
                name={keyStatus}
                type="select"
                {...formik.getFieldProps(keyStatus)}
              >
                {Object.entries(statusOrder).map((status) => (
                  <option key={status[0]} value={status[0]}>
                    {status[0]}
                  </option>
                ))}
              </Input>
            </Col>
            <Col sm={8}>
              <span className="font-weight-bold">Observação: </span>
              <Input
                bsSize="sm"
                name={keyObservation}
                {...formik.getFieldProps(keyObservation)}
              />
            </Col>
          </Row>
          <br />
        </div>
      );
    });
  }

  function renderModal() {
    if (
      cargo !== undefined &&
      statusCargo !== undefined &&
      statusOrder !== undefined
    ) {
      initialValuesModal = {
        statusCargo: statusCargo.value,
        observationCargo: statusCargo.description,
      };
      return (
        <Modal isOpen={modal} toggle={toggle} size="lg">
          <Formik
            initialValues={initialValuesModal}
            onSubmit={async (values) => {
              try {
                const payload = cargo;
                payload.status = values.statusCargo;
                payload.observation = values.observationCargo;

                const ordersValues = {};

                Object.entries(values).map((obj) => {
                  if (obj[0].includes('_')) {
                    const infos = obj[0].split('_');
                    ordersValues[infos[1]] = {
                      ...ordersValues[infos[1]],
                      [infos[0]]: obj[1],
                    };
                  }
                  return null;
                });

                payload.orders = payload.orders.map((order) => {
                  const { status, observation } = ordersValues[
                    order.order_number
                  ];
                  order.status = status;
                  order.observation = observation;
                  return order;
                });

                const response = await api.put('/cargos', cargo);

                toast.success(
                  `Carga ${response.data.cargo_number} foi finalizada!`,
                  {
                    autoClose: 5000,
                  }
                );
                history.push(`/cargos`);
              } catch (err) {
                const errorMessage = err.response.data.error;

                toast.error(errorMessage, {
                  autoClose: 5000,
                });
              }
            }}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <ModalHeader toggle={toggle}>{cargo.cargo_number}</ModalHeader>
                <ModalBody>
                  <Row>
                    <Col>
                      <span className="font-weight-bold">Saída: </span>
                      <span>{`${dateFormat(
                        cargo.delivery_date_leave || ''
                      )}`}</span>
                    </Col>
                    <Col>
                      <span className="font-weight-bold">Retorno plan.: </span>
                      <span>{`${dateFormat(
                        cargo.plan_delivery_date_return || ''
                      )}`}</span>
                    </Col>
                    <Col>
                      <span className="font-weight-bold">Retorno: </span>
                      <span>{`${format(
                        new Date(),
                        'MM/dd/yyyy HH:mm:ss'
                      )}`}</span>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm={4}>
                      <span className="font-weight-bold">Status: </span>
                      <Input
                        bsSize="sm"
                        name="statusCargo"
                        type="select"
                        {...formik.getFieldProps('statusCargo')}
                      >
                        <option
                          key={statusCargo.value}
                          value={statusCargo.value}
                        >
                          {statusCargo.value}
                        </option>
                      </Input>
                    </Col>
                    <Col sm={8}>
                      <span className="font-weight-bold">Observação: </span>
                      <Input
                        bsSize="sm"
                        name="observationCargo"
                        {...formik.getFieldProps('observationCargo')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <Label
                        style={{
                          padding: '10px 0 0 0',
                          color: '#9e9e9e',
                          fontSize: '14px',
                        }}
                      >
                        Pedidos
                      </Label>
                    </Col>
                  </Row>
                  {renderStatusOrderSelect(formik)}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    type="submit"
                    onClick={() => toggle()}
                  >
                    Confirmar
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>
      );
    }
    return <div>Carregando...</div>;
  }

  function renderCargoDelivery() {
    if (cargo !== undefined) {
      return (
        <>
          <div
            style={{
              color: '#fff',
              fontSize: '20px',
              borderBottom: '2px solid',
              borderColor: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <Label>{cargo.cargo_number}</Label>
          </div>
          <Row>
            <Col>
              <LabelStyled>Veículo escaneado: </LabelStyled>
              {cargo.status === 'ONDELIVERY' || cargo.status === 'FINISHED'
                ? generateIconScanned(true)
                : generateIconScanned(scanVehicle)}
              <InputStyled
                disabled
                value={`${cargo.vehicle.license_plate} - ${cargo.vehicle.reference}`}
              />
            </Col>
            <Col>
              <LabelStyled>Motorista:</LabelStyled>
              <InputStyled
                disabled
                value={`${cargo.driver.name} ${cargo.driver.last_name}`}
              />
            </Col>
            <Col>
              <LabelStyled>Celular:</LabelStyled>
              <InputStyled disabled value={`${cargo.driver.telephone} `} />
            </Col>
            <Col>
              <LabelStyled>Status:</LabelStyled>
              <InputStyled
                disabled
                value={`${cargo.status} - ${cargo.observation}`}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <LabelStyled>Saída planejada:</LabelStyled>
              <InputStyled
                disabled
                value={dateFormat(cargo.plan_delivery_date_leave || '')}
              />
            </Col>
            <Col>
              <LabelStyled>Retorno planejado:</LabelStyled>
              <InputStyled
                disabled
                value={dateFormat(cargo.plan_delivery_date_return || '')}
              />
            </Col>
            <Col>
              <LabelStyled>Saída:</LabelStyled>
              <InputStyled
                disabled
                value={dateFormat(cargo.delivery_date_leave || '')}
              />
            </Col>
            <Col>
              <LabelStyled>Retorno:</LabelStyled>
              <InputStyled
                disabled
                value={dateFormat(cargo.delivery_date_return || '')}
              />
            </Col>
          </Row>
          {renderModal()}
          <Form onSubmit={handleStartDelivery}>
            <Container
              fluid
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '15px',
                padding: '25px 0 10px 0',
                borderTop: '2px solid',
                borderColor: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              <InputGroup style={{ justifyContent: 'center' }}>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <FaBarcode size="24px" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  disabled={isDisabledStart()}
                  autoFocus
                  name="scan"
                  onChange={handleChangeScan}
                  maxLength={10}
                  style={{ maxWidth: '600px' }}
                />
              </InputGroup>

              <div style={{ justifyContent: 'center' }}>
                <Label
                  style={{
                    paddingTop: '15px',
                    margin: '0',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '20px',
                  }}
                >
                  Pedidos
                </Label>{' '}
              </div>
            </Container>
            <Container
              fluid
              style={{
                marginTop: '15px',
                borderTop: '2px solid',
                borderColor: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              <TableContainer columns={columns} data={cargo.orders} size="sm" />
            </Container>
            <Button disabled={isDisabledStart()} type="submit" color="primary">
              Iniciar entrega
            </Button>
            {'  '}
            <Button
              disabled={isDisabledFinish()}
              color="primary"
              onClick={toggle}
            >
              Finalizar entrega
            </Button>
            {'  '}
            <Button onClick={() => generatePDFDocument(cargo)}>
              <VscFilePdf size="20px" />
            </Button>
            {'  '}
            <Button color="secondary" onClick={() => history.push('/cargos')}>
              Cancelar
            </Button>
          </Form>
        </>
      );
    }
    return <Loading />;
  }

  return <Wrapper>{renderCargoDelivery()}</Wrapper>;
}

export default Delivery;
