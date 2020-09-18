import React from "react";
import { Form, Input } from "@rocketseat/unform";
import * as Yup from "yup";
import api from "~/services/api";
import history from "~/services/history";

import { toast } from "react-toastify";

import CreateWrapper from "~/pages/_layouts/createWrapper";
import { Grid, Cell } from "styled-css-grid";
// import { Container } from "./styles";

const schema = Yup.object().shape({
  cep: Yup.string().required("ZIP Code is necessary"),
  number: Yup.number().required("Number is required").moreThan(0),
  address: Yup.string().required("Street is required"),
  complement: Yup.string().notRequired(),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
});

async function handleSubmit(data) {
  try {
    const response = await api.post("/adresses/user", data);

    console.log(response);

    toast.success("New address created!");
    history.push("/address");
  } catch (err) {
    toast.error("An erro has occurred, contact system admnistrator!");
  }
}

function AddressNew() {
  return (
    <CreateWrapper>
      <Form schema={schema} onSubmit={handleSubmit}>
        <Grid columns={2} gap={"10px"}>
          <Cell width={1}>
            <label>
              Zip Code:
              <Input name="cep" />
            </label>
          </Cell>
          <Cell width={1} middle>
            <label>
              <a
                href="http://www.buscacep.correios.com.br/sistemas/buscacep/default.cfm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Do not know your ZIP Code?
              </a>
            </label>
          </Cell>
          <Cell width={2}>
            <label>
              Street:
              <Input name="address" />
            </label>
          </Cell>
          <Cell width={1}>
            <label>
              Number
              <Input name="number" type="number" min="1" />
            </label>
          </Cell>
          <Cell width={1}>
            <label>
              Complement:
              <Input name="complement" />
            </label>
          </Cell>
          <Cell width={2}>
            <label>
              District:
              <Input name="district" />
            </label>
          </Cell>
          <Cell width={1}>
            <label>
              City:
              <Input name="city" />
            </label>
          </Cell>
          <Cell width={1}>
            <label>
              State:
              <Input name="state" />
            </label>
          </Cell>
        </Grid>
        <button type="submit">Create address</button>
      </Form>
    </CreateWrapper>
  );
}

export default AddressNew;
