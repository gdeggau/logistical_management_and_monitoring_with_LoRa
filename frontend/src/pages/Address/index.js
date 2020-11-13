import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { SelectColumnFilter } from '~/components/Filter';
import TableContainer from '~/components/Table';
import Wrapper from '~/pages/_layouts/wrapper';
import history from '~/services/history';
import api from '~/services/api';

function Address() {
  const [address, setAddress] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'CEP',
        accessor: 'cep',
      },
      {
        Header: 'Rua',
        accessor: 'address',
      },
      {
        Header: 'Número',
        accessor: 'number',
      },
      {
        Header: 'Complemento',
        accessor: 'complement',
      },
      {
        Header: 'Bairro',
        accessor: 'district',
      },
      {
        Header: 'Cidade',
        accessor: 'city',
      },
      {
        Header: 'Estado',
        accessor: 'state',
      },
      // {
      //   Header: "Active",
      //   accessor: ({ active }) => active.toString(),
      // },
      {
        Header: 'Principal',
        accessor: ({ main_adress }) => (main_adress ? 'YES' : 'NO'),
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Ações',
        Cell: ({ row }) => {
          return (
            <div
              style={{
                display: 'flex',
                color: '#fff',
                justifyContent: 'space-between',
              }}
            >
              <AiFillEdit
                size="17px"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  history.push(`/adresses/edit/${row.original.id}`)
                }
              />
              <AiFillDelete size="17px" />
            </div>
          );
        },
        disableFilters: true,
        disableSortBy: true,
      },
    ],
    []
  );

  useEffect(() => {
    async function loadAdresses() {
      const response = await api.get('/adresses/user');

      let adresses = [];
      if (response.data) {
        adresses = response.data.adresses.map((adrss) => {
          const { options, ...rest } = adrss;
          return Object.assign(rest, options);
        });
      }

      setAddress(adresses);
    }

    loadAdresses();
  }, []);

  // const removeData = (id) => {
  //   api.delete(`${URL}/${id}`).then(res => {
  //       const del = employees.filter(employee => id !== employee.id)
  //       setEmployees(del)
  //   })
  // };
  return (
    <Wrapper fluid>
      <>
        {/* {renderTable()} */}
        <TableContainer columns={columns} data={address} size="sm" />
        <Link to="/adresses/new">
          <Button color="primary">Novo endereço</Button>
        </Link>
      </>
    </Wrapper>
  );
}

export default Address;
