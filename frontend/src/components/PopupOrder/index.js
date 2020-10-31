import React from 'react';
import PropTypes from 'prop-types';
// import dateFormat from "~/utils/dateFormat";
import { parseISO, format } from 'date-fns';
import { OrderNumber, Address, OtherInfos } from './styles';

function PopupOrder({ order }) {
  return (
    <div>
      <OrderNumber>{`${order.order_number} - ${order.product.name}`}</OrderNumber>

      <Address>
        <span>{`${order.delivery_adress.cep}`}</span>
        <br />
        <span>{`${order.delivery_adress.address}, ${order.delivery_adress.number}`}</span>
        <br />
        <span>{`${order.delivery_adress.district}, ${order.delivery_adress.city} - ${order.delivery_adress.state}`}</span>
        {order.delivery_adress.complement && (
          <div>
            <span>{`${order.delivery_adress.complement}`}</span>
          </div>
        )}
      </Address>
      <OtherInfos>
        <span>Client: {order.user.full_name}</span>
        <br />
        <span>Telephone: {order.user.telephone}</span>
        <br />
        <span>E-mail: {order.user.email}</span>
        <br />
      </OtherInfos>
      <div />
      <span>
        <small className="text-muted">{`Status: ${order.status}`}</small>
        <br />
        {order.observation && (
          <div>
            <small className="text-muted">{`Observation: ${order.observation}`}</small>
          </div>
        )}
        <small className="text-muted">
          {`Last update: ${format(
            parseISO(order.updated_at),
            'MMM dd yyyy HH:mm:ss'
          )}`}
        </small>
      </span>
    </div>
  );
}

PopupOrder.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string,
    order_number: PropTypes.string,
    status: PropTypes.string,
    observation: PropTypes.string,
    updated_at: PropTypes.string,
    delivery_adress: PropTypes.shape({
      cep: PropTypes.string,
      address: PropTypes.string,
      complement: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      district: PropTypes.string,
      number: PropTypes.number,
    }),
    user: PropTypes.shape({
      full_name: PropTypes.string,
      telephone: PropTypes.string,
      email: PropTypes.string,
    }),
    product: PropTypes.shape({
      name: PropTypes.string,
    }),
    geolocations: PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.string,
        longitude: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default PopupOrder;
