import HeaderAdmin from '../components/HeaderAdmin';
import Configuracion from '../components/modals/Configuracion';

function Admin() {
  return (
    <>
      <HeaderAdmin />
      <main className="pt-20">
        <section>
          <h1></h1>
        </section>
        <Configuracion />
      </main>

    </>
  );
}

export default Admin;