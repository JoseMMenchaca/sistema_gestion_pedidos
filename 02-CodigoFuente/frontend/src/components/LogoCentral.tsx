import React from 'react';
import endesarrollo from '../assets/endesarrollo.png';

const LogoCentral: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      marginTop: '60px' // 👈 Aumenta o disminuye este valor según necesites.
    }}>
      <img 
        src={endesarrollo} 
        alt="Logo" 
        style={{
          width: '30%', 
          borderRadius: '5%'
        }} 
      />
    </div>
  );
};

export default LogoCentral;