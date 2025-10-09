import React from 'react';
import fondo01 from '../assets/fondo01.png';

const LogoCentral: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img src={fondo01} alt="Logo" />
    </div>
  );
};

export default LogoCentral;