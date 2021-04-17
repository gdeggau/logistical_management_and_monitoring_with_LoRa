<h1 align="center">
  <br>
  <img alt="LoRa" src="https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/frontend/src/assets/lora_logo_preta.png?raw=true" width="250px">
</h1>

<h4 align="center">
  This is my undergraduate final project of bachelor degree on Computer Science at <a href="https://www.furb.br/">Fundação Universidade Regional de Blumenau (FURB)</a>.
  <br />
  It is a system to manage the logistic/supply-chain and track delivery transport, using a  <a href="https://heltec.org/project/wifi-lora-32/">WiFi LoRa 32</a> to get vehicles geolocation and send via LoRaWAN to <a href="https://br.korewireless.com/">KORE</a> network server which will forward the payloads to that application.
  <br />
  <br />
</h4>

<p align="center">
  <img alt="Programming language most used JavaScript" src="https://img.shields.io/github/languages/top/gdeggau/logistical_management_and_monitoring_with_LoRa?style=flat">
  <img alt="Objetivo: estudo" src="https://img.shields.io/badge/purpose-study-lightgrey?style=flat">
</p>

<p align="center">
  <a href="#article">Article</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#resources">Resources</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#prerequisites">Prerequisites</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#setup">Setup</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#running">Running</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#techs">Techs</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">License</a>
  <!-- <a href="#techs">Techs</a> -->
  <!-- <a href="#créditos">Créditos</a> -->
</p>

<h3 align="center">
  Web Application
</h3>
<p align="center">
  <img src="https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/frontend/src/assets/tracking.PNG?raw=true">
</p>

<h3 align="center">
  Device
</h3>
<p align="center">
  <img src="https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/frontend/src/assets/device.PNG?raw=true" width=50%>
</p>
<p align="center">
  <img src="https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/frontend/src/assets/montagem%20do%20dispositivo.png?raw=true" width=80%>
</p>

# Article

- [PT-BR](http://dsc.inf.furb.br/arquivos/tccs/monografias/2020_2_gabriel-deggau-schmidt_monografia.pdf)

# Resources

The application has more functionalities like login, create products, users, devices and other ones, but the main are listed below:

- User's addresses CRUD, getting automatically coordinates when adding a new one
- Users do orders
- Create cargos
- Generate cargo pack list (PDF)
- Send vehicle geolocation throw LoRaWAN network
- Scan order's barcode
- Track cargos

# Prerequisites

Below are listed softwares that you must install to run the application:

- [Git](https://git-scm.com)
- [Yarn](https://yarnpkg.com/)
- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)
- [mongoDB](https://www.mongodb.com/2)
- [Arduino IDE](https://www.arduino.cc/en/software)
- [Reactotron](https://github.com/infinitered/reactotron) (optional)

To show map at frontend and geocoding user addresses it is used Mapbox API, so you must create an account and an access token at [Mapbox](https://account.mapbox.com/access-tokens/create).

LoRaWAN network server used is from [KORE Wireless](https://br.korewireless.com/) company. To user their services, you must contact them and choose/contract a plan that makes more sense for your application. Here, it was used the biggest one, G plan.

To build the device, components below are necessary:

- WiFi LoRa 32 (V2)
- GPS GY-NEO6MV2
- Protoboard 400 pins
- 4 jumpers male to male
- Portable charger (or other thing to power device)

# Setup

### **Arduino IDE**

- As said before, the device used was <a href="https://heltec.org/project/wifi-lora-32/">WiFi LoRa 32</a>, for that you will need setup your Arduino IDE following the [Helctec DOCS instructions](https://heltec-automation-docs.readthedocs.io/en/latest/esp32/quick_start.html)
- Install [TinyGPS++](http://arduiniana.org/libraries/tinygpsplus/)
- Get Heltec ChipID and license for you device following the [instructions](https://heltec-automation-docs.readthedocs.io/en/latest/general/view_limited_technical_data.html)
- With ChipID, you must "tranform" it to a DevEUI, changing from 6 bytes to 8 bytes
  - e.g.: if your ChipID is: 123456781122, your DevEUI will be: 0x12, 0x34, 0x56, 0xFF, 0xFF, 0x78, 0x11, 0x22
- Open device/lorawan_example.ino file and set values to variables DevEUI, AppEui and AppKey (the last two you can get in KORE)

### **LoRaWAN network server (KORE)**

With access to KORE, you need to create an "organização", a "aplicação" and two HTTP "encaminhamentos" (endpoints which KORE will send the payloads):

- URL: https://deggautcc.loca.lt/cargos/geolocation (select UPLINK, LORA and RADIO)
  - This endpoint will save vehicle geolocation in PostgreSQL
- URL: https://deggautcc.loca.lt/lora (select all options except DUPLICATE)
  - This endpoint will save all messages in mongoDB, to have a messages history/logs
- Create a device (Device EUI you must set with values that you get previously)
  - Set config as OTAA, contador as 2, NS security and class A

### **Backend and frontend**

- Duplicate .env.example file and rename to .env in backend and frontend folders
- Set API_KEY_MAPBOX with access token that you got in Mapbox
- Create a database in PostgreSQL and set connections data in backend/.env
- Create a database in mongoDB with tcc name
- Create an account/project in [Sentry](https://sentry.io/welcome/) and set SENTRY_DSN property in backend/.env (it is not necessary, used to errors monitoring)

# Running

### **Backend**

```bash
# Repository clone
$ git clone https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa.git

# Acccess backend folder
$ cd logistical_management_and_monitoring_with_LoRa/backend/

# Dependence install
$ yarn

# Run
$ yarn dev

# Open a new terminal (script responsable to set API public)
$ yarn tunnel
```

### **Frontend**

```bash
# Acccess frontend folder
$ cd logistical_management_and_monitoring_with_LoRa/frontend/

# Dependence install
$ yarn

# Run
$ yarn start
```

### **Device**

- Compile and upload the lorawan_example.ino file to the device

# Techs

| Backend           | Frontend           | Device               |
| ----------------- | ------------------ | -------------------- |
| Node.js           | React JS           | ESP32 LoRaWAN Heltec |
| Express           | Styled Components  | TinyGPS++            |
| Sequelize         | Reactstrap         |                      |
| Localtunnel (dev) | Redux & Redux-Saga |                      |
| Mapbox            | React-map-gl       |                      |
| PostgresSQL       | Reactotron (dev)   |                      |
| mongoDB           | Formik             |                      |
| JWT               | cep-promise        |                      |
| Sentry            | react-table        |                      |

# License

[MIT](https://github.com/gdeggau/logistical_management_and_monitoring_with_LoRa/blob/master/LICENSE)
