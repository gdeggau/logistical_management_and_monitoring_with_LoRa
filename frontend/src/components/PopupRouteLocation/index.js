import React from 'react';
// import dateFormat from "~/utils/dateFormat";
import { parseISO, format } from 'date-fns';

export default function PopupRouteLocation({ routeLocation }) {
  return (
    <div>
      <span>
        {`${format(parseISO(routeLocation.created_at), 'dd/MM/yyyy HH:mm:ss')}`}
      </span>
      <br />
      <small className="text-muted">{`Lat: ${routeLocation.latitude}, Lon: ${routeLocation.longitude}`}</small>
    </div>
  );
}
