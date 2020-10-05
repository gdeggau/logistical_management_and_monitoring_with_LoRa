import React from "react";
import PropTypes from "prop-types";
import dateFormat from "~/utils/dateFormat";
import { parseISO, format } from "date-fns";
import { CargoNumber, Driver, OtherInfos } from "./styles";

function PopupInfo({ cargo }) {
  return (
    <div>
      <CargoNumber>{cargo.cargo_number}</CargoNumber>
      <Driver>
        <span>{`Driver: ${cargo.driver.full_name}`}</span>
        <br />
        <span>{`Telephone: ${cargo.driver.telephone}`}</span>
        <br />
        <span>{`${cargo.vehicle.license_plate} - ${cargo.vehicle.reference}`}</span>
      </Driver>
      <OtherInfos>
        <span>Started at: {dateFormat(cargo.delivery_date_leave)}</span>
        <br />
        <span>Plan return: {dateFormat(cargo.plan_delivery_date_return)}</span>
        <br />
      </OtherInfos>
      <span>
        <small className="text-muted">
          {"Last update: " +
            format(
              parseISO(cargo.geolocations[0].created_at),
              "MMM dd yyyy HH:mm:ss"
            )}
        </small>
      </span>
    </div>
  );
}

PopupInfo.propTypes = {
  cargo: PropTypes.shape({
    id: PropTypes.string,
    cargo_number: PropTypes.string,
    geolocations: PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.string,
        longitude: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default PopupInfo;
