import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { toast } from 'react-toastify';
import dateFormat from '~/utils/dateFormat';
import TableContainer from '~/components/Table';
import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';
import { SelectColumnFilter } from '~/components/Filter';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);
  const [orderSelected, setOrderSelected] = useState(null);
  const { role } = useSelector((state) => state.user.profile);

  const toggle = (order) => {
    setModal(!modal);
    return modal ? setOrderSelected(null) : setOrderSelected(order);
  };

  function renderModal() {
    // console.log(order);
    if (orderSelected !== null && orderSelected !== undefined) {
      // const statusOrdered = orderSelected.OrdersHistories[0];
      // statusOrdered.id = '1';
      // statusOrdered.status = 'ORDERED';
      // orderSelected.OrdersHistories.unshift(statusOrdered);
      return (
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {orderSelected.order_number}
          </ModalHeader>
          <ModalBody>
            <Container fluid>
              <Row>
                <Col
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '8px 5px',
                    // marginBottom: '10px',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>Resumo do pedido:</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span
                    style={{ fontWeight: 'bold' }}
                  >{`${orderSelected.product.name} - ${orderSelected.product.description}`}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>Preço:</span>
                </Col>
                <Col>
                  <span>{`R$ ${orderSelected.product.price}`}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>Quantidade:</span>
                </Col>
                <Col>
                  <span>{orderSelected.quantity}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>Frete:</span>
                </Col>
                <Col>
                  <span>{`R$ ${orderSelected.freight}`}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>Total:</span>
                </Col>
                <Col>
                  <span
                    style={{
                      fontWeight: 'bold',
                      // fontSize: '18px',
                      // padding: '10px 35px',
                      // backgroundColor: '#f5f5f5',
                    }}
                  >{`R$ ${orderSelected.total_price}`}</span>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '8px 5px',
                    marginTop: '10px',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>
                    Endereço de entrega:
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>
                    {`${orderSelected.user.full_name}`}
                    {orderSelected.user.telephone
                      ? `  |  ${orderSelected.user.telephone}`
                      : ''}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>{`${orderSelected.delivery_adress.address}, ${orderSelected.delivery_adress.number} - ${orderSelected.delivery_adress.district}`}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>{`${orderSelected.delivery_adress.complement}`}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>{`${orderSelected.delivery_adress.cep} | ${orderSelected.delivery_adress.city} - ${orderSelected.delivery_adress.state}`}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span>{`${
                    orderSelected.user.telephone
                      ? orderSelected.user.telephone
                      : ''
                  }`}</span>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '8px 5px',
                    marginTop: '10px',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>Status do pedido:</span>
                </Col>
              </Row>

              {orderSelected.OrdersHistories.map((status) => (
                <Row key={status.id}>
                  <Col>
                    <span>{`${dateFormat(status.created_at)}  -  ${
                      status.status
                    }  ${
                      status.observation
                        ? '  -  '.concat(status.observation)
                        : ''
                    }`}</span>
                  </Col>
                </Row>
              ))}
            </Container>
          </ModalBody>
        </Modal>
      );
    }
    return null;
  }

  function renderFilter() {
    async function handleSubmit(e) {
      e.preventDefault();
      const option = new FormData(e.target).get('option');
      try {
        const response =
          option === 'MY'
            ? await api.get('/orders/user')
            : await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        const errorMessage = err.response.data.error;

        toast.error(errorMessage, {
          autoClose: 5000,
        });
      }
    }

    if (role === 'ADMIN') {
      return (
        <div>
          <Form onSubmit={handleSubmit}>
            <FormGroup
              check
              style={{
                display: 'flex',
                flexDirection: 'row',
                color: '#fff',
                alignItems: 'center',
              }}
            >
              <div style={{ marginRight: '30px' }}>
                <Label check>
                  <Input type="radio" name="option" value="MY" defaultChecked />{' '}
                  Meus pedidos
                </Label>
              </div>
              <div style={{ marginRight: '10px' }}>
                <Label check>
                  <Input type="radio" name="option" value="ALL" /> Todos os
                  pedidos
                </Label>
              </div>
              <div>
                <Button size="sm" type="submit" color="primary">
                  Pesquisar
                </Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      );
    }
    return null;
  }

  const columns = useMemo(
    () => [
      {
        Header: ' ',
        Cell: ({ row }) => {
          return (
            <div>
              <Button size="sm" onClick={() => toggle(row.original)}>
                {/* <MdUnfoldMore size="17px" /> */}Details
              </Button>
            </div>
          );
        },
      },
      {
        Header: 'Pedido',
        accessor: 'order_number',
      },
      {
        Header: 'Produto',
        accessor: ({ product }) => product.name,
      },
      {
        Header: 'Quantidade',
        accessor: 'quantity',
      },
      {
        Header: 'Total',
        accessor: ({ total_price }) => `R$ ${total_price}`,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }) => {
          let color = '';
          if (row.original.status === 'DELIVERED') {
            color = '#1ccf58';
          } else if (row.original.status === 'ONDELIVERY') {
            color = '#00aeed';
          } else {
            color = '#fcba03';
          }
          return <div style={{ color }}>{row.original.status}</div>;
        },
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      // {
      //   Header: 'Last update',
      //   accessor: ({ updated_at }) => dateFormat(updated_at || ''),
      //   disableFilters: true,
      // },
      {
        Header: 'Data do pedido',
        accessor: ({ created_at }) => dateFormat(created_at || ''),
        // disableFilters: true,
      },

      // {
      //   Header: "Active",
      //   accessor: ({ active }) => active.toString(),
      // },
    ],
    []
  );
  useEffect(() => {
    async function loadOrders() {
      const response = await api.get('/orders/user');
      setOrders([...response.data]);
    }

    loadOrders();
  }, []);
  return (
    <Wrapper fluid>
      <>
        {renderModal()}
        <TableContainer columns={columns} data={orders} size="sm" />
        {renderFilter()}
        {/* <Link to="/adresses/new">
          <Button color="primary">New address</Button>
        </Link> */}
      </>
    </Wrapper>
  );
}

export default Orders;
