import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import CreateQR from './CreateQR';
import ReadQR from './ReadQR';

const Test = () => {
  const [data, setData] = useState('No result');

  return (
   <div>
    <h1>chào</h1>
    <div className='row'>
        <CreateQR/>
        <ReadQR/>
    </div>
   </div>
  );
};
export default Test