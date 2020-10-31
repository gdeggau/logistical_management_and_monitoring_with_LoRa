import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Col, Button, Form, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import history from '~/services/history';
import { InputStyled, LabelStyled } from '~/components/ReactstrapModified';
import Error from '~/components/Error';

import Wrapper from '~/pages/_layouts/wrapper';
import api from '~/services/api';

function VehicleNew() {
  const [device, setDevice] = useState([]);

  useEffect(() => {
    async function loadVehiclesAndDevices() {
      const devicesFromDb = await api.get('/devices');

      const devicesFiltered = devicesFromDb.data.filter(
        (devc) => devc.vehicles.length === 0
      );

      setDevice([...devicesFiltered]);
    }

    loadVehiclesAndDevices();
  }, []);

  function renderDevicesToSelect() {
    let options = [
      <option key={1} value={null}>
        Select a device
      </option>,
    ];
    if (device !== undefined) {
      options = options.concat(
        device.map((devc) => (
          <option key={devc.id} value={devc.id}>{`${devc.name}`}</option>
        ))
      );
    }
    return options;
  }

  return (
    <Wrapper fluid={false} maxWidth="800px">
      <Formik
        initialValues={{
          license_plate: '',
          brand: '',
          model: '',
          reference: '',
          device_id: '',
        }}
        validationSchema={Yup.object({
          license_plate: Yup.string()
            .required('Required')
            .min(8, 'Must have 8 digits, including -')
            .max(8, 'Must have 8 digits, including -'),
          brand: Yup.string().notRequired(),
          model: Yup.string().required('Required'),
          reference: Yup.string().required('Required'),
          device_id: Yup.string()
            .test('device_id', 'Required', (val) => val !== 'Select a device')
            .required('Required'),
        })}
        onSubmit={async (values) => {
          try {
            await api.post('/vehicles', values);

            toast.success(`New vehicle created!`, {
              autoClose: 5000,
            });

            history.push('/vehicles');
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
              <Col sm={4}>
                <LabelStyled>License plate:</LabelStyled>
                <InputStyled
                  name="license_plate"
                  maxLength={8}
                  {...formik.getFieldProps('license_plate')}
                />
                <Error name="license_plate" />
              </Col>
              <Col sm={4}>
                <LabelStyled>Brand:</LabelStyled>
                <InputStyled name="brand" {...formik.getFieldProps('brand')} />
                <Error name="brand" />
              </Col>
              <Col sm={4}>
                <LabelStyled>Model:</LabelStyled>
                <InputStyled name="model" {...formik.getFieldProps('model')} />
                <Error name="model" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={8}>
                <LabelStyled>Reference:</LabelStyled>
                <InputStyled
                  name="reference"
                  {...formik.getFieldProps('reference')}
                />
                <Error name="reference" />
              </Col>
              <Col sm={4}>
                <LabelStyled>Device:</LabelStyled>
                <InputStyled
                  name="device_id"
                  type="select"
                  {...formik.getFieldProps('device_id')}
                >
                  {renderDevicesToSelect()}
                </InputStyled>
                <Error name="device_id" />
              </Col>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              disabled={formik.isSubmitting}
            >
              Create
            </Button>{' '}
            <Button color="secondary" onClick={() => history.push('/vehicles')}>
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default VehicleNew;
