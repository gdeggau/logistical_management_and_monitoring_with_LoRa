import styled from 'styled-components';

import { darken } from 'polished';

export const Container = styled.div`
  background: var(--grayDark);
  padding: 0 30px;
  /* height: 40px; */
`;

export const Content = styled.div`
  width: 100%;
  height: 50px;
  /* padding-left: 260px; */
  display: flex;
  justify-content: space-between;
  /* justify-content: right; */
  align-items: center;

  div {
    padding-left: 200px;
    nav {
      ol {
        background-color: rgba(255, 255, 255, 0.1);
        margin: 0;
      }
    }
  }

  /* div {
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      background: rgba(255, 255, 255, 0.1);
      border: 0;
      border-radius: 4px;
      height: 34px;
      width: 300px;
      padding: 0 15px;
      color: var(--grayLight);

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }
    button {
      margin: 0 6px 0;
      height: 34px;
      background: var(--green1);
      padding: 0 10px;
      color: var(--header);
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.08, '#77e7b2')};
      }
    }
  } */

  nav {
    display: flex;
    align-items: center;
    float: right;
    opacity: 0.7;
    svg {
      margin-right: 5px;
    }

    a {
      color: #fff;
    }
    &:hover {
      opacity: 1;
    }
  }
  /* a {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  } */
`;
