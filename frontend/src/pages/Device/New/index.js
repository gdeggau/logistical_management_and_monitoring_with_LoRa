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

function DeviceNew() {
  return (
    <Wrapper fluid={false} maxWidth="600px">
      <Formik
        initialValues={{
          name: '',
          label: '',
          device_identifier: '',
          description: '',
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
          label: Yup.string().required('Device label is required'),
          device_identifier: Yup.string()
            .required('Device EUI is required')
            .min(16, 'DevEUI must be a 8 bytes hex!'),
        })}
        onSubmit={async (values) => {
          try {
            await api.post('/devices', values);

            toast.success(`New device created!`, {
              autoClose: 5000,
            });

            history.push('/devices');
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
              <Col>
                <LabelStyled>Device name:</LabelStyled>
                <InputStyled name="name" {...formik.getFieldProps('name')} />
                <Error name="name" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <LabelStyled>Device label:</LabelStyled>
                <InputStyled name="label" {...formik.getFieldProps('label')} />
                <Error name="label" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <LabelStyled>Device EUI:</LabelStyled>
                <InputStyled
                  name="device_identifier"
                  maxLength={16}
                  {...formik.getFieldProps('device_identifier')}
                />
                <Error name="device_identifier" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <LabelStyled>Description:</LabelStyled>
                <InputStyled
                  name="description"
                  {...formik.getFieldProps('description')}
                />
              </Col>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              disabled={formik.isSubmitting}
            >
              Create
            </Button>{' '}
            <Button color="secondary" onClick={() => history.push('/devices')}>
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default DeviceNew;
