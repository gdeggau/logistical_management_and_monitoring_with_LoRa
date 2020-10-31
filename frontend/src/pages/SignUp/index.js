import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { Form, Input, Container } from 'reactstrap';
import { useDispatch } from 'react-redux';
// import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import Error from '~/components/Error';
import { signUpRequest } from '~/store/modules/auth/actions';

import logo from '~/assets/lora_logo.png';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  last_name: Yup.string().required('Last name is required'),
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
  email: Yup.string()
    .email('Insert a valid e-mail')
    .required('E-mail is required'),
  password: Yup.string()
    .min(6, 'Password must have at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .min(6)
    .required()
    .oneOf([Yup.ref('password')], 'Password must be equals!'),
});

export default function SignUp() {
  const dispatch = useDispatch();

  return (
    <Container style={{ padding: '0px' }}>
      <img src={logo} alt="LoRa" />
      <Formik
        initialValues={{
          name: '',
          last_name: '',
          telephone: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={schema}
        onSubmit={async ({ name, last_name, telephone, email, password }) => {
          try {
            dispatch(
              signUpRequest(name, last_name, telephone, email, password)
            );
            toast.success(
              `Welcome ${name}! Please, login below with your credentials!`,
              {
                autoClose: 5000,
              }
            );
          } catch (err) {
            // const errorMessage = err.response.data.error;
            // console.log(errorMessage);
            toast.error('An error has occurred, please contact system admin!', {
              autoClose: 5000,
            });
          }
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <Error name="name" />
            <Input
              name="name"
              placeholder="Name"
              {...formik.getFieldProps('name')}
            />
            <Error name="last_name" />
            <Input
              name="last_name"
              placeholder="Last name"
              {...formik.getFieldProps('last_name')}
            />
            <Error name="telephone" />
            <Input
              name="telephone"
              placeholder="Phone number"
              mask="(99) 9 9999-9999"
              tag={InputMask}
              {...formik.getFieldProps('telephone')}
            />
            <Error name="email" />
            <Input
              name="email"
              type="email"
              placeholder="E-mail"
              {...formik.getFieldProps('email')}
            />
            <Error name="password" />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              {...formik.getFieldProps('password')}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              {...formik.getFieldProps('confirmPassword')}
            />
            <button type="submit">Create account</button>
            <Link to="/">I have already an account</Link>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
