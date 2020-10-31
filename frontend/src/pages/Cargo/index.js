/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { FaTruck } from 'react-icons/fa';
import { parseISO, isBefore, isAfter, subHours } from 'date-fns';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import Loading from '~/components/Loading';
import api from '~/services/api';
import { SelectColumnFilter } from '~/components/Filter';
import dateFormat from '~/utils/dateFormat';
import TableContainer from '~/components/Table';
import Wrapper from '~/pages/_layouts/wrapper';

function changeColorDate(datePlanned, dateLeft, status) {
  let color = '';

  const dateNow = new window.Date();
  const dateIso = parseISO(datePlanned);

  if (status !== 'ONDELIVERY' && status !== 'FINISHED') {
    if (isAfter(dateNow, dateIso) && dateLeft === null) {
      color = '#ff3333';
    } else if (
      isAfter(dateNow, subHours(dateIso, 2)) &&
      isBefore(dateNow, dateIso)
    ) {
      color = '#ffcc00';
    }
  } else {
    color = '#fff';
  }

  return <div style={{ color: `${color}` }}>{dateFormat(datePlanned)}</div>;
}

// function handleButtonDelivery(cargo) {
//   history.push(`/cargo/delivery/${cargo}`);
// }

function Cargo() {
  const [cargos, setCargos] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: ' ',
        Cell: ({ row }) => {
          return (
            <div>
              <Link to={`/cargos/${row.original.cargo_number}`}>
                <Button>
                  <FaTruck size="17px" />
                </Button>
              </Link>
            </div>
          );
        },
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: 'Number',
        accessor: 'cargo_number',
      },
      {
        Header: 'Driver',
        accessor: ({ driver }) => `${driver.name} ${driver.last_name}`,
      },
      {
        Header: 'Vehicle',
        accessor: ({ vehicle }) =>
          `${vehicle.license_plate} - ${vehicle.reference}`,
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Orders',
        accessor: ({ orders }) => orders.length,
      },
      {
        Header: 'Plan delivery',
        accessor: ({ plan_delivery_date_leave, delivery_date_leave, status }) =>
          changeColorDate(
            plan_delivery_date_leave,
            delivery_date_leave,
            status
          ),
      },
      {
        Header: 'Plan return',
        accessor: ({ plan_delivery_date_return }) =>
          dateFormat(plan_delivery_date_return || ''),
      },
      {
        Header: 'Delivery leaved',
        accessor: ({ delivery_date_leave }) =>
          dateFormat(delivery_date_leave || ''),
      },
      {
        Header: 'Delivery returned',
        accessor: ({ delivery_date_return }) =>
          dateFormat(delivery_date_return || ''),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }) => {
          let color = '';
          if (row.original.status === 'CLOSED') {
            color = '#fcba03';
          } else if (row.original.status === 'ONDELIVERY') {
            color = '#1ccf58';
          }
          return <div style={{ color }}>{row.original.status}</div>;
        },
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Observation',
        accessor: 'observation',
      },
      {
        Header: 'Created at',
        accessor: ({ createdAt }) => dateFormat(createdAt),
      },
      {
        Header: 'Actions',
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
    ],
    []
  );

  useEffect(() => {
    async function loadCargos() {
      try {
        const response = await api.get('/cargos');

        setCargos([...response.data]);
      } catch (err) {
        const errorMessage = err.response.data.error;

        toast.error(errorMessage, {
          autoClose: 5000,
        });
      }
    }
    loadCargos();
  }, []);

  return (
    <Wrapper fluid>
      <>
        {cargos === undefined && <Loading />}
        <TableContainer columns={columns} data={cargos} size="sm" />
        <Link to="/cargos/new">
          <Button color="primary">New cargo</Button>
        </Link>
        {/* <ReactTable data={cargos} columns={columns} /> */}
      </>
    </Wrapper>
  );
}

export default Cargo;
