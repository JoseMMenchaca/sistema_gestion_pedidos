import HeaderAdmin from '../components/HeaderAdmin';
import Hero from '../components/Hero';
import FeaturedMenu from '../components/FeaturedMenu';
import Footer from '../components/Footer';
import ReportesVentas from '../components/ReporteProductosMasVendidos';

function Reportes() {
  return (
    <>
      <HeaderAdmin />
      <main>

       <h1 className="text-3xl font-bold mb-6">Reportes de Ventas</h1>

        {/* Aquí se renderiza el componente de reportes */}
        <ReportesVentas />

      </main>

    </>
  );
}

export default Reportes;