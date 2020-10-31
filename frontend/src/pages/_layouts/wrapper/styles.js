import styled from 'styled-components';
import { darken } from 'polished';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  margin: 30px 0 0;
  padding: 15px 20px;
  background: var(--header);
  border-radius: 4px;
  width: 95%;

  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  /* 
  a {
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
  } */
`;
