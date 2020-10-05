import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SelectColumnFilter } from "~/components/Filter";
// import { useTable } from "react-table";
import TableContainer from "~/components/Table";
import { Button } from "reactstrap";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Wrapper from "~/pages/_layouts/wrapper";
import api from "~/services/api";
// import { Container } from "./styles";

function Address() {
  const [address, setAddress] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: "Zip Code",
        accessor: "cep",
      },
      {
        Header: "Street",
        accessor: "address",
      },
      {
        Header: "Number",
        accessor: "number",
      },
      {
        Header: "Complement",
        accessor: "complement",
      },
      {
        Header: "District",
        accessor: "district",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Active",
        accessor: ({ active }) => active.toString(),
      },
      {
        Header: "Main addres",
        accessor: ({ main_adress }) => main_adress.toString(),
        Filter: SelectColumnFilter,
        filter: "equals",
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
    async function loadAdresses() {
      const response = await api.get("/adresses/user");

      const adresses = response.data.adresses.map((adrss) => {
        const { options, ...rest } = adrss;
        return Object.assign(rest, options);
      });

      setAddress([...adresses]);
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
    <Wrapper fluid={true}>
      <>
        {/* {renderTable()} */}
        <TableContainer columns={columns} data={address} size={"sm"} />
        <Link to="/address/new">
          <Button size="sm" color="primary">
            Add new address
          </Button>
        </Link>
      </>
    </Wrapper>
  );
}

export default Address;
