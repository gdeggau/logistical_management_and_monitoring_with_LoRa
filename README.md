<h1 align="center">
  <br>
  <img alt="deggauflix" src="https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/frontend/src/assets/lora_logo_preta.png?raw=true" width="250px">
</h1>

<h4 align="center">
  This is my undergraduate final project of bachelor degree on Computer Science at <a href="https://www.furb.br/">Universidade Regional de Blumenau (FURB)</a>.
  <br />
  It is a system to manage the logistic/supply-chain and track delivery transport, using a  <a href="https://heltec.org/project/wifi-lora-32/">WiFi LoRa 32</a> to get vehicles geolocation and send via LoRaWAN to <a href="https://br.korewireless.com/">KORE</a> network server and forward the payload to that system.
  <br />
  <br />
</h4>

<p align="center">
  <img alt="Programming language most used JavaScript" src="https://img.shields.io/github/languages/top/gdeggau/logistical_management_and_monitoring_with_LoRa?style=flat">
  <img alt="Objetivo: estudo" src="https://img.shields.io/badge/purpose-study-lightgrey?style=flat">
</p>

<p align="center">
  <a href="#resources">Main Resources</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#install">Install</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#techs">Techs</a>
  <!-- <a href="#créditos">Créditos</a> -->
</p>

<h3 align="center">
  Web Application
</h3>
<p align="center">
  <img src="https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/frontend/src/assets/rastreamento_print.PNG?raw=true" width=95%>
</p>

<h3 align="center">
  Device
</h3>
<p align="center">
  <img src="https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/frontend/src/assets/device.PNG?raw=true" width=50%>
</p>

## Resources

- User's addresses CRUD, getting automatically coordinates when adding a new one;
- Users do an orders;
- Create cargos;
- Generate cargo pack list;
- Scan order's barcode;
- Track cargos;

## Install

To clone and execute the application some tools are required:

- [Git](https://git-scm.com)
- [Yarn](https://yarnpkg.com/) (or [npm](http://npmjs.com))
- [PostgreSQL]

To clone and execute the application and [Yarn](https://yarnpkg.com/) (or [npm](http://npmjs.com)) are required. In your prompt command line:

```bash
# Repository clone
$ git clone https://github.com/gdeggau/deggauflix.git

# Entre no repositório
$ cd deggauflix

# Instale as dependências
$ yarn
# ou
$ npm install
```

```bash
# Rodar frontend e backend (json server)
$ yarn dev
# ou
$ npm run dev
```

## Techs:

- [JavaScript](https://www.javascript.com/)
- [ReactJS](https://pt-br.reactjs.org/)
- [Styled-Components](https://styled-components.com/)
- [JSON Server](https://github.com/typicode/json-server)

## Créditos:

Aplicação construída durante a semana Imersão React, realizada pela [Alura](https://www.alura.com.br/).
