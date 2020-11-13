import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import capitalizeFirstLetter from '~/utils/capitalizeFirstLetter';
import { Menu, MenuItem } from './styles';

import avatar_default from '~/assets/avatar_default.svg';

const pages = [
  {
    page: 'cargas',
    route: 'cargos',
    isAdmin: true,
  },
  {
    page: 'catálogo',
    route: 'catalog',
    isAdmin: false,
  },
  {
    page: 'dispositivos',
    route: 'devices',
    isAdmin: true,
  },
  {
    page: 'endereços',
    route: 'adresses',
    isAdmin: false,
  },
  {
    page: 'pedidos',
    route: 'orders',
    isAdmin: false,
  },
  {
    page: 'produtos',
    route: 'products',
    isAdmin: true,
  },
  {
    page: 'rastreamento',
    route: 'tracking',
    isAdmin: true,
  },
  {
    page: 'usuários',
    route: 'users',
    isAdmin: true,
  },
  {
    page: 'veículos',
    route: 'vehicles',
    isAdmin: true,
  },
];

export default function MenuLeft() {
  const profile = useSelector((state) => state.user.profile);

  return (
    <Menu>
      <div>
        <img
          src={
            profile.avatar != null
              ? profile.avatar.url || avatar_default
              : avatar_default
          }
          alt={`${profile.name} ${profile.last_name}`}
        />
        <Link to="/profile">{`${profile.name} ${profile.last_name}`}</Link>
      </div>
      <ul>
        {pages.map((page) => {
          if (profile.role === 'ADMIN') {
            return (
              <Link to={`/${page.route}`} key={page.page}>
                <MenuItem>{capitalizeFirstLetter(page.page)}</MenuItem>
              </Link>
            );
          }
          if (profile.role !== 'ADMIN' && !page.isAdmin) {
            return (
              <Link to={`/${page.route}`} key={page.page}>
                <MenuItem>{capitalizeFirstLetter(page.page)}</MenuItem>
              </Link>
            );
          }
          return null;
        })}
      </ul>
    </Menu>
  );
}
