import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Col, Button, Form, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import history from '~/services/history';
import { InputStyled, LabelStyled } from '~/components/ReactstrapModified';
import Error from '~/components/Error';

import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

function UserNew() {
  return (
    <Wrapper fluid={false} maxWidth="800px">
      <Formik
        initialValues={{
          name: '',
          last_name: '',
          role: 'DRIVER',
          email: '',
          telephone: '',
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          last_name: Yup.string().required('Last name is required'),
          email: Yup.string()
            .email('Insert a valid e-mail')
            .required('E-mail is required'),
          telephone: Yup.string()
            .notRequired()
            .test('telephone', 'Phone number must bem completed!', (value) => {
              if (value) {
                const formatNumber = value.replace(/\D/g, '');
                const schm = Yup.string().min(11);
                return schm.isValidSync(formatNumber);
              }
              return true;
            }),
        })}
        onSubmit={async (values) => {
          try {
            const password = 'Trocar123';
            const payload = values;
            payload.password = password;
            await api.post('/users', payload);

            toast.success(`New ${values.role} created!`, {
              autoClose: 5000,
            });

            history.push('/users');
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
              <Col sm={5}>
                <LabelStyled>Name:</LabelStyled>
                <InputStyled name="name" {...formik.getFieldProps('name')} />
                <Error name="name" />
              </Col>
              <Col sm={5}>
                <LabelStyled>Last name:</LabelStyled>
                <InputStyled
                  name="last_name"
                  {...formik.getFieldProps('last_name')}
                />
                <Error name="last_name" />
              </Col>
              <Col sm={2}>
                <LabelStyled>Type:</LabelStyled>
                <InputStyled
                  name="role"
                  type="select"
                  {...formik.getFieldProps('role')}
                >
                  <option key="DRIVER" value="DRIVER">
                    DRIVER
                  </option>
                  <option key="ADMIN" value="ADMIN">
                    ADMIN
                  </option>
                  <option key="CLIENT" value="CLIENT">
                    CLIENT
                  </option>
                </InputStyled>
                <Error name="role" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={8}>
                <LabelStyled>E-mail:</LabelStyled>
                <InputStyled
                  name="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                />
                <Error name="email" />
              </Col>
              <Col sm={4}>
                <LabelStyled>Phone number:</LabelStyled>
                <InputStyled
                  name="telephone"
                  mask="(99) 9 9999-9999"
                  tag={InputMask}
                  {...formik.getFieldProps('telephone')}
                />
                <Error name="telephone" />
              </Col>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              disabled={formik.isSubmitting}
            >
              Create
            </Button>{' '}
            <Button color="secondary" onClick={() => history.push('/users')}>
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default UserNew;
