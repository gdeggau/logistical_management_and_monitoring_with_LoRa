import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { signOut } from "~/store/modules/auth/actions";

import { FaSignOutAlt } from "react-icons/fa";

import { Container, Content } from "./styles";

export default function Header() {
  const dispatch = useDispatch();

  function handleClick(e) {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <div>
          <input placeholder="Type license plate..." />
          <button>Search</button>
        </div>
        <nav>
          <FaSignOutAlt size={"15px"} color={"#fff"} />
          <Link to="/" onClick={handleClick}>
            Sign Out
          </Link>
        </nav>
      </Content>
    </Container>
  );
}
