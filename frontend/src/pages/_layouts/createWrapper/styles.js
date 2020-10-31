import styled from 'styled-components';
import { darken } from 'polished';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  margin-top: 40px;
  padding: 15px 20px;
  background: var(--header);
  border-radius: 4px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  label {
    color: #a7a7a7;
    font-weight: bold;
    font-size: 14px;
    width: 100%;
    input {
      margin-top: 5px;
      background: var(--white);
      border: 0;
      width: 100%;
      border-radius: 4px;
      height: 35px;
      padding: 0 15px;
      opacity: 0.9;
    }
  }

  span {
    color: #c6131a;
    align-self: flex-start;
    margin: 0 0 10px;
    font-weight: bold;
  }

  button {
    margin-top: 20px;
    padding: 0 10px;
    height: 40px;
    background: var(--blue-lora);
    color: #fff;
    border: 0;
    border-radius: 4px;
    font-size: 16px;
    transition: background 0.2s;

    &:hover {
      background: ${darken(0.03, '#00aeed')};
    }
  }

  a {
    color: var(--grayLight);
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
`;
