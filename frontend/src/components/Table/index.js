import React, { useEffect } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useRowSelect,
} from "react-table";
import { Filter, DefaultColumnFilter } from "~/components/Filter";
import { Table, Row, Col, Button, Input, CustomInput } from "reactstrap";

import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const TableContainer = ({ columns, data, setSelectedRows, ...table_props }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // rows, -> mudar de 'rows' para 'page' para usar paginação
    page,
    selectedFlatRows,
    // as propriedades abaixo são relacionadas ao 'usePagination'
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (setSelectedRows)
      setSelectedRows(selectedFlatRows.map((row) => row.original));
  }, [setSelectedRows, selectedFlatRows]);

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (
      column.isSortedDesc ? (
        <AiFillCaretDown color="#fff" />
      ) : (
        <AiFillCaretUp color="#fff" />
      )
    ) : (
      ""
    );
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  function generateTable() {
    if (data && columns) {
      return (
        <Table
          dark
          hover
          responsive
          style={{ background: "#262834" }}
          {...table_props}
          {...getTableProps()}
        >
          <thead style={{ border: 0 }}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{ verticalAlign: "text-top" }}
                  >
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{ verticalAlign: "middle" }}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    }
  }

  return (
    <>
      {generateTable()}
      {/* {selectedFlatRows.map((d) => console.log(d.original))} */}
      <Row style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Col md={3}>
          <Button
            color="primary"
            size="sm"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </Button>
          <Button
            color="primary"
            size="sm"
            onClick={previousPage}
            disabled={!canPreviousPage}
          >
            {"<"}
          </Button>
        </Col>
        <Col md={2} style={{ marginTop: 7, color: "#fff" }}>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col md={2}>
          <Input
            bsSize="sm"
            type="number"
            min={1}
            style={{ width: 60 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          />
        </Col>
        <Col md={2}>
          <CustomInput
            id="custom-select"
            bsSize="sm"
            type="select"
            value={pageSize}
            onChange={onChangeInSelect}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </CustomInput>
        </Col>
        <Col md={3}>
          <Button
            color="primary"
            size="sm"
            onClick={nextPage}
            disabled={!canNextPage}
          >
            {">"}
          </Button>
          <Button
            color="primary"
            size="sm"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default TableContainer;
