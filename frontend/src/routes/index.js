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
import Address from "~/pages/Address";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/profile" component={Profile} isPrivate />
      <Route path="/address" component={Address} isPrivate />
      <Route path="/device" component={Device} isPrivate isAdmin />
      <Route path="/vehicle" component={Vehicle} isPrivate isAdmin />
      <Route path="/product" component={Product} isPrivate isAdmin />
      <Route path="/monitoring" component={Monitoring} isPrivate isAdmin />
      <Route path="/cargo" component={Cargo} isPrivate isAdmin />
    </Switch>
  );
}
