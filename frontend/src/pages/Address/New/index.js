import React, { useEffect, useState } from 'react';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import findCep from 'cep-promise';
// import axios from "axios";
import InputMask from 'react-input-mask';
import Loader from 'react-loader-spinner';
import { Col, Button, Form, FormGroup, Label } from 'reactstrap';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import history from '~/services/history';
import { InputStyled, LabelStyled } from '~/components/ReactstrapModified';
import Error from '~/components/Error';

import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

const Link = styled.a`
  color: #fff;
  font-size: 12px;
  opacity: 0.5;
  &:hover {
    color: #fff;
    opacity: 1;
  }
`;

function AddressNew({ match }) {
  // não está sendo usado/funcionando o loading
  const { id } = match.params;
  const loading = false;
  const [initialValues, setInitialValues] = useState({
    cep: '',
    address: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    main_adress: true,
  });

  useEffect(() => {
    async function loadAddress() {
      try {
        const response = await api.get('/adresses/user', {
          params: {
            address_id: id,
          },
        });

        const {
          cep,
          address,
          number,
          complement,
          district,
          city,
          state,
        } = response.data.adresses[0];

        setInitialValues({
          cep,
          address,
          number,
          complement,
          district,
          city,
          state,
          main_adress: response.data.adresses[0].options.main_adress,
        });
      } catch (err) {
        history.push('/adresses');
      }
    }
    if (id) {
      loadAddress();
    }
  }, []);

  const AutoCompleteForm = () => {
    const {
      values: { cep },
      setFieldValue,
    } = useFormikContext();

    useEffect(() => {
      const setNullToFields = () => {
        setFieldValue('address', '');
        setFieldValue('city', '');
        setFieldValue('district', '');
        setFieldValue('state', '');
      };

      const cepFormatted = cep.replace(/\D/g, '');
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cepFormatted)) {
        findCep(cepFormatted)
          .then((cepFromApi) => {
            const { city, neighborhood, state, street } = cepFromApi;
            setFieldValue('address', street);
            setFieldValue('city', city);
            setFieldValue('district', neighborhood);
            setFieldValue('state', state);
          })
          .catch(() => {
            setNullToFields();
            toast.error('Was note possible find the ZIP Code informed!');
          });
      } else {
        setNullToFields();
      }
    }, [cep, setFieldValue]);

    return null;
  };

  return (
    <Wrapper fluid={false} maxWidth="1000px">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object({
          cep: Yup.string().required('ZIP Code is required'),
          number: Yup.number().required('Number is required').moreThan(0),
          address: Yup.string().required('Street is required'),
          complement: Yup.string().notRequired(),
          district: Yup.string().required('District is required'),
          city: Yup.string().required('City is required'),
          state: Yup.string().required('State is required'),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (id) {
              values.id = id;
              await api.put('/adresses/user', values);
            } else {
              await api.post('/adresses/user', values);
            }

            toast.success('Address saved!', {
              autoClose: 5000,
            });

            history.push('/adresses');
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
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <LabelStyled>CEP: </LabelStyled>{' '}
                  <Label size="sm">
                    <Link
                      href="http://www.buscacep.correios.com.br/sistemas/buscacep/default.cfm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Não conheçe seu CEP?
                    </Link>
                  </Label>
                </div>
                <Loader
                  visible={!!loading}
                  style={{ display: 'inline', marginLeft: '5px' }}
                  type="ThreeDots"
                  color="#00BFFF"
                  height={16}
                  width={16}
                />
                <InputStyled
                  disabled={!!id}
                  name="cep"
                  mask="99999-999"
                  tag={InputMask}
                  {...formik.getFieldProps('cep')}
                />
                <Error name="cep" />
                {!id && <AutoCompleteForm />}
              </Col>
              <Col sm={4}>
                <LabelStyled>Cidade:</LabelStyled>
                <InputStyled
                  disabled
                  name="city"
                  {...formik.getFieldProps('city')}
                />
                <Error name="city" />
              </Col>
              <Col sm={4}>
                <LabelStyled>Estado: </LabelStyled>
                <InputStyled
                  disabled
                  name="state"
                  {...formik.getFieldProps('state')}
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
                <LabelStyled>Número:</LabelStyled>
                <InputStyled
                  name="number"
                  type="number"
                  min="1"
                  {...formik.getFieldProps('number')}
                />
                <Error name="number" />
              </Col>
              <Col sm={8}>
                <LabelStyled>Complemento:</LabelStyled>
                <InputStyled
                  name="complement"
                  {...formik.getFieldProps('complement')}
                />
                <Error name="complement" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={5}>
                <LabelStyled>Rua:</LabelStyled>
                <InputStyled
                  disabled
                  name="address"
                  {...formik.getFieldProps('address')}
                />
                <Error name="address" />
              </Col>
              <Col sm={5}>
                <LabelStyled>Bairro:</LabelStyled>
                <InputStyled
                  disabled
                  name="district"
                  {...formik.getFieldProps('district')}
                />
                <Error name="district" />
              </Col>
              <Col sm={2}>
                <LabelStyled>Principal:</LabelStyled>
                <InputStyled
                  name="main_adress"
                  type="select"
                  {...formik.getFieldProps('main_adress')}
                >
                  <option value typeof="boolean">
                    YES
                  </option>
                  <option value={false} typeof="boolean">
                    NO
                  </option>
                </InputStyled>
                <Error name="main_adress" />
              </Col>
            </FormGroup>
            <Button
              color="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Salvar
            </Button>{' '}
            <Button color="secondary" onClick={() => history.push('/adresses')}>
              Cancelar
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default AddressNew;
