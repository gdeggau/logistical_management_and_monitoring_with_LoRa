import React from 'react';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import PdfDocument from './model/cargo';

const generatePdfDocument = async (documentData) => {
  const blob = await pdf(<PdfDocument cargo={documentData} />).toBlob();
  saveAs(blob, `cargo_${documentData.cargo_number}`);
};

export default generatePdfDocument;
