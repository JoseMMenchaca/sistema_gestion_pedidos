import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedMenu from '../components/FeaturedMenu';
import Footer from '../components/Footer';
import LogoCentral from '../components/LogoCentral';
import ReportesVentas from '../components/ReportesVentas';

function Admin() {
  return (
    <>
      <Header />
      <main>
        <section>
          <LogoCentral />
        </section>
        <ReportesVentas />
      </main>

    </>
  );
}

export default Admin;