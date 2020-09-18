import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Input } from "@rocketseat/unform";
import * as Yup from "yup";

import { signUpRequest } from "~/store/modules/auth/actions";

import logo from "~/assets/lora_logo.png";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Insert a valid e-mail")
    .required("E-mail is required"),
  password: Yup.string()
    .min(6, "Password must have at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .min(6)
    .required()
    .oneOf([Yup.ref("password")], "Password must be equals!"),
});

export default function SignUp() {
  const dispatch = useDispatch();

  function handleSubmit({ name, last_name, email, password }) {
    dispatch(signUpRequest(name, last_name, email, password));
  }
  return (
    <>
      <img src={logo} alt="LoRa" />

      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="name" placeholder="Name" />
        <Input name="last_name" placeholder="Last name" />
        <Input name="email" type="email" placeholder="E-mail" />
        <Input name="password" type="password" placeholder="Password" />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
        />

        <button type="submit">Create account</button>
        <Link to="/">I have already an account</Link>
      </Form>
    </>
  );
}
