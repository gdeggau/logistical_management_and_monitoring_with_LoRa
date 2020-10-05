import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import api from "~/services/api";
import { SelectColumnFilter } from "~/components/Filter";
import dateFormat from "~/utils/dateFormat";
import { parseISO, isBefore, isAfter, subHours } from "date-fns";
import TableContainer from "~/components/Table";
import Wrapper from "~/pages/_layouts/wrapper";
import { Button } from "reactstrap";

function changeColorDate(date) {
  let color = "";

  const dateNow = new window.Date();
  const dateIso = parseISO(date);

  if (isAfter(dateNow, dateIso)) {
    color = "#ff3333";
  } else if (
    isAfter(dateNow, subHours(dateIso, 2)) &&
    isBefore(dateNow, dateIso)
  ) {
    color = "#ffcc00";
  }

  return <div style={{ color: `${color}` }}>{dateFormat(date)}</div>;
}

// function handleButtonDelivery(cargo) {
//   history.push(`/cargo/delivery/${cargo}`);
// }

function Cargo() {
  const [cargos, setCargos] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: " ",
        Cell: ({ row }) => {
          return (
            <div>
              {/* <Button
                onClick={() => handleButtonDelivery(row.original.cargo_number)}
                size={"sm"}
                style={{
                  color: "#fff",
                }}
              > */}
              <Link to={`/cargo/delivery/${row.original.cargo_number}`}>
                <Button>
                  <FaTruck size={"17px"} />
                </Button>
              </Link>
            </div>
          );
        },
        disableFilters: true,
        disableSortBy: true,
      },
      {
        Header: "Number",
        accessor: "cargo_number",
      },
      {
        Header: "Driver",
        accessor: ({ driver }) => `${driver.name} ${driver.last_name}`,
      },
      {
        Header: "Vehicle",
        accessor: ({ vehicle }) =>
          `${vehicle.license_plate} - ${vehicle.reference}`,
        Filter: SelectColumnFilter,
        filter: "equals",
      },
      {
        Header: "Orders",
        accessor: ({ orders }) => orders.length,
      },
      {
        Header: "Planned delivery",
        accessor: ({ plan_delivery_date_leave }) =>
          changeColorDate(plan_delivery_date_leave),
      },
      {
        Header: "Delivery left",
        accessor: ({ delivery_date_leave }) => dateFormat(delivery_date_leave),
      },
      {
        Header: "Delivery returned",
        accessor: ({ delivery_date_return }) =>
          dateFormat(delivery_date_return),
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: "equals",
      },
      {
        Header: "Observation",
        accessor: "observation",
      },
      {
        Header: "Created at",
        accessor: ({ createdAt }) => dateFormat(createdAt),
      },
      {
        Header: "Actions",
        accessor: () => {
          return (
            <div
              style={{
                display: "flex",
                color: "#fff",
                justifyContent: "space-between",
              }}
            >
              <AiFillEdit size={"17px"} />
              <AiFillDelete size={"17px"} />
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
      const response = await api.get("/cargos");

      setCargos([...response.data]);
    }
    loadCargos();
  }, []);

  return (
    <Wrapper fluid={true}>
      <>
        <TableContainer columns={columns} data={cargos} size={"sm"} />

        <Link to="/cargo/new">
          <Button size="sm" color="primary">
            Add new cargo
          </Button>
        </Link>
      </>
    </Wrapper>
  );
}

export default Cargo;
