import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { Button } from 'reactstrap';
import dateFormat from '~/utils/dateFormat';
// import { useTable } from "react-table";
import TableContainer from '~/components/Table';
import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

function Product() {
  const [products, setProducts] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'Product name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Price',
        accessor: ({ price }) => `R$ ${price}`,
      },

      {
        Header: 'Created at',
        accessor: ({ createdAt }) => dateFormat(createdAt || ''),
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
    async function loadProducts() {
      const response = await api.get('/products');

      setProducts([...response.data]);
    }

    loadProducts();
  }, []);

  return (
    <Wrapper fluid>
      <>
        <TableContainer columns={columns} data={products} size="sm" />
        <Link to="/products/new">
          <Button color="primary">New product</Button>
        </Link>
      </>
    </Wrapper>
  );
}

export default Product;
