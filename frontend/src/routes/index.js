import React from "react";
import { Switch } from "react-router-dom";
import Route from "./Route";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

import Profile from "../pages/Profile";
import Device from "../pages/Device";
import Vehicle from "../pages/Vehicle";
import Product from "../pages/Product";
import Monitoring from "../pages/Monitoring";
import Cargo from "../pages/Cargo";
import CargoNew from "../pages/Cargo/New";
import Catalog from "../pages/Catalog";
import CargoDelivery from "../pages/Delivery";
import Address from "~/pages/Address";
import AddressNew from "~/pages/Address/New";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/profile" component={Profile} isPrivate />

      <Route path="/address" exact component={Address} isPrivate />
      <Route path="/address/new" exact component={AddressNew} isPrivate />
      <Route path="/catalog" component={Catalog} isPrivate />

      <Route path="/device" component={Device} isPrivate isAdmin />
      <Route path="/vehicle" component={Vehicle} isPrivate isAdmin />
      <Route path="/product" component={Product} isPrivate isAdmin />
      <Route path="/monitoring" component={Monitoring} isPrivate isAdmin />
      <Route path="/cargo" exact component={Cargo} isPrivate isAdmin />
      <Route path="/cargo/new" exact component={CargoNew} isPrivate isAdmin />
      <Route
        path="/cargo/delivery/:cargo_number"
        exact
        component={CargoDelivery}
        isPrivate
        isAdmin
      />
    </Switch>
  );
}
