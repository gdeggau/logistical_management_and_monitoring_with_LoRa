import React, { useEffect } from "react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import api from "~/services/api";
import findCep from "cep-promise";
import axios from "axios";
import InputMask from "react-input-mask";
import history from "~/services/history";
import { InputStyled, LabelStyled } from "~/components/ReactstrapModified";
import Error from "~/components/Error";
import Loader from "react-loader-spinner";
import { Col, Button, Form, FormGroup, Label } from "reactstrap";
import { toast } from "react-toastify";

import Wrapper from "~/pages/_layouts/wrapper";
import styled from "styled-components";

const Link = styled.a`
  color: #fff;
  font-size: 12px;
  opacity: 0.5;
  &:hover {
    color: #fff;
    opacity: 1;
  }
`;

function AddressNew() {
  //não está sendo usado/funcionando o loading
  let loading = false;

  const AutoCompleteForm = () => {
    const {
      values: { cep },
      setFieldValue,
    } = useFormikContext();

    useEffect(() => {
      const setNullToFields = () => {
        setFieldValue("address", "");
        setFieldValue("city", "");
        setFieldValue("district", "");
        setFieldValue("state", "");
      };

      const cepFormatted = cep.replace(/\D/g, "");
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cepFormatted)) {
        findCep(cepFormatted)
          .then((cepFromApi) => {
            const { city, neighborhood, state, street } = cepFromApi;
            setFieldValue("address", street);
            setFieldValue("city", city);
            setFieldValue("district", neighborhood);
            setFieldValue("state", state);
          })
          .catch((err) => {
            setNullToFields();
            toast.error("Was note possible find the ZIP Code informed!");
          });
      } else {
        setNullToFields();
      }
    }, [cep, setFieldValue]);

    return null;
  };

  return (
    <Wrapper fluid={false}>
      <Formik
        initialValues={{
          cep: "",
          address: "",
          number: "",
          complement: "",
          district: "",
          city: "",
          state: "",
        }}
        validationSchema={Yup.object({
          cep: Yup.string().required("ZIP Code is required"),
          number: Yup.number().required("Number is required").moreThan(0),
          address: Yup.string().required("Street is required"),
          complement: Yup.string().notRequired(),
          district: Yup.string().required("District is required"),
          city: Yup.string().required("City is required"),
          state: Yup.string().required("State is required"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            console.log(values);

            const response = await api.post("/adresses/user", values);

            console.log(response);

            toast.success("New address created!", {
              autoClose: 5000,
            });

            history.push("/address");
          } catch (err) {
            const errorMessage = err.response.data.error;

            toast.error(errorMessage, {
              autoClose: 5000,
            });
            resetForm({});
          }
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup row>
              <Col sm={4}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <LabelStyled>Zip Code </LabelStyled>{" "}
                  <Label size="sm">
                    <Link
                      href="http://www.buscacep.correios.com.br/sistemas/buscacep/default.cfm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Do not know your ZIP Code?
                    </Link>
                  </Label>
                </div>
                <Loader
                  visible={loading ? true : false}
                  style={{ display: "inline", marginLeft: "5px" }}
                  type="ThreeDots"
                  color="#00BFFF"
                  height={16}
                  width={16}
                />
                <InputStyled
                  name="cep"
                  mask="99999-999"
                  tag={InputMask}
                  {...formik.getFieldProps("cep")}
                />
                <Error name="cep" />
                <AutoCompleteForm />
              </Col>
              <Col sm={4}>
                <LabelStyled>City</LabelStyled>
                <InputStyled
                  disabled
                  name="city"
                  {...formik.getFieldProps("city")}
                />
                <Error name="city" />
              </Col>
              <Col sm={4}>
                <LabelStyled>State </LabelStyled>
                <InputStyled
                  disabled
                  name="state"
                  {...formik.getFieldProps("state")}
                />
                <Error name="state" />
              </Col>
              {/* <Col sm={4}>
                <LabelStyled>
                  <a
                    href="http://www.buscacep.correios.com.br/sistemas/buscacep/default.cfm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Do not know your ZIP Code?
                  </a>
                </LabelStyled>
              </Col> */}
            </FormGroup>
            <FormGroup row>
              <Col sm={4}>
                <LabelStyled>Number</LabelStyled>
                <InputStyled
                  name="number"
                  type="number"
                  min="1"
                  {...formik.getFieldProps("number")}
                />
                <Error name="number" />
              </Col>
              <Col sm={8}>
                <LabelStyled>Complement</LabelStyled>
                <InputStyled
                  name="complement"
                  {...formik.getFieldProps("complement")}
                />
                <Error name="complement" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={6}>
                <LabelStyled>Street</LabelStyled>
                <InputStyled
                  disabled
                  name="address"
                  {...formik.getFieldProps("address")}
                />
                <Error name="address" />
              </Col>
              <Col sm={6}>
                <LabelStyled>District</LabelStyled>
                <InputStyled
                  disabled
                  name="district"
                  {...formik.getFieldProps("district")}
                />
                <Error name="district" />
              </Col>
            </FormGroup>

            <Button
              color="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Create address
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default AddressNew;
