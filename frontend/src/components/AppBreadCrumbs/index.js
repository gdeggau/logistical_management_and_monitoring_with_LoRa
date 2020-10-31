import React from 'react';
import Breadcrumbs from 'react-router-dynamic-breadcrumbs';
import { BrowserRouter as Router } from 'react-router-dom';

const routesList = {
  '/catalog': 'Catalog',
  '/cargos': 'Cargos',
  '/cargos/new': 'New',
  '/cargos/:cargo_number': 'Cargo Info',
};

export default function AppBreadcrumbs() {
  return (
    <Router>
      <Breadcrumbs
        mappedRoutes={routesList}
        WrapperComponent={(props) => (
          <ol className="breadcrumb">{props.children}</ol>
        )}
        ActiveLinkComponent={(props) => (
          <li className="breadcrumb-item active">{props.children}</li>
        )}
        LinkComponent={(props) => (
          <li className="breadcrumb-item">{props.children}</li>
        )}
      />
    </Router>
  );
}
