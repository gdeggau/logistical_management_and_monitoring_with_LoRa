import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { Button } from 'reactstrap';
import dateFormat from '~/utils/dateFormat';
// import { useTable } from "react-table";
import TableContainer from '~/components/Table';
import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

function Vehicle() {
  const [vehicle, setVehicle] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'License plate',
        accessor: 'license_plate',
      },
      {
        Header: 'Reference',
        accessor: 'reference',
      },
      {
        Header: 'Model',
        accessor: 'model',
      },
      {
        Header: 'Brand',
        accessor: 'brand',
      },
      {
        Header: 'Actual device',
        accessor: ({ device }) => (device ? `${device.name}` : ''),
      },
      {
        Header: 'Created at',
        accessor: ({ created_at }) => dateFormat(created_at || ''),
      },
      {
        Header: 'Actions',
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
    async function loadVehicles() {
      const response = await api.get('/vehicles');

      setVehicle([...response.data]);
    }

    loadVehicles();
  }, []);

  return (
    <Wrapper>
      <>
        <TableContainer columns={columns} data={vehicle} size="sm" />
        <Link to="/vehicles/new">
          <Button color="primary">New vehicle</Button>
        </Link>
      </>
    </Wrapper>
  );
}

export default Vehicle;
