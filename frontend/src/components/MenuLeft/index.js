import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Menu, MenuItem } from "./styles";

import avatar_default from "~/assets/avatar_default.svg";

const pages = [
  "catalog",
  "users",
  "address",
  "vehicle",
  "device",
  "product",
  "cargo",
  "monitoring",
];

function capitalizeFirstLetter(str1) {
  return str1.charAt(0).toUpperCase() + str1.slice(1);
}

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
        <Link to="profile">{`${profile.name} ${profile.last_name}`}</Link>
      </div>
      <ul>
        {pages.map((page) => {
          return (
            <Link to={`/${page}`} key={page}>
              <MenuItem>{capitalizeFirstLetter(page)}</MenuItem>
            </Link>
          );
        })}
      </ul>
    </Menu>
  );
}
