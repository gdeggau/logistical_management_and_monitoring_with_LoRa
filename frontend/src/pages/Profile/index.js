import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input } from "@rocketseat/unform";

import { updateProfileRequest } from "~/store/modules/user/actions";

import AvatarInput from "./AvatarInput";

import { Container } from "./styles";

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);

  function handleSubmit(data) {
    dispatch(updateProfileRequest(data));
  }

  return (
    <Container>
      <Form initialData={profile} onSubmit={handleSubmit}>
        <AvatarInput name="avatar_id" />
        <Input name="name" placeholder="Name" />
        <Input name="last_name" placeholder="Last name" />
        <Input name="email" type="email" placeholder="E-mail" />
        <Input name="telephone" placeholder="Telephone" />
        <hr />
        <Input name="oldPassword" type="password" placeholder="Your password" />
        <Input name="password" type="password" placeholder="New password" />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
        />
        <button type="submit">Save</button>
      </Form>
    </Container>
  );
}
