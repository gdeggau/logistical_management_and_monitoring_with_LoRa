import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';

import { store } from '~/store';

// Component em letra maiscula pois pode ser usado como uma tag do react
export default function RouteWrapper({
  component: Component,
  isPrivate,
  isAdmin,
  path,
  ...rest
}) {
  const { signed } = store.getState().auth;

  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  if (signed && !isPrivate) {
    return <Redirect to="/catalog" />;
  }

  if (signed && isAdmin) {
    const { role } = store.getState().user.profile;
    if (role !== 'ADMIN') return <Redirect to="/catalog" />;
  }

  // if (isAdmin && role !== 'ADMIN') {
  //   return <Redirect to="/" />;
  // }

  const Layout = signed ? DefaultLayout : AuthLayout;

  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  isAdmin: PropTypes.bool,
  path: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

RouteWrapper.defaultProps = {
  path: '/',
  isPrivate: false,
  isAdmin: false,
};
