import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Form, Input } from '@rocketseat/unform';
import { Col, Button, Form, FormGroup } from 'reactstrap';
import InputMask from 'react-input-mask';
import { Formik } from 'formik';
import { InputStyled, LabelStyled } from '~/components/ReactstrapModified';
import Error from '~/components/Error';
import { updateProfileRequest } from '~/store/modules/user/actions';

import AvatarInput from './AvatarInput';
import Wrapper from '~/pages/_layouts/wrapper';
// import { Container } from './styles';

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const { name, last_name, telephone, email } = profile;

  // function handleSubmit(data) {
  //   dispatch(updateProfileRequest(data));
  // }

  return (
    // <Container>
    <Wrapper fluid={false} maxWidth="600px">
      <Formik
        initialValues={{
          name,
          last_name,
          telephone: telephone || '',
          email,
          oldPassword: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={(values) => {
          dispatch(updateProfileRequest(values));
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            {/* <div style={{ justifyContent: 'center' }}> */}
            <AvatarInput name="avatar_id" />
            {/* </div> */}
            <FormGroup row>
              <Col sm={6}>
                <LabelStyled>Nome:</LabelStyled>
                <InputStyled name="name" {...formik.getFieldProps('name')} />
                <Error name="name" />
              </Col>
              <Col sm={6}>
                <LabelStyled>Sobrenome:</LabelStyled>
                <InputStyled
                  name="last_name"
                  {...formik.getFieldProps('last_name')}
                />
                <Error name="last_name" />
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
                <LabelStyled>Celular:</LabelStyled>
                <InputStyled
                  name="telephone"
                  mask="(99) 9 9999-9999"
                  tag={InputMask}
                  {...formik.getFieldProps('telephone')}
                />
                <Error name="telephone" />
              </Col>
            </FormGroup>
            <hr
              style={{ border: 0, height: '1px', backgroundColor: '#e5e5e5' }}
            />
            <FormGroup row>
              <Col>
                <LabelStyled>Senha atual:</LabelStyled>
                <InputStyled
                  name="oldPassword"
                  type="password"
                  {...formik.getFieldProps('oldPassword')}
                />
                <Error name="oldPassword" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <LabelStyled>Nova senha:</LabelStyled>
                <InputStyled
                  name="password"
                  type="password"
                  {...formik.getFieldProps('password')}
                />
                <Error name="password" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <LabelStyled>Confirmar nova senha:</LabelStyled>
                <InputStyled
                  name="confirmPassword"
                  type="password"
                  {...formik.getFieldProps('confirmPassword')}
                />
                <Error name="confirmPassword" />
              </Col>
            </FormGroup>
            {/*
            <InputStyled name="last_name" placeholder="Last name" />
            <InputStyled name="email" type="email" placeholder="E-mail" />
            <InputStyled name="telephone" placeholder="Telephone" />
            <hr />
            <InputStyled name="oldPassword" type="password" placeholder="Your password" />
            <InputStyled name="password" type="password" placeholder="New password" />
            <InputStyled
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
            /> */}
            <Button color="primary" type="submit">
              Salvar
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    // </Container>
  );
}
