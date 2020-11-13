import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import capitalizeFirstLetter from '~/utils/capitalizeFirstLetter';
import { signOut } from '~/store/modules/auth/actions';

import { Container, Content } from './styles';

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();

  function handleClick(e) {
    dispatch(signOut());
  }

  function renderBreadcrumb() {
    const paths = location.pathname.split('/');
    const pages = paths.slice(1).map((path) => (
      <BreadcrumbItem className="text-white" key={path}>
        <Link to="/">{capitalizeFirstLetter(path)}</Link>
      </BreadcrumbItem>
    ));
    return (
      <div>
        <Breadcrumb>{pages}</Breadcrumb>
      </div>
    );
  }

  return (
    <Container>
      <Content>
        {renderBreadcrumb()}
        {/* <div>
          <input placeholder="Type license plate..." />
          <button>Search</button>
        </div> */}
        <nav>
          <FaSignOutAlt size="15px" color="#fff" />
          <Link to="/" onClick={handleClick}>
            Sair
          </Link>
        </nav>
      </Content>
    </Container>
  );
}
