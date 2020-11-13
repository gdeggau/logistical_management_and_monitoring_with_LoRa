import React from 'react';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';
import dateFormat from '~/utils/dateFormat';
import { CargoNumber, Driver, OtherInfos } from './styles';

function PopupCargo({ cargo }) {
  return (
    <div>
      <CargoNumber>{cargo.cargo_number}</CargoNumber>
      <Driver>
        <span>{`Motorista: ${cargo.driver.full_name}`}</span>
        <br />
        <span>{`Celular: ${cargo.driver.telephone}`}</span>
        <br />
        <span>{`${cargo.vehicle.license_plate} - ${cargo.vehicle.reference}`}</span>
      </Driver>
      <OtherInfos>
        <span>Saída: {dateFormat(cargo.delivery_date_leave)}</span>
        <br />
        {cargo.status === 'ONDELIVERY' && (
          <div>
            <span>
              Retorno plan.: {dateFormat(cargo.plan_delivery_date_return)}
            </span>
          </div>
        )}
        {cargo.status === 'FINISHED' && (
          <div>
            <span>Retorno: {dateFormat(cargo.delivery_date_return)}</span>
          </div>
        )}
      </OtherInfos>
      <span>
        <small className="text-muted">{`Status: ${cargo.status}`}</small>
        <br />
        {cargo.observation && (
          <div>
            <small className="text-muted">{`Observação: ${cargo.observation}`}</small>
          </div>
        )}
        <small className="text-muted">
          {`Última local.: ${format(
            parseISO(cargo.vehicle_geolocations[0].created_at),
            'dd/MM/yyyy HH:mm:ss'
          )}`}
        </small>
      </span>
    </div>
  );
}

PopupCargo.propTypes = {
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

export default PopupCargo;
