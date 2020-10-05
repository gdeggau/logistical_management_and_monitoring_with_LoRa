import React, { useEffect, useState, useMemo } from "react";
import Wrapper from "~/pages/_layouts/wrapper";
import history from "~/services/history";
import dateFormat from "~/utils/dateFormat";
import { toast } from "react-toastify";
import api from "~/services/api";
import { FaCheckCircle, FaTimesCircle, FaBarcode } from "react-icons/fa";
import TableContainer from "~/components/Table";
import { LabelStyled, InputStyled } from "~/components/ReactstrapModified";
import {
  Row,
  Col,
  Label,
  Container,
  Input,
  Form,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

function Delivery({ match }) {
  const [cargo, setCargo] = useState();
  const [scanVehicle, setScanVehicle] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Scanned",
        accessor: ({ other_infos }) => {
          return generateIconScanned(other_infos.scanned);
        },
        disableFilters: true,
      },
      {
        Header: "Order",
        accessor: "order_number",
        disableFilters: true,
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
      },
      {
        Header: "Client",
        accessor: "user.name",
        disableFilters: true,
      },
      {
        Header: "Product",
        accessor: "product.name",
        disableFilters: true,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        disableFilters: true,
      },
      {
        Header: "ZIP Code",
        accessor: "delivery_adress.cep",
        disableFilters: true,
      },
      {
        Header: "Street",
        accessor: "delivery_adress.address",
        disableFilters: true,
      },
      {
        Header: "Number",
        accessor: "delivery_adress.number",
        disableFilters: true,
      },
      {
        Header: "Complement",
        accessor: "delivery_adress.complement",
        disableFilters: true,
      },
      {
        Header: "District",
        accessor: "delivery_adress.district",
        disableFilters: true,
      },
      {
        Header: "City",
        accessor: "delivery_adress.city",
        disableFilters: true,
      },
      {
        Header: "State",
        accessor: "delivery_adress.state",
        disableFilters: true,
      },
    ],
    []
  );

  function generateIconScanned(state) {
    return state ? (
      <FaCheckCircle size={"20px"} color={"#4BB543"} />
    ) : (
      <FaTimesCircle size={"20px"} color={"#ff3333"} />
    );
  }

  const isDisabled = () => (cargo.status === "CLOSED" ? false : true);

  function handleChangeScan(event) {
    const value = event.target.value.toUpperCase();
    if (value.length === 10) {
      const checkIfIsVehicleOrOrder = value.substring(0, 2);
      if (checkIfIsVehicleOrOrder === "RR") {
        let orderScanned = "";
        let result = cargo.orders.map((order) => {
          if (value === order.barcode_scan) {
            orderScanned = order.order_number;
            const other_infos = { ...order.other_infos, scanned: true };
            return { ...order, other_infos };
          }
          return order;
        });
        orderScanned === ""
          ? toast.error(
              `Was not possible to identify order with barcode: ${value}`
            )
          : toast.success(`Order ${orderScanned} scanned successfully!`);
        setCargo({ ...cargo, orders: result });
      } else if (checkIfIsVehicleOrOrder === "VV") {
        if (value === cargo.vehicle.barcode_scan) {
          toast.success(
            `Vehicle ${cargo.vehicle.license_plate} scanned successfully!`
          );
          setScanVehicle(true);
        } else {
          toast.error(
            `Was not possible to identify vehicle with barcode: ${value}`
          );
          setScanVehicle(false);
        }
      } else {
        toast.error("The barcode scanned is not from vehicle neither order!");
      }
      event.target.value = "";
    }
  }

  async function handleStartDelivery(e) {
    e.preventDefault();
    try {
      const orderNotScanned = cargo.orders.find(
        (order) => order.other_infos.scanned === false
      );
      if (scanVehicle === false || orderNotScanned) {
        return toast.error("There is orders or vehicle not scanned yet!");
      }

      const response = await api.post("cargos/delivery", {
        id: cargo.id,
        cargo_number: cargo.cargo_number,
        orders: cargo.orders,
      });

      toast.success(`${response.data.cargo_number} is on delivery!`, {
        autoClose: 5000,
      });

      setCargo(response.data);

      console.log(response.data);
    } catch (err) {
      const errorMessage = err.response.data.error;

      toast.error(errorMessage, {
        autoClose: 5000,
      });
    }
  }

  useEffect(() => {
    async function loadCargo() {
      const response = await api.get("/cargos", {
        params: {
          cargo_number: match.params.cargo_number,
        },
      });
      if (response.data.length === 0) {
        history.push("/cargo");
      }
      setCargo(response.data[0]);
    }

    loadCargo();
  }, [match.params.cargo_number]);

  function renderCargoDelivery() {
    if (cargo !== undefined) {
      return (
        <>
          <div
            style={{
              color: "#fff",
              fontSize: "20px",
              borderBottom: "2px solid",
              borderColor: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <Label>{cargo.cargo_number}</Label>
          </div>
          <Row>
            <Col>
              <LabelStyled>Driver:</LabelStyled>
              <InputStyled
                disabled
                value={`${cargo.driver.name} ${cargo.driver.last_name}`}
              />
            </Col>
            <Col>
              <LabelStyled>Driver's telephone:</LabelStyled>
              <InputStyled disabled value={`${cargo.driver.telephone} `} />
            </Col>
            <Col>
              <LabelStyled>Vehicle Scanned: </LabelStyled>
              {cargo.status === "ONDELIVERY"
                ? generateIconScanned(true)
                : generateIconScanned(scanVehicle)}
              <InputStyled
                disabled
                value={`${cargo.vehicle.license_plate} - ${cargo.vehicle.reference}`}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <LabelStyled>Planned delivery:</LabelStyled>
              <InputStyled
                disabled
                value={dateFormat(cargo.plan_delivery_date_leave)}
              />
            </Col>
            <Col>
              <LabelStyled>Planned return:</LabelStyled>
              <InputStyled
                disabled
                value={dateFormat(cargo.plan_delivery_date_return)}
              />
            </Col>
            <Col>
              <LabelStyled>Status:</LabelStyled>
              <InputStyled
                disabled
                value={`${cargo.status} - ${cargo.observation}`}
              />
            </Col>
          </Row>
          <Form onSubmit={handleStartDelivery}>
            <Container
              fluid={true}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "15px",
                padding: "25px 0 10px 0",
                borderTop: "2px solid",
                borderColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <InputGroup style={{ justifyContent: "center" }}>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <FaBarcode size={"24px"} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  disabled={isDisabled()}
                  autoFocus
                  name="scan"
                  onChange={handleChangeScan}
                  maxLength={10}
                  style={{ maxWidth: "600px" }}
                />
              </InputGroup>

              <Label
                style={{
                  paddingTop: "15px",
                  margin: "0",
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "18px",
                }}
              >
                Orders
              </Label>
            </Container>
            <Container
              fluid={true}
              style={{
                marginTop: "15px",
                borderTop: "2px solid",
                borderColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <TableContainer columns={columns} data={cargo.orders} />
              <Button
                disabled={isDisabled()}
                type="submit"
                color="primary
              "
              >
                Start delivery
              </Button>
            </Container>
          </Form>
        </>
      );
    }
    return <div>Loading...</div>;
  }

  return <Wrapper>{renderCargoDelivery()}</Wrapper>;
}

export default Delivery;
