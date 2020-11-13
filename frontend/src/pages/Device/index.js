import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { Button } from 'reactstrap';
import dateFormat from '~/utils/dateFormat';
// import { useTable } from "react-table";
import TableContainer from '~/components/Table';
import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

function Device() {
  const [device, setDevice] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'Nome',
        accessor: 'name',
      },
      {
        Header: 'DevEUI',
        accessor: 'device_identifier',
      },
      {
        Header: 'Rótulo',
        accessor: 'label',
      },
      {
        Header: 'Descrição',
        accessor: 'description',
      },
      {
        Header: 'Veículo atual',
        accessor: ({ vehicles }) =>
          vehicles.length !== 0
            ? `${vehicles[0].license_plate} - ${vehicles[0].reference}`
            : '',
      },
      {
        Header: 'Criado em',
        accessor: ({ createdAt }) => dateFormat(createdAt || ''),
      },
      {
        Header: 'Ações',
        accessor: () => {
          return (
            <div
              style={{
                display: 'flex',
                color: '#fff',
                justifyContent: 'space-around',
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
    async function loadDevices() {
      const response = await api.get('/devices');

      setDevice([...response.data]);
    }

    loadDevices();
  }, []);

  return (
    <Wrapper fluid>
      <>
        <TableContainer columns={columns} data={device} size="sm" />
        <Link to="/devices/new">
          <Button color="primary">Novo dispositivo</Button>
        </Link>
      </>
    </Wrapper>
  );
}

export default Device;
