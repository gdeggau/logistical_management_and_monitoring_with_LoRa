import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Wrapper from "~/pages/_layouts/wrapper";
import api from "~/services/api";

import { RiCarFill, RiMapPinFill } from "react-icons/ri";
import PopupInfo from "~/components/PopupInfo";

function Monitoring() {
  const [selectedCargo, setSelectedCargo] = useState(null);
  // const [tooltipOpen, setTooltipOpen] = useState(false);
  const [cargosOnDelivery, setCargosOnDelivery] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: -26.9230965,
    longitude: -48.9479109,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  // const toggle = () => setTooltipOpen(!tooltipOpen);

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  useEffect(() => {
    async function loadCargos() {
      const response = await api.get("/cargos/delivery");
      setCargosOnDelivery([...response.data]);
    }
    loadCargos();
  }, []);

  function renderCargosLocations() {
    if (cargosOnDelivery !== undefined && cargosOnDelivery.length !== 0) {
      return cargosOnDelivery.map((cargo) => {
        const { latitude, longitude } = cargo.geolocations[0];

        return (
          <Marker
            key={cargo.id}
            longitude={parseFloat(longitude)}
            latitude={parseFloat(latitude)}
          >
            <RiCarFill
              // id="TooltipExample"
              data-tip
              data-for="cargoNumber"
              size={"25px"}
              color={"#ff3333"}
              style={{ cursor: "pointer" }}
              onClick={() => {
                return setSelectedCargo(cargo);
              }}
            />
            {/* <Tooltip
              placement="right"
              isOpen={tooltipOpen}
              target="TooltipExample"
              toggle={toggle}
            >
              {cargo.cargo_number}
            </Tooltip> */}
          </Marker>
        );
      });
    }
  }

  function renderOrdersFromSelectedCargo() {
    return selectedCargo !== null
      ? selectedCargo.orders.map((order) => (
          <Marker
            key={order.id}
            longitude={Number(order.delivery_adress.longitude)}
            latitude={Number(order.delivery_adress.latitude)}
          >
            <RiMapPinFill size={"25px"} color={"#4BB543"} />
          </Marker>
        ))
      : null;
  }

  return (
    <Wrapper>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="500px"
        mapStyle="mapbox://styles/mapbox/dark-v8"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_API_MAPBOX}
        onClick={() => setSelectedCargo(null)}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_API_MAPBOX}
          position="top-left"
          countries="br"
          placeholder="Address"
        />
        {renderCargosLocations()}
        {selectedCargo !== null && (
          <Popup
            latitude={parseFloat(selectedCargo.geolocations[0].latitude)}
            longitude={parseFloat(selectedCargo.geolocations[0].longitude)}
            closeButton={false}
            closeOnClick={false}
          >
            <PopupInfo cargo={selectedCargo} />
          </Popup>
        )}
        {renderOrdersFromSelectedCargo()}
      </ReactMapGL>
    </Wrapper>
  );
}

export default Monitoring;
