import styled from 'styled-components';

export const ContainerFilter = styled.div`
  height: 100%;
  background-color: #201f1f;
  width: 100%;
  max-width: 200px;
  color: #e5e5e5;
  padding: 0px 10px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;

export const Section = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  form {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    input {
      background: rgba(255, 255, 255, 0.1);
      border: 0;
      border-radius: 4px;
      font-size: 14px;
      height: 30px;
      /* padding: 0 10px; */
      color: #fff;
      margin-bottom: 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }

      &:focus {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
    }
    /* select {
      background: rgba(255, 255, 255, 0.1);
      border: 0;
      border-radius: 4px;
      font-size: 14px;
      height: 24px;
      padding: 0 10px;
      color: #fff;
      margin-bottom: 10px;
    } */
  }
`;

export const Circle = styled.div`
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 3px;

  background: #0063cc;
  border: 0;
  /* border: 2px solid #666; */
  color: #fff;
  text-align: center;
  justify-content: center;
  align-items: center;

  font-size: 10px;
`;

// export const CargoCollapse = styled.div`
//   padding: 5px;

// `;

// export const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   margin-top: 10px;
// `;

// export const Input = styled.input`
//   background: rgba(255, 255, 255, 0.1);
//   border: 0;
//   border-radius: 4px;
//   height: 24px;
//   padding: 0 10px;
//   color: #fff;
//   margin-bottom: 10px;

//   &::placeholder {
//     color: rgba(255, 255, 255, 0.3);
//   }

// `;
