import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';
import Device from '../pages/Device';
import DeviceNew from '../pages/Device/New';
import Vehicle from '../pages/Vehicle';
import VehicleNew from '../pages/Vehicle/New';
import Product from '../pages/Product';
import ProductNew from '../pages/Product/New';
import Monitoring from '../pages/Monitoring';
import Orders from '../pages/Orders';
import Cargo from '../pages/Cargo';
import CargoNew from '../pages/Cargo/New';
import Catalog from '../pages/Catalog';
import CargoDelivery from '../pages/Delivery';
import Address from '~/pages/Address';
import AddressNew from '~/pages/Address/New';
import User from '~/pages/User';
import UserNew from '~/pages/User/New';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/profile" exact component={Profile} isPrivate />

      <Route path="/adresses" exact component={Address} isPrivate />
      <Route path="/adresses/new" exact component={AddressNew} isPrivate />
      <Route path="/adresses/edit/:id" exact component={AddressNew} isPrivate />
      <Route path="/catalog" component={Catalog} isPrivate />
      <Route path="/orders" component={Orders} isPrivate />

      <Route path="/devices" exact component={Device} isPrivate isAdmin />
      <Route
        path="/devices/new"
        exact
        component={DeviceNew}
        isPrivate
        isAdmin
      />
      <Route path="/vehicles" exact component={Vehicle} isPrivate isAdmin />
      <Route
        path="/vehicles/new"
        exact
        component={VehicleNew}
        isPrivate
        isAdmin
      />
      <Route path="/products" exact component={Product} isPrivate isAdmin />
      <Route
        path="/products/new"
        exact
        component={ProductNew}
        isPrivate
        isAdmin
      />
      <Route path="/monitoring" component={Monitoring} isPrivate isAdmin />
      <Route path="/users" exact component={User} isPrivate isAdmin />
      <Route path="/users/new" exact component={UserNew} isPrivate isAdmin />
      <Route path="/cargos" exact component={Cargo} isPrivate isAdmin />
      <Route path="/cargos/new" exact component={CargoNew} isPrivate isAdmin />
      <Route
        path="/cargos/:cargo_number"
        exact
        component={CargoDelivery}
        isPrivate
        isAdmin
      />
    </Switch>
  );
}
