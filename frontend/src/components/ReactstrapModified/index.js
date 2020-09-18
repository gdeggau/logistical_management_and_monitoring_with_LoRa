import React from "react";
import { Input, Label } from "reactstrap";

// import { Container } from './styles';

export function InputStyled({ ...rest }) {
  return (
    <Input
      {...rest}
      bsSize="sm"
      style={{
        backgroundColor: ({ disabled }) => (disabled ? "#e5e5e5" : "#fff"),
      }}
    />
  );
}

export function LabelStyled({ ...rest }) {
  return <Label {...rest} size="sm" style={{ color: "#fff" }} />;
}
