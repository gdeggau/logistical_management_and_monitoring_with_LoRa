import React from "react";
// useDispatch pra chamar uma action | useSelector para ler os states do redux
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Input } from "@rocketseat/unform";

import { signInRequest } from "~/store/modules/auth/actions";

import * as Yup from "yup";

import logo from "~/assets/lora_logo.png";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string().required("A senha é obrigatória"),
});

export default function SignIn() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <>
      <img src={logo} alt="LoRa" />

      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="email" type="email" placeholder="E-mail" />
        <Input name="password" type="password" placeholder="Password" />

        <button type="submit">{loading ? "Loading..." : "Sign In"}</button>
        <Link to="/register">Create an account</Link>
      </Form>
    </>
  );
}
