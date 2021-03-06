import { createGlobalStyle } from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`

    :root {
        --blue-lora: #00aeed;
        --header: #262834;
        --primary: #007bff;
        --black: #000000;
        --blackLighter: #9e9e9e;
        --grayLight: #f5f5f5;
        --grayMedium: #e5e5e5;
        --grayInput: #2d2c2c;
        --white: #ffffff;
        --frontEnd: #6bd1ff;
        --grayDark: #2d2c2c;
        --grayDark2: #3b3a3a;
        --green1:#77e7b2;
        --green2:#68a596;
        --green3:#00c86f;
        --green4:#b7f6db;
    }

    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
          display: none;
        }
    }

    *:focus {
        outline: 0;
    }

    html, body, #root {
        height: 100%
    }

    body {
        -webkit-font-smoothing: antialiased;
    }

    body, input, button {
        font: 14px 'Roboto', sans-serif;
    }

    a {
        text-decoration: none;
    }

    ul {
        list-style: none;
    }

    button {
        cursor: pointer;
    }
`;
