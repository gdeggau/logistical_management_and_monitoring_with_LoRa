import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import "./config/ReactotronConfig";

import Routes from "./routes";
import history from "./services/history";

import { store, persistor } from "./store";

import GlobalStyle from "./styles/global";

function App() {
  return (
    <Provider store={store}>
      {/* PersistGate irá primeiramente buscar os dados que estao no 
      localstorage e armazena-los eles no redux */}
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Routes />
          <GlobalStyle />
          <ToastContainer autoClose={3000} />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
