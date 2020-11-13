import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Formik } from 'formik';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { toast } from 'react-toastify';
import Geocoder from 'react-map-gl-geocoder';
import { RiCarFill, RiMapPinFill } from 'react-icons/ri';
import {
  Col,
  Row,
  Button,
  ButtonGroup,
  Form,
  Input,
  ListGroup,
  ListGroupItem,
  Badge,
  UncontrolledCollapse,
} from 'reactstrap';
import dateFormat from '~/utils/dateFormat';
import { ContainerFilter, Section, Circle } from './styles';
import api from '~/services/api';

import PopupOrder from '~/components/PopupOrder';
import PopupCargo from '~/components/PopupCargo';
import PopupRouteLocation from '~/components/PopupRouteLocation';

const InputStyled = ({ ...rest }) => {
  return (
    <Input
      {...rest}
      bsSize="sm"
      style={{
        backgroundColor: '#373636',
        color: '#fff',
        border: 0,
        height: '26px',
        marginBottom: '10px',
      }}
    />
  );
};

function Monitoring() {
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRouteLocation, setSelectedRouteLocation] = useState(null);
  const [showRouteSelected, setShowRouteSelected] = useState(0);
  // const [tooltipOpen, setTooltipOpen] = useState(false);
  const [statusCargo, setStatusCargo] = useState();
  const [cargosOnDelivery, setCargosOnDelivery] = useState([]);
  // const [cargosWithoutGeolocation, setCargosWithoutGeolocation] = useState([]);
  const [popoverCargoOpen, setPopoverCargoOpen] = useState(false);
  const [popoverOrderOpen, setPopoverOrderOpen] = useState(false);
  const [popoverRouteOpen, setPopoverRouteOpen] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: -26.9230965,
    longitude: -48.9479109,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  const toggleCargo = () => setPopoverCargoOpen(!popoverCargoOpen);
  const toggleOrder = () => setPopoverOrderOpen(!popoverOrderOpen);
  const toggleRoute = () => setPopoverRouteOpen(!popoverRouteOpen);
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // function defineStatesCargos(cargosFromDb) {
  //   const cargosWithLocation = [];
  //   const cargosWithoutLocation = [];

  //   if (cargosFromDb.length > 0) {
  //     cargosFromDb.map((cargo) =>
  //       cargo.vehicle_geolocations.length === 0
  //         ? cargosWithoutLocation.push(cargo)
  //         : cargosWithLocation.push(cargo)
  //     );
  //   }

  //   setCargosOnDelivery(cargosWithLocation);
  //   setCargosWithoutGeolocation(cargosWithoutLocation);
  // }

  useEffect(() => {
    async function loadCargos() {
      const [cargosFromDb, statusCargoFromDB] = await Promise.all([
        api.get('/cargos/delivery', {
          params: {
            status: 'ONDELIVERY',
          },
        }),
        api.get('/cargos/status'),
      ]);

      const allowed = ['ONDELIVERY', 'FINISHED'];
      const filteredStatus = Object.keys(statusCargoFromDB.data)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = statusCargoFromDB.data[key];
          return obj;
        }, {});

      setStatusCargo(filteredStatus);
      // defineStatesCargos(cargosFromDb.data);
      setCargosOnDelivery(cargosFromDb.data);
    }
    loadCargos();
  }, []);

  function renderStatusToSelect() {
    let options = [];
    if (statusCargo !== undefined) {
      options = Object.entries(statusCargo).map((status) => (
        <option key={status[0]} value={status[0]}>
          {status[0]}
        </option>
      ));
    }
    options.push(
      <option key={1} value="ALL">
        Ambos status
      </option>
    );
    return options;
  }

  function renderSelectCargoOnMap() {
    if (
      selectedCargo !== undefined &&
      selectedCargo !== null &&
      selectedCargo.vehicle_geolocations.length > 0
    ) {
      const { latitude, longitude } = selectedCargo.vehicle_geolocations[0];

      return (
        <Marker
          key={selectedCargo.id}
          longitude={parseFloat(longitude)}
          latitude={parseFloat(latitude)}
        >
          <RiCarFill
            data-tip
            data-for="cargoNumber"
            size="25px"
            color="#ff3333"
            style={{ cursor: 'pointer' }}
            onClick={toggleCargo}
          />
        </Marker>
      );
    }
    return null;
  }

  // function renderCargosLocations() {
  //   if (cargosOnDelivery !== undefined && cargosOnDelivery.length !== 0) {
  //     return cargosOnDelivery.map((cargo) => {
  //       if (cargo.vehicle_geolocations.length > 0) {
  //         const { latitude, longitude } = cargo.vehicle_geolocations[0];

  //         return (
  //           <Marker
  //             key={cargo.id}
  //             longitude={parseFloat(longitude)}
  //             latitude={parseFloat(latitude)}
  //           >
  //             <RiCarFill
  //               data-tip
  //               data-for="cargoNumber"
  //               size="25px"
  //               color="#ff3333"
  //               style={{ cursor: 'pointer' }}
  //               onClick={() => {
  //                 return setSelectedCargo(cargo);
  //               }}
  //             />
  //           </Marker>
  //         );
  //       }
  //       return null;
  //     });
  //   }
  //   return null;
  // }

  function renderOrdersFromSelectedCargo() {
    return selectedCargo !== null
      ? selectedCargo.orders.map((order) => (
          <Marker
            key={order.id}
            longitude={parseFloat(order.delivery_adress.longitude)}
            latitude={parseFloat(order.delivery_adress.latitude)}
          >
            <RiMapPinFill
              size="25px"
              color="#4BB543"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedOrder(order);
                return toggleOrder();
              }}
            />
          </Marker>
        ))
      : null;
  }

  function renderRouteFromSelectedCargo() {
    if (selectedCargo !== null && showRouteSelected) {
      let count = selectedCargo.vehicle_geolocations.length;
      return selectedCargo.vehicle_geolocations.slice(1).map((location) => {
        count -= 1;
        return (
          <Marker
            key={location.id}
            latitude={parseFloat(location.latitude)}
            longitude={parseFloat(location.longitude)}
          >
            <Circle
              onClick={() => {
                setSelectedRouteLocation(location);
                return toggleRoute();
              }}
            >
              {count}
            </Circle>
            {/* <BsDot
                size="25px"
                color="#00BFFF"
                style={{ cursor: 'pointer' }}
              /> */}
          </Marker>
        );
      });
    }
    return null;
  }

  function renderOrderInSideBar(cargo) {
    return cargo.orders.map((order) => (
      <div
        key={order.id}
        style={{
          backgroundColor: '#6c757d',
          padding: '0px 5px',
          marginBottom: '2px',
          border: 0,
          borderRadius: '4px',
        }}
      >
        <Row>
          <Col>
            <strong>{order.order_number}</strong>
          </Col>
        </Row>
        <Row>
          <Col>
            <small>{order.delivery_adress.cep}</small>
          </Col>
        </Row>
        <Row>
          <Col>
            <small>{`${order.delivery_adress.address}, ${order.delivery_adress.number}`}</small>
          </Col>
        </Row>
        <Row>
          <Col>
            <small>{`${order.delivery_adress.district}, ${order.delivery_adress.city} - ${order.delivery_adress.state}`}</small>
          </Col>
        </Row>
        {order.delivery_adress.complement && (
          <Row>
            <Col>
              <small>{`${order.delivery_adress.complement}`}</small>
            </Col>
          </Row>
        )}
        {/* <Row>
          <Col>
            <small>{``}</small>
          </Col>
        </Row> */}
      </div>
    ));
  }

  function hideElementsOnMap() {
    setPopoverCargoOpen(null);
    setPopoverOrderOpen(null);
    setPopoverRouteOpen(null);
    setSelectedCargo(null);
    setSelectedOrder(null);
    setSelectedRouteLocation(null);
  }

  function sideBar() {
    return (
      <ContainerFilter>
        <Section>
          Exibir rota
          <ButtonGroup>
            <Button
              color="primary"
              size="sm"
              onClick={() => setShowRouteSelected(1)}
              active={showRouteSelected === 1}
            >
              Sim
            </Button>
            <Button
              color="primary"
              size="sm"
              onClick={() => setShowRouteSelected(0)}
              active={showRouteSelected === 0}
            >
              Não
            </Button>
          </ButtonGroup>
        </Section>
        {cargosOnDelivery && (
          <Section>
            Cargas
            <ListGroup
              style={{ maxHeight: '60vh', overflow: 'auto', width: '100%' }}
            >
              {cargosOnDelivery.map((cargo) => (
                <div key={cargo.id}>
                  <ListGroupItem
                    id={`cargo_${cargo.id}`}
                    onClick={() => {
                      // if (cargo.vehicle_geolocations.length > 0) {
                      //   setSelectedCargo(cargo);
                      // } else {
                      //   setSelectedCargo(null);
                      // }
                      setSelectedCargo(cargo);
                      setSelectedOrder(null);
                      setSelectedRouteLocation(null);
                      setPopoverCargoOpen(null);
                      setPopoverOrderOpen(null);
                      setPopoverRouteOpen(null);
                    }}
                    style={{
                      // width: '100%',
                      cursor: 'pointer',
                      padding: '8px',
                      backgroundColor: '#373636',
                      color: '#fff',
                    }}
                    className="justify-content-between"
                  >
                    {cargo.cargo_number}{' '}
                    <Badge pill>{cargo.orders.length}</Badge>
                  </ListGroupItem>
                  <UncontrolledCollapse toggler={`cargo_${cargo.id}`}>
                    <div
                      style={{ backgroundColor: '#2d2c2c', padding: '0px 5px' }}
                    >
                      {cargo.vehicle_geolocations.length === 0 && (
                        <Row>
                          <Col>
                            <strong className="text-danger">
                              Sem localização!
                            </strong>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col>
                          <small>{`Status: ${cargo.status}`}</small>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <small>{`Motorista: ${cargo.driver.full_name}`}</small>
                        </Col>
                      </Row>
                      {cargo.driver.telephone && (
                        <Row>
                          <Col>
                            <small>{`Telephone: ${cargo.driver.telephone}`}</small>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col>
                          <small>{`${cargo.vehicle.license_plate} - ${cargo.vehicle.reference}`}</small>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <small>{`Saída: ${dateFormat(
                            cargo.delivery_date_leave
                          )}`}</small>
                        </Col>
                      </Row>
                      {cargo.delivery_date_return && (
                        <Row>
                          <Col>
                            <small>{`Retorno: ${dateFormat(
                              cargo.delivery_date_return
                            )}`}</small>
                          </Col>
                        </Row>
                      )}
                      {renderOrderInSideBar(cargo)}
                      {/* {!cargo.delivery_date_return && (
                        <Row>
                          <Col>
                            <small>{`Plan return: ${dateFormat(
                              cargo.plan_delivery_date_return
                            )}`}</small>
                          </Col>
                        </Row>
                      )} */}
                    </div>
                  </UncontrolledCollapse>
                </div>
              ))}
            </ListGroup>
          </Section>
        )}
        <Section>
          Filtros
          <Formik
            initialValues={{
              cargo_number: '',
              status: 'ONDELIVERY',
            }}
            onSubmit={async (values) => {
              const { cargo_number, status } = values;
              try {
                const response = await api.get('/cargos/delivery', {
                  params: {
                    cargo_number,
                    status,
                  },
                });
                // defineStatesCargos(response.data);
                setCargosOnDelivery(response.data);
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
                <InputStyled
                  name="status"
                  type="select"
                  {...formik.getFieldProps('status')}
                >
                  {renderStatusToSelect()}
                </InputStyled>
                <InputStyled
                  name="cargo_number"
                  placeholder="Número da carga"
                  maxLength={7}
                  {...formik.getFieldProps('cargo_number')}
                />
                <Button size="sm" color="primary" type="submit">
                  Pesquisar
                </Button>
              </Form>
            )}
          </Formik>
        </Section>
      </ContainerFilter>
    );
  }

  return (
    // <Wrapper>
    <>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v8"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_API_MAPBOX}
        onClick={() => {
          return hideElementsOnMap();
        }}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_API_MAPBOX}
          position="top-left"
          countries="br"
          placeholder="Pesquisar endereço"
        />
        {renderRouteFromSelectedCargo()}
        {renderSelectCargoOnMap()}
        {/* {renderCargosLocations()} */}
        {popoverCargoOpen && (
          <Popup
            latitude={parseFloat(
              selectedCargo.vehicle_geolocations[0].latitude
            )}
            longitude={parseFloat(
              selectedCargo.vehicle_geolocations[0].longitude
            )}
            closeButton={false}
            closeOnClick={false}
          >
            <PopupCargo cargo={selectedCargo} />
          </Popup>
        )}
        {renderOrdersFromSelectedCargo()}
        {popoverOrderOpen && (
          <Popup
            latitude={parseFloat(selectedOrder.delivery_adress.latitude)}
            longitude={parseFloat(selectedOrder.delivery_adress.longitude)}
            closeButton={false}
            closeOnClick={false}
          >
            <PopupOrder order={selectedOrder} />
          </Popup>
        )}
        {popoverRouteOpen && (
          <Popup
            latitude={parseFloat(selectedRouteLocation.latitude)}
            longitude={parseFloat(selectedRouteLocation.longitude)}
            closeButton={false}
            closeOnClick={false}
          >
            <PopupRouteLocation routeLocation={selectedRouteLocation} />
          </Popup>
        )}
      </ReactMapGL>
      {sideBar()}
    </>
    //  {/* </Wrapper> */}
  );
}

export default Monitoring;
