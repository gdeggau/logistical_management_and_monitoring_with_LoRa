import React from 'react';
import { format } from 'date-fns';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import dateFormat from '~/utils/dateFormat';

const JsBarcode = require('jsbarcode');

const BORDER_COLOR = '#bfbfbf';
const BORDER_STYLE = 'solid';
const COL1_WIDTH = 30;
const COLN_WIDTH = 100 - COL1_WIDTH;
const COLN_WIDTH_ORDERS = (100 - COL1_WIDTH) / 3;

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
  },

  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  movieOverview: {
    fontSize: 10,
  },

  header: {
    backgroundColor: '#f6f6f5',
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  infosHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    maxWidth: 1000,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  info: {
    fontSize: 12,
  },
  body: {
    // display: 'flex',
    // flexDirection: 'column',
    padding: 10,
  },
  vehicle: {
    display: 'flex',
    justifyContent: 'left',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol1Header: {
    width: `${COL1_WIDTH}%`,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColHeader: {
    width: `${COLN_WIDTH}%`,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColHeaderOrder: {
    width: `${COLN_WIDTH_ORDERS}%`,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol1: {
    width: `${COL1_WIDTH}%`,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: `${COLN_WIDTH}%`,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColOrder: {
    width: `${COLN_WIDTH_ORDERS}%`,
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 500,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  barcode: {
    width: 170,
    height: 70,
  },
  subtitle: {
    display: 'flex',
    justifyContent: '',
    flexDirection: 'row',
    width: 150,
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default function PdfDocument(props) {
  const { cargo } = props;
  let canvas;
  canvas = document.createElement('canvas');
  JsBarcode(canvas, cargo.vehicle.barcode_scan);
  const barcode = canvas.toDataURL();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text
            style={styles.title}
          >{`FICHA DE ROMANEIO: ${cargo.cargo_number}`}</Text>
        </View>
        <View style={styles.infosHeader}>
          <Text
            style={styles.info}
          >{`Motorista: ${cargo.driver.full_name}`}</Text>
          <Text
            style={styles.info}
          >{`Celular: ${cargo.driver.telephone}`}</Text>
          <Text style={styles.info}>{`Status: ${cargo.status}`}</Text>
          <Text style={styles.info}>{`Observação: ${cargo.observation}`}</Text>
        </View>
        <View style={styles.infosHeader}>
          <Text style={styles.info}>{`Saída planejada: ${dateFormat(
            cargo.plan_delivery_date_leave || ''
          )}`}</Text>
          {cargo.delivery_date_leave && (
            <Text style={styles.info}>{`Saída: ${dateFormat(
              cargo.delivery_date_leave || ''
            )}`}</Text>
          )}
        </View>
        <View style={styles.infosHeader}>
          <Text style={styles.info}>{`Retorno planejado: ${dateFormat(
            cargo.plan_delivery_date_return || ''
          )}`}</Text>
          {cargo.delivery_date_return && (
            <Text style={styles.info}>{`Retorno: ${dateFormat(
              cargo.delivery_date_return || ''
            )}`}</Text>
          )}
        </View>
        <View style={styles.body}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1Header}>
                <Text style={styles.tableCellHeader}>Barcode</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Veículo</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1}>
                <Image style={styles.barcode} src={barcode} />
              </View>
              <View style={styles.tableCol}>
                <Text
                  style={styles.tableCell}
                >{`Marca: ${cargo.vehicle.brand}\nModelo: ${cargo.vehicle.model}\nPlaca: ${cargo.vehicle.license_plate}\nDispositivo: ${cargo.vehicle.device.name}\nReferência: ${cargo.vehicle.reference}`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1Header}>
                <Text style={styles.tableCellHeader}>Barcode</Text>
              </View>
              <View style={styles.tableColHeaderOrder}>
                <Text style={styles.tableCellHeader}>Endereço</Text>
              </View>
              <View style={styles.tableColHeaderOrder}>
                <Text style={styles.tableCellHeader}>Cliente</Text>
              </View>
              <View style={styles.tableColHeaderOrder}>
                <Text style={styles.tableCellHeader}>Status</Text>
              </View>
            </View>
            {cargo.orders.map((order) => {
              JsBarcode(canvas, order.barcode_scan);
              const barcodeOrder = canvas.toDataURL();
              return (
                <View key={order.id} style={styles.tableRow}>
                  <View style={styles.tableCol1}>
                    <Image style={styles.barcode} src={barcodeOrder} />
                  </View>
                  <View style={styles.tableColOrder}>
                    <Text
                      style={styles.tableCell}
                    >{`${order.delivery_adress.address}, ${order.delivery_adress.number} - ${order.delivery_adress.district}\nComplement: ${order.delivery_adress.complement}\n${order.delivery_adress.cep} | ${order.delivery_adress.city} - ${order.delivery_adress.state}`}</Text>
                  </View>
                  <View style={styles.tableColOrder}>
                    <Text style={styles.tableCell}>
                      {`Pedido: ${order.order_number}\nNome: ${order.user.full_name}\nCelular: ${order.user.telephone}\nAssinatura:\n___________________`}
                    </Text>
                  </View>
                  <View style={styles.tableColOrder}>
                    <Text style={styles.tableCell}>
                      {`DELIVERED:____\nRETURNED:____\nObservação:`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.infosHeader}>
            <Text style={styles.info}>{`Data: ${format(
              new Date(),
              'dd/MM/yyyy HH:mm:ss'
            )}`}</Text>
            <Text style={styles.info}>
              Assinatura do motorista:____________________________
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
