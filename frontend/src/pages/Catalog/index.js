import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button,
  Form,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import logo from '~/assets/placeholder.png';
import api from '~/services/api';

const freight = Math.floor(Math.random() * (40 - 0 + 1) + 0);

function Catalog() {
  const profile = useSelector((state) => state.user.profile);
  const [product, setProduct] = useState();
  const [address, setAddress] = useState();
  const [{ modal, prod }, setModal] = useState({ modal: false, prod: null });
  const [total, setTotal] = useState();

  const toggle = (prod) => {
    setModal({ modal: !modal, prod });
    setTotal(Number(prod.price) + freight);
  };

  useEffect(() => {
    async function loadProducts() {
      const [products, adresses] = await Promise.all([
        api.get('/products'),
        api.get('/adresses/user'),
      ]);

      let mainAddress = null;
      if (adresses.data) {
        mainAddress = adresses.data.adresses.find(
          (address) => address.options.main_adress === true
        );
      }
      setProduct([...products.data]);
      setAddress(mainAddress);
    }

    loadProducts();
  }, []);

  function onChangeQuantity(event, product) {
    const total = (
      Number(event.target.value) * product.price +
      freight
    ).toString();
    setTotal(total);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const quantity = new FormData(event.target).get('quantity');

    try {
      // toggle();

      const response = await api.post('/orders/user', {
        product_id: prod.id,
        quantity: Number(quantity),
        freight,
        delivery_adress_id: address.id,
      });

      const { order_number } = response.data;

      toast.success(`Seu pedido ${order_number} está aguardando a entrega!`, {
        autoClose: 5000,
      });
    } catch (err) {
      const errorMessage = err.response.data.error;

      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  }

  function renderModal(product) {
    if (prod !== null) {
      return (
        <Modal isOpen={modal} toggle={toggle}>
          <Form onSubmit={handleSubmit}>
            <ModalHeader toggle={toggle}>Finalizando a compra...</ModalHeader>
            <ModalBody>
              <Container fluid>
                <Row>
                  <Col>
                    <img width="100%" src={logo} alt="Product" />
                  </Col>
                  <Col>
                    <span style={{ fontWeight: 'bold' }}>{product.name}</span>
                    <br />
                    <span>{product.description}</span>

                    <div style={{ marginTop: '10px' }}>
                      <Row>
                        <Col>
                          <span>Individual:</span>
                        </Col>
                        <Col>
                          <span>{`R$ ${product.price}`}</span>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <span>Frete:</span>
                        </Col>
                        <Col>
                          <span>{`R$ ${freight}`}</span>
                        </Col>
                      </Row>
                      <Row className="align-items-center">
                        <Col>
                          <span style={{ fontWeight: 'bold' }}>
                            Quantidade:
                          </span>
                        </Col>
                        <Col>
                          <Input
                            bsSize="sm"
                            name="quantity"
                            type="number"
                            min={1}
                            style={{
                              width: 60,
                              border: 0,
                              fontWeight: 'bold',
                            }}
                            defaultValue={1}
                            onChange={(event) =>
                              onChangeQuantity(event, product)
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Container>

              <Container style={{ marginTop: '20px' }} fluid>
                <Row
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px 0',
                    marginBottom: '10px',
                  }}
                >
                  <Col>
                    <span>Endereço principal</span>
                  </Col>
                  <Col>
                    <Link to="/adresses">Meus endereços</Link>
                  </Col>
                </Row>
                {address !== null && (
                  <>
                    <Row>
                      <Col>
                        <span style={{ fontWeight: 'bold' }}>
                          {profile.name}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <span>{`${address.address}, ${address.number} - ${address.district}`}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <span>{`${address.complement}`}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <span>{`${address.cep} | ${address.city} - ${address.state}`}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <span>{`${
                          profile.telephone ? profile.telephone : ''
                        }`}</span>
                      </Col>
                    </Row>
                  </>
                )}
                {!address && (
                  <Row>
                    <Col>
                      <span
                        className="text-warning"
                        style={{ fontWeight: 'bold' }}
                      >
                        Você precisa possuir ao menos um endereço principal!
                      </span>
                    </Col>
                  </Row>
                )}
              </Container>
            </ModalBody>
            <ModalFooter style={{ justifyContent: 'space-between' }}>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                  padding: '10px 35px',
                  backgroundColor: '#f5f5f5',
                }}
              >{`Total: R$ ${total}`}</span>
              <Button
                disabled={!address}
                color="primary"
                type="submit"
                onClick={() => toggle(prod)}
              >
                Comprar
              </Button>{' '}
            </ModalFooter>
          </Form>
        </Modal>
      );
    }
  }

  function renderCatalog() {
    if (product !== undefined && product.length !== 0) {
      return (
        <Row>
          {product.map((prod) => {
            return (
              <Col
                xl={2}
                lg={3}
                md={4}
                key={prod.id}
                style={{ marginTop: '15px' }}
              >
                <Card
                  onClick={() => toggle(prod)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardImg top src={logo} />
                  <CardBody>
                    <CardTitle>{prod.name}</CardTitle>
                    <CardText>{prod.description}</CardText>
                    <CardText
                      style={{
                        fontWeight: 'bold',
                      }}
                    >{`R$ ${prod.price}`}</CardText>
                    {/* <Button size="sm">Purchase</Button> */}
                  </CardBody>
                </Card>
              </Col>
            );
          })}
          {renderModal(prod)}
        </Row>
      );
    }

    return <div>Carregando...</div>;
  }

  return <Container fluid>{renderCatalog()}</Container>;
}

export default Catalog;
