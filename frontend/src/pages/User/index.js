import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { Button } from 'reactstrap';
import { SelectColumnFilter } from '~/components/Filter';
import dateFormat from '~/utils/dateFormat';
// import { useTable } from "react-table";
import TableContainer from '~/components/Table';
import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

function User() {
  const [user, setUser] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'Nome',
        accessor: 'name',
      },
      {
        Header: 'Sobrenome',
        accessor: 'last_name',
      },
      {
        Header: 'E-mail',
        accessor: 'email',
      },
      {
        Header: 'Celular',
        accessor: 'telephone',
      },
      {
        Header: 'Perfil',
        accessor: 'role',
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Criado em',
        accessor: ({ created_at }) => dateFormat(created_at || ''),
      },
      {
        Header: 'Ações',
        accessor: () => {
          return (
            <div
              style={{
                display: 'flex',
                color: '#fff',
                justifyContent: 'space-between',
              }}
            >
              <AiFillEdit size="17px" />
              <AiFillDelete size="17px" />
            </div>
          );
        },
        disableFilters: true,
        disableSortBy: true,
      },
      // {
      //   Header: "Active",
      //   accessor: ({ active }) => active.toString(),
      // },
    ],
    []
  );

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/users');

      setUser([...response.data]);
    }

    loadUsers();
  }, []);

  return (
    <Wrapper fluid>
      <>
        <TableContainer columns={columns} data={user} size="sm" />
        <Link to="/users/new">
          <Button color="primary">Novo usuário</Button>
        </Link>
      </>
    </Wrapper>
  );
}

export default User;
