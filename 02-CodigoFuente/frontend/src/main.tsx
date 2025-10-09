import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './routes/Login.tsx'
import Admin from './routes/Admin.tsx'
import Menu from './routes/Menu.tsx'
import Reportes from './routes/Reportes.tsx'
import Layout from './Layout.tsx'
import Contacto from './routes/Contacto.tsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const root = createRoot(document.getElementById('root')!)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="admin" element={<Admin />} />
        <Route path="menu" element={<Menu />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<Layout />} />
    </Routes>
  </BrowserRouter>
);

//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Layout />} />
//         <Route index element={<Layout />} />
//         <Route path="login" element={<Login />} />
//         <Route path="admin" element={<Admin />} />
//         <Route path="menu" element={<Menu />} />
//         <Route path="reportes" element={<Reportes />} />
//         <Route path="*" element={<Layout />} />
//     </Routes>
//   </BrowserRouter>
// );
