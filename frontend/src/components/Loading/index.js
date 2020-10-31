import React from 'react';
// import Loader from 'react-loader-spinner';
import { Spinner } from 'reactstrap';

export default function Loading() {
  return (
    <div>
      {/* <span style={{ color: '#007bff' }}>Loading </span> */}
      <Spinner color="primary" />
      {/* <Loader
        style={{ display: 'inline', marginLeft: '5px' }}
        type="ThreeDots"
        color="#00BFFF"
        height={16}
        width={16}
      /> */}
    </div>
  );
}
