import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Col, Button, Form, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import history from '~/services/history';
import { InputStyled, LabelStyled } from '~/components/ReactstrapModified';
import Error from '~/components/Error';

import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

function ProductNew() {
  return (
    <Wrapper fluid={false} maxWidth="600px">
      <Formik
        initialValues={{ name: '', price: '', description: '' }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          description: Yup.string().notRequired(),
          price: Yup.number().required('Price is required'),
        })}
        onSubmit={async (values) => {
          try {
            await api.post('/products', values);

            toast.success(`New product created!`, {
              autoClose: 5000,
            });

            history.push('/products');
          } catch (err) {
            const errorMessage = err.response.data.error;

            toast.error(errorMessage, {
              autoClose: 5000,
            });
          }
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup row>
              <Col sm={8}>
                <LabelStyled>Name: </LabelStyled>
                <InputStyled name="name" {...formik.getFieldProps('name')} />
                <Error name="name" />
              </Col>
              <Col sm={4}>
                <LabelStyled>Price (R$): </LabelStyled>
                <InputStyled
                  name="price"
                  type="number"
                  min="0"
                  {...formik.getFieldProps('price')}
                />
                <Error name="price" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <LabelStyled>Description: </LabelStyled>
                <InputStyled
                  name="description"
                  {...formik.getFieldProps('description')}
                />
                <Error name="description" />
              </Col>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              disabled={formik.isSubmitting}
            >
              Create
            </Button>{' '}
            <Button color="secondary" onClick={() => history.push('/products')}>
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default ProductNew;
