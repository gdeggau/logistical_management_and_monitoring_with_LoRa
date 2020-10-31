import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import capitalizeFirstLetter from '~/utils/capitalizeFirstLetter';
import { Menu, MenuItem } from './styles';

import avatar_default from '~/assets/avatar_default.svg';

const pages = [
  {
    page: 'adresses',
    isAdmin: false,
  },
  {
    page: 'cargos',
    isAdmin: true,
  },
  {
    page: 'catalog',
    isAdmin: false,
  },
  {
    page: 'devices',
    isAdmin: true,
  },
  {
    page: 'monitoring',
    isAdmin: true,
  },
  {
    page: 'orders',
    isAdmin: false,
  },
  {
    page: 'products',
    isAdmin: true,
  },
  {
    page: 'users',
    isAdmin: true,
  },
  {
    page: 'vehicles',
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
              <Link to={`/${page.page}`} key={page.page}>
                <MenuItem>{capitalizeFirstLetter(page.page)}</MenuItem>
              </Link>
            );
          }
          if (profile.role !== 'ADMIN' && !page.isAdmin) {
            return (
              <Link to={`/${page.page}`} key={page.page}>
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
