import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// import { ProSidebar, Menu, MenuItem, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Menu, MenuItem } from "./styles";

// import MenuItem from "./MenuItem";

// import { Container } from "./styles";
import logo from "~/assets/lora_logo.png";
import avatar_default from "~/assets/avatar_default.svg";

const pages = ["users", "vehicle", "device", "product", "cargo", "monitoring"];

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
            <Link to={page} key={page}>
              <MenuItem>{capitalizeFirstLetter(page)}</MenuItem>
            </Link>
          );
        })}
      </ul>
    </Menu>
    // <ProSidebar>
    //   <SidebarHeader>
    //     <img src={profile} alt="Gabriel" />
    //   </SidebarHeader>
    //   <Menu iconShape="circle">
    //     {pages.map((page) => {
    //       return (
    //         <MenuItem key={page}>
    //           {capitalizeFirstLetter(page)}
    //           <Link to={page} />
    //         </MenuItem>
    //       );
    //     })}
    //   </Menu>
    // </ProSidebar>
  );
}
