import styled from "styled-components";

export const Menu = styled.div`
  height: 100%;
  width: 260px;
  background: var(--grayDark);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 44px 15px 30px;
    /* border-bottom: 1px solid #eee; */

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      /* border: 2px solid var(--green1); * */
      /* /* background: #eee; */
    }

    a {
      color: #fff;
      margin-top: 15px;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      opacity: 0.5;
      word-break: break-word;
      &:hover {
        opacity: 1;
      }
    }
  }
`;

export const MenuItem = styled.li`
  padding: 10px 20px;
  color: #fff;
  opacity: 0.7;
  font-size: 16px;

  &:hover {
    background: var(--header);
    opacity: 1;
  }
`;
